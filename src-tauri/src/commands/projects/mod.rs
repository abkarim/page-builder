use std::{fs, path::Path};

/**
 * Is project exists
 * 
 * Checks if a project exists or not
 */
pub fn is_project_exists(uuid: &str) -> bool {
   /**
     * TODO
     * 
     * Check in db 
     * Check the path in disk
     */
    
}


/**
 * Delete project 
 */
#[tauri::command]
pub fn delete_project(uuid: &str) -> bool {
    /**
     * TODO
     * 
     * Remove from db 
     * and remove from disk
     */
}

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
pub fn get_projects() {
    /**
     * TODO
     *  
     * Read DB and get projects
     * Only return projects that are found in disk 
     */
}

/**
 * Update project
 * This function handles project info 
 * project name 
 * project path 
 * everything that is available in project.json file 
 */
pub fn update_project_details(uuid: &str) -> bool {

}

/**
 * Create project
 */
#[tauri::command]
pub fn create_project(name: &str, directory: &str) -> (bool, String) {
    let path = Path::new(directory).join(name);

    if path.exists() {
        return (false, "Project already exists".to_string());
    }

    /**
     * TODO
     *
     * generate uuid for this project
     * save this project to db
     * return uuid
     */
    match fs::create_dir(path) {
        Ok(_) => (true, "Project created successfully".to_string()),
        Err(err) => {
            let msg = format!("Failed to create project folder: {}", err);
            eprintln!("{}", msg);
            (false, msg)
        }
    }
}


/**
 * Update project file 
 */
pub fn update_project_file_content(uuid: &str, filename: &str, content: &str) -> bool {

}
