use serde::Serialize;
use std::collections::HashMap;
use std::path::Path;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use ts_rs::TS;
use uuid::Uuid;

use crate::db;
use crate::fs;
use crate::fs::create_file;
use crate::fs::get_design_files;
use crate::snippets;
use crate::snippets::css;
use crate::snippets::js;

#[derive(Serialize, Debug, TS)]
#[ts(export)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
}

/**
 * assets path
 */
pub const PROJECT_ASSETS_CSS_PATH: &str = "assets/css/";
pub const PROJECT_ASSETS_JS_PATH: &str = "assets/js/";
pub const PROJECT_CSS_FILENAME: &str = "styles.css";
pub const PROJECT_JS_FILENAME: &str = "app.js";

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
pub fn get_project(uuid: String) -> Result<Project, String> {
    let rows = db::get(
        db::PROJECTS_TABLE,
        Some(HashMap::from([("id", uuid.clone())])),
    )
    .map_err(|e| format!("{}", e))?;

    let row = rows.into_iter().next().ok_or("Project not found")?;

    // Set current project root as the default project root
    set_project_root(row.get("path").cloned().ok_or("missing path")?)?;

    Ok(Project {
        id: row.get("id").cloned().ok_or("missing id")?,
        name: row.get("name").cloned().ok_or("missing name")?,
        path: row.get("path").cloned().ok_or("missing path")?,
    })
}

/**
 * Remove project
 */
#[tauri::command]
pub fn remove_project(uuid: String) -> Result<String, String> {
    let project = get_project(uuid.clone())?;

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
 * Update project
 * This function handles project info
 * project name
 * project path
 * everything that is available in project.json file
 */
// pub fn update_project_details(uuid: &str) -> bool {}

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

    // Add project.json
    let initial_content = format!(
        r#"{{
        "name": "{}",
    }}"#,
        name
    );
    fs::create_file(&path.join("project.json"), initial_content)?;

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

    let project = get_project(uuid)?;

    fs::create_file(
        &Path::new(&project.path).join(format!("{}.html", name)),
        snippets::html::get_html_snippet(&name),
    )?;

    Ok("Design created successfully".to_string())
}

/**
 * Get designs
 */
#[tauri::command]
pub fn get_designs(uuid: String) -> Result<Vec<String>, String> {
    let project = get_project(uuid)?;

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

    let project = get_project(uuid)?;

    let content =
        fs::get_project_file_content(&Path::new(&project.path), &format!("{}.html", name))?;

    Ok(content)
}

// /**
//  * Update project file
//  */
// pub fn update_project_file_content(uuid: &str, filename: &str, content: &str) -> bool {}
