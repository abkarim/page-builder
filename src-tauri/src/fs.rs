use std::fs::{self};
use std::io;
use std::path::{Path, PathBuf};

pub fn is_directory_empty<P: AsRef<Path>>(directory_path: P) -> io::Result<bool> {
    let mut entries = fs::read_dir(directory_path)?;
    Ok(entries.next().is_none())
}

/**
 * Checks is a directory is empty or not
 */
#[tauri::command]
pub fn check_if_directory_empty(path: &str) -> Result<bool, String> {
    match is_directory_empty(path) {
        Ok(is_empty) => Ok(is_empty),
        Err(err) => Err(format!("Failed to check directory: {}", err)),
    }
}

pub fn project_exists(path: &str) -> bool {
    // A project exists if the path exists and is not empty
    match check_if_directory_empty(path) {
        Ok(is_empty) => !is_empty, // Not empty => exists
        Err(_) => false,           // Error reading path => does not exist
    }
}

pub fn create_project(path: PathBuf) -> (bool, String) {
    match fs::create_dir(path) {
        Ok(_) => (true, "Project created successfully".to_string()),
        Err(err) => {
            let msg = format!("Failed to create project folder: {}", err);
            eprintln!("{}", msg);
            (false, msg)
        }
    }
}
