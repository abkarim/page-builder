use std::fs::{self};
use std::io;
use std::path::{Path, PathBuf};

pub fn is_directory_empty<P: AsRef<Path>>(directory_path: P) -> io::Result<bool> {
    let path = directory_path.as_ref();

    // Check if path exists
    if !path.exists() {
        return Ok(true); // treat non-existent as empty
    }

    // Check if path is actually a directory
    let metadata = fs::metadata(path)?;
    if !metadata.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::Other,
            format!("{:?} is not a directory", path),
        ));
    }

    // Check if the directory is empty
    let mut entries = fs::read_dir(path)?;
    Ok(entries.next().is_none())
}
/**
 * Remove project
 *
 * return success
 * if the directory path is nonexistent
 * as nothing to remove
 *
 * if force is false
 * remove directory only if the path is empty
 *
 * if not
 * remove the dir with all it's file
 * but make sure the folder is the project folder
 * that can be verified by the file project.json
 */
pub fn remove_project(dir_path: &PathBuf, force: bool) -> Result<bool, String> {
    if !dir_path.exists() {
        return Ok(true);
    }

    let is_empty = is_directory_empty(dir_path).map_err(|e| e.to_string())?;
    if !force && !is_empty {
        return Err("directory is not empty".to_string());
    }

    // Remove it
    if force {
        // proceed if directory contains project.json
        let project_file = dir_path.join("project.json");
        if !project_file.exists() {
            return Err("this is not a project directory".to_string());
        }

        fs::remove_dir_all(dir_path).map_err(|e| e.to_string())?;
    } else {
        fs::remove_dir(dir_path).map_err(|e| e.to_string())?;
    }

    Ok(true)
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

pub fn create_project(path: &PathBuf) -> Result<bool, String> {
    match fs::create_dir(path) {
        Ok(_) => Ok(true),
        Err(err) => Err(format!("Failed to create project folder: {}", err)),
    }
}

pub fn create_file(path: &PathBuf, content: String) -> Result<bool, String> {
    // Create parents directly
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    fs::write(path, content).map_err(|e| e.to_string())?;

    Ok(true)
}

pub fn get_design_files(path: &Path) -> io::Result<Vec<String>> {
    let mut files: Vec<String> = fs::read_dir(path)?
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|p| p.is_file())
        .filter(|p| p.extension().and_then(|e| e.to_str()) == Some("html"))
        .filter_map(|p| {
            p.file_stem() // removes extension
                .and_then(|os| os.to_str())
                .map(|s| s.to_string())
        })
        .collect();

    files.sort();

    Ok(files)
}

pub fn get_project_file_content(project_path: &Path, filename: &String) -> Result<String, String> {
    fs::read_to_string(project_path.join(filename)).map_err(|e| e.to_string())
}
