use serde::Serialize;
use std::collections::HashMap;
use std::path::Path;
use ts_rs::TS;
use uuid::Uuid;

use crate::db;
use crate::fs;

#[derive(Serialize, Debug, TS)]
#[ts(export)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
}

/**
 * Is project exists
 *
 * Checks if a project exists
 * in db and disk
 */
// pub fn is_project_exists(uuid: &str) -> bool {}

/**
 * Delete project
 * from disk and db
 */
// #[tauri::command]
// pub fn delete_project(uuid: &str) -> bool {}

/**
 * Get project
 */
#[tauri::command]
pub fn get_project(uuid: &str) -> &str {
    return uuid;
}

/**
 * Remove project
 */
#[tauri::command]
pub fn remove_project(uuid: String) -> Result<String, String> {
    let project = db::get(
        db::PROJECTS_TABLE,
        Some(HashMap::from([("id", uuid.clone())])),
    );

    println!("{:#?}", project);

    return Ok("debug".to_string());

    // Get project info from db
    // let force = true;
    // let dir_path = Path::new("");

    // match fs::remove_project(dir_path, force) {
    //     Ok(_) => Ok(String::from("project removed successfully")),
    //     Err(e) => Err(format!("Err: {}", e)),
    // }
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
        "name": {},
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

    match db::insert(db::PROJECTS_TABLE, data_to_insert) {
        Ok(_) => Ok("project created successfully".to_string()),
        Err(e) => {
            // Delete created folder
            fs::remove_project(&path, true)?;
            Err(e.to_string())
        }
    }
}

// /**
//  * Update project file
//  */
// pub fn update_project_file_content(uuid: &str, filename: &str, content: &str) -> bool {}
