use std::fs::{self, ReadDir};
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
