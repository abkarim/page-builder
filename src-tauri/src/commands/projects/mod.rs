use std::path::Path;

use crate::db;
use crate::fs;

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
 * Get projects
 */
#[tauri::command]
pub fn get_projects() -> Vec<db::Project> {
    let projects = match db::get(db::PROJECTS_TABLE, None) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("Failed to get projects: {}", e);
            return vec![];
        }
    };

    // Map HashMap<String,String> to Project
    let projects: Vec<db::Project> = projects
        .into_iter()
        .map(|row| db::Project {
            id: row.get("id").cloned().unwrap_or_default(),
            name: row.get("name").cloned().unwrap_or_default(),
            path: row.get("path").cloned().unwrap_or_default(),
        })
        .collect();

    // Only return projects that exists on disk
    let existing_projects: Vec<db::Project> = projects
        .into_iter()
        .filter(|p| fs::project_exists(&p.path))
        .collect();

    existing_projects
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
pub fn create_project(name: &str, directory: &str) -> (bool, String) {
    let path = Path::new(directory).join(name);

    if path.exists() {
        return (false, "Project already exists".to_string());
    }

    fs::create_project(path)
}

// /**
//  * Update project file
//  */
// pub fn update_project_file_content(uuid: &str, filename: &str, content: &str) -> bool {}
