use serde::Serialize;
use std::collections::HashMap;
use std::path::Path;
use std::path::PathBuf;
use ts_rs::TS;
use uuid::Uuid;

use crate::db;
use crate::fs;
use crate::snippets;

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
pub const ASSETS_PATH: &str = "/assets/";
pub const ASSETS_CSS_PATH: &str = "/assets/css/";
pub const ASSETS_JS_PATH: &str = "/assets/js/";
pub const PROJECT_CSS_FILENAME: &str = "styles.css";
pub const PROJECT_JS_FILENAME: &str = "app.js";

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
    std::fs::write(path.join("project.json"), initial_content).map_err(|e| e.to_string())?;

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
        match create_new_design(String::from("Home"), id) {
            Ok(_) => {}
            Err(_e) => {}
        }
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

    std::fs::write(
        Path::new(&project.path).join(format!("{}.html", name)),
        snippets::html::get_html_snippet(&name),
    )
    .map_err(|e| e.to_string())?;

    Ok("Design created successfully".to_string())
}

// /**
//  * Update project file
//  */
// pub fn update_project_file_content(uuid: &str, filename: &str, content: &str) -> bool {}
