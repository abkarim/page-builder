use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{LazyLock, Mutex, OnceLock};
use ts_rs::TS;
use uuid::Uuid;

use crate::fs::{
    self, create_file, get_design_files, get_project_root_file_content,
    write_project_root_file_content,
};
use crate::snippets::{self, css, html::get_updated_contents, js};
use crate::zip;
use crate::APP_VERSION;
use crate::{db, RESOURCES_DIRECTORY};

#[derive(Serialize, Debug, TS)]
#[ts(export)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub updated_at: String,
}

#[derive(Default, Debug, Serialize, Deserialize, TS)]
struct Color {
    name: String,
    value: String,
}
#[derive(Default, Debug, Serialize, Deserialize, TS)]
pub struct ProjectConfiguration {
    color: Vec<Color>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export)]
#[serde[default]]
pub struct ProjectData {
    name: String,
    app_version: String,
    configuration: ProjectConfiguration,
}

impl Default for ProjectData {
    fn default() -> Self {
        Self {
            name: "Untitled Project".to_string(),
            app_version: "".to_string(),
            configuration: ProjectConfiguration::default(),
        }
    }
}

pub const PROJECT_FILE_NAME: &str = "project.json";

/**
 * assets path
 */
pub const PROJECT_ASSETS_CSS_PATH: &str = "assets/css/";
pub const PROJECT_ASSETS_JS_PATH: &str = "assets/js/";
pub const PROJECT_CSS_FILENAME: &str = "styles.css";
pub const PROJECT_JS_FILENAME: &str = "app.js";

/**
 * Editor assets
 */
pub static EDITOR_ASSETS_PATH: LazyLock<PathBuf> = LazyLock::new(|| {
    RESOURCES_DIRECTORY
        .get()
        .expect("failed to get resources directory")
        .join("editor-assets")
});

pub static PROJECT_ROOT: OnceLock<Mutex<Option<String>>> = OnceLock::new();

/**
 * Get project root
 * the project that is current open
 */
pub fn get_project_root() -> Result<String, String> {
    let root_mutex = match PROJECT_ROOT.get() {
        Some(m) => m,
        None => return Err("Project root is not initialized".to_string()),
    };

    let root_guard = match root_mutex.lock() {
        Ok(guard) => guard,
        Err(e) => return Err(format!("Failed to lock Project_Root Mutex: {}", e)),
    };

    match root_guard.as_ref() {
        Some(path) => Ok(path.clone()),
        None => Err("Project root is not set".to_string()),
    }
}

/**
 * Set project root of the project
 * that is currently open
 */
pub fn set_project_root(new_path: String) -> Result<(), String> {
    let root_mutex = match PROJECT_ROOT.get() {
        Some(m) => m,
        None => return Err("Project Root static variable not initialized.".to_string()),
    };

    let mut root_guard = match root_mutex.lock() {
        Ok(guard) => guard,
        Err(e) => return Err(format!("Failed to lock ProjectRoot Mutex: {}", e)),
    };

    *root_guard = Some(new_path.clone());
    Ok(())
}

/**
 * Get project
 */
#[tauri::command]
pub fn get_project(uuid: String, fix_if_required: Option<bool>) -> Result<Project, String> {
    let fix_if_required = fix_if_required.unwrap_or(false);

    let rows = db::get(
        db::PROJECTS_TABLE,
        Some(HashMap::from([("id", uuid.clone())])),
    )
    .map_err(|e| format!("{}", e))?;

    let row = rows.into_iter().next().ok_or("project not found")?;

    let uuid = row.get("id").cloned().unwrap();
    let project_path = row.get("path").cloned().unwrap();

    // Set current project root as the default project root
    set_project_root(project_path.clone())?;

    // Check if requested fixing
    if fix_if_required {
        let project_data = get_project_configuration()?;

        // upgrade project if version in the file doesn't match to app version
        if project_data.app_version != APP_VERSION {
            upgrade_project(Path::new(&project_path), &uuid)?;
        }
    }

    Ok(Project {
        id: uuid,
        name: row.get("name").cloned().ok_or("missing name")?,
        path: project_path,
        updated_at: row.get("updated_at").cloned().ok_or("missing updated_at")?,
    })
}

#[tauri::command]
pub fn get_project_configuration() -> Result<ProjectData, String> {
    let path = get_project_root()?;
    fs::get_project_root_file_content(&PathBuf::from(path).join(PROJECT_FILE_NAME))
}

/**
* Export project
*/
#[tauri::command]
pub fn export_project(uuid: String) -> Result<String, String> {
    let project = get_project(uuid.clone(), None)?;

    let src_path = Path::new(&project.path);
    let dst_path = src_path.join("export.zip");

    zip::perform_zip(&src_path, &dst_path, true).map_err(|e| format!("Zip err: {}", e))?;

    return Ok(format!(
        "project exported to {} successfully...",
        dst_path.to_string_lossy()
    ));
}

/**
 * Remove project
 */
#[tauri::command]
pub fn remove_project(uuid: String) -> Result<String, String> {
    let project = get_project(uuid.clone(), None)?;

    // remove project from disk
    let path = PathBuf::from(&project.path);
    fs::remove_project(&path, true)?;

    // remove project from database
    db::delete(db::PROJECTS_TABLE, HashMap::from([("id", project.id)]))
        .map_err(|e| format!("{}", e))?;

    return Ok("project removed successfully".to_string());
}

/**
 * Get projects
 */
#[tauri::command]
pub fn get_projects() -> Result<Vec<Project>, String> {
    let projects = db::get(db::PROJECTS_TABLE, None).map_err(|e| format!("Error: {}", e))?;

    // Map HashMap<String,String> to Project
    let projects: Vec<Project> = projects
        .into_iter()
        .map(|row| Project {
            id: row.get("id").cloned().unwrap_or_default(),
            name: row.get("name").cloned().unwrap_or_default(),
            path: row.get("path").cloned().unwrap_or_default(),
            updated_at: row.get("updated_at").cloned().unwrap_or_default(),
        })
        .collect();

    // Only return projects that exists on disk
    let existing_projects: Vec<Project> = projects
        .into_iter()
        .filter(|p| fs::project_exists(&p.path))
        .collect();

    Ok(existing_projects)
}

/**
 * Upgrade projects
 */
fn upgrade_project(project_path: &Path, uuid: &String) -> Result<bool, String> {
    // upgrade all designs
    let designs = fs::get_design_files(&project_path).unwrap();
    for design in designs {
        match fs::get_project_file_content(&project_path, &format!("{}.html", &design)) {
            Ok(content) => {
                let updated_content = get_updated_contents(content);
                update_project_file_content(uuid.clone(), design, updated_content)?;
            }
            Err(err) => {
                println!("Err: {}", err);
            }
        };
    }

    // upgrade assets
    std::fs::write(
        &project_path
            .join(PROJECT_ASSETS_CSS_PATH)
            .join(PROJECT_CSS_FILENAME),
        snippets::css::generate_css_snippet(),
    )
    .map_err(|e| format!("failed to update css file: {}", e.to_string()))?;
    std::fs::write(
        &project_path
            .join(PROJECT_ASSETS_JS_PATH)
            .join(PROJECT_JS_FILENAME),
        snippets::js::generate_default_js(),
    )
    .map_err(|e| format!("failed to update js file: {}", e.to_string()))?;

    update_project_details(uuid, None)?;

    Ok(true)
}

/**
 * Update project
 * This function handles project info
 * project name
 * project path
 * everything that is available in project.json file
 */
pub fn update_project_details(uuid: &String, name: Option<String>) -> Result<(), String> {
    let name = name.unwrap_or("".to_string());

    let project = get_project(uuid.clone(), None)?;
    let path = Path::new(&project.path).join(PROJECT_FILE_NAME);

    let mut project_data: ProjectData = fs::get_project_root_file_content(&path)?;

    project_data.app_version = APP_VERSION.to_string();

    if name.trim().len() != 0 {
        project_data.name = name;
    }

    fs::write_project_root_file_content(&path, &project_data)?;

    Ok(())
}

/**
 * Create project
 */
#[tauri::command]
pub fn create_project(name: &str, directory: &str) -> Result<String, String> {
    let path = Path::new(directory).join(name);

    if path.exists() {
        return Err("Directory is not empty".to_string());
    }

    fs::create_project(&path).map_err(|e| e.to_string())?;

    let project_data = ProjectData {
        name: name.to_string(),
        app_version: APP_VERSION.to_string(),
        configuration: ProjectConfiguration::default(),
    };

    // Add project.json
    fs::write_project_root_file_content(&path.join(PROJECT_FILE_NAME), &project_data)?;

    // Insert to db
    let mut data_to_insert = HashMap::new();

    let id = Uuid::new_v4().to_string();

    data_to_insert.insert("id", id.clone());
    data_to_insert.insert("name", name.to_string());
    data_to_insert.insert("path", path.to_string_lossy().to_string());

    let result = match db::insert(db::PROJECTS_TABLE, data_to_insert) {
        Ok(_) => Ok(id.clone()),
        Err(e) => {
            // Delete created folder
            fs::remove_project(&path, true)?;
            Err(e.to_string())
        }
    };

    if let Ok(_) = &result {
        // Create default design file
        create_new_design(String::from("Home"), id)?;

        // Create project css file
        create_file(
            &path
                .join(PROJECT_ASSETS_CSS_PATH)
                .join(PROJECT_CSS_FILENAME),
            css::generate_css_snippet(),
        )?;

        // Create project js file
        create_file(
            &path.join(PROJECT_ASSETS_JS_PATH).join(PROJECT_JS_FILENAME),
            js::generate_default_js(),
        )?;
    }

    result
}

/**
 * Create new design
 */
#[tauri::command]
pub fn create_new_design(name: String, uuid: String) -> Result<String, String> {
    if name.trim().len() == 0 {
        return Err("Name can't be empty".to_string());
    }
    if uuid.trim().len() == 0 {
        return Err("Project id is required".to_string());
    }

    let project = get_project(uuid.clone(), None)?;

    fs::create_file(
        &Path::new(&project.path).join(format!("{}.html", name)),
        snippets::html::get_html_snippet(&name),
    )?;

    // Set updated at in db
    let mut data_to_update = HashMap::new();
    data_to_update.insert("updated_at", Utc::now().to_rfc3339());

    let mut filter = HashMap::new();
    filter.insert("id", uuid.clone());

    db::update(db::PROJECTS_TABLE, data_to_update, filter).map_err(|e| e.to_string())?;

    Ok("Design created successfully".to_string())
}

/**
 * Get designs
 */
#[tauri::command]
pub fn get_designs(uuid: String) -> Result<Vec<String>, String> {
    let project = get_project(uuid, None)?;

    let designs = get_design_files(Path::new(&project.path)).map_err(|e| e.to_string())?;

    Ok(designs)
}

/**
 * Get content of a project file
 */
#[tauri::command]
pub fn get_project_file_content(uuid: String, name: String) -> Result<String, String> {
    if uuid.trim().len() == 0 {
        return Err("uuid is required".to_string());
    }

    if name.trim().len() == 0 {
        return Err("name is required".to_string());
    }

    let project = get_project(uuid, None)?;

    let content =
        fs::get_project_file_content(&Path::new(&project.path), &format!("{}.html", name))?;

    Ok(content)
}

/**
 * Update project file
 */
#[tauri::command]
pub fn update_project_file_content(
    uuid: String,
    filename: String,
    new_content: String,
) -> Result<String, String> {
    if uuid.trim().len() == 0 {
        return Err("project id is required".to_string());
    }

    if filename.trim().len() == 0 {
        return Err("filename is required".to_string());
    }

    // Check project
    let project = get_project(uuid.clone(), None)?;

    // Check file
    let file_path = Path::new(&project.path).join(&format!("{}.html", filename));
    if !file_path.exists() {
        return Err("file not found".to_string());
    }

    match std::fs::write(file_path, new_content) {
        Ok(_) => {}
        Err(err) => return Err(format!("Error: {}", err)),
    }

    // Set updated at in db
    let mut data_to_update = HashMap::new();
    data_to_update.insert("updated_at", Utc::now().to_rfc3339());

    let mut filter = HashMap::new();
    filter.insert("id", uuid.clone());

    db::update(db::PROJECTS_TABLE, data_to_update, filter).map_err(|e| e.to_string())?;

    Ok("updated successfully".to_string())
}

#[tauri::command]
pub fn update_current_project_configuration(
    config: ProjectConfiguration,
) -> Result<String, String> {
    let project_root = get_project_root()?;
    let project_file_path = PathBuf::from(project_root).join(PROJECT_FILE_NAME);

    let mut project_data = get_project_root_file_content(&project_file_path)?;

    project_data.configuration = config;

    write_project_root_file_content(&project_file_path, &project_data)?;

    Ok("Configuration updated Successfully".to_string())
}
