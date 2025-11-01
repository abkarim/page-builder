use std::fs::{self, ReadDir};
use std::io;
use std::path::{Path, PathBuf};

#[cfg(dev)]
const BLOCKS_DIR_PATH: &str = "./../block-templates";
#[cfg(not(dev))]
const BLOCKS_DIR_PATH: &str = "./_up_/block-templates";

#[cfg(dev)]
const COMPONENTS_DIR_PATH: &str = "./../component-templates";
#[cfg(not(dev))]
const COMPONENTS_DIR_PATH: &str = "./_up_/component-templates";

/**
 * Read block-components folder
 * merge blocks and return
 * contents
 */
#[tauri::command]
fn get_blocks() -> String {
    let blocks_dir_path: PathBuf = PathBuf::from(&BLOCKS_DIR_PATH);

    let paths: ReadDir = match fs::read_dir(&blocks_dir_path) {
        Ok(paths) => paths,
        Err(err) => {
            eprintln!("Failed to open blocks directory: {}", err);
            return String::from("[]");
        }
    };

    let mut content: String = String::from("[");

    let mut currently_reading: i32 = 0;
    for path in paths {
        let mut contents: String =
            fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

        // Add attribute
        contents = contents.replace(
            "page-builder-element='true'",
            "page-builder-element='true' draggable='true' ondragstart='dragStart(event)' onClick='handleStyle(event)' class=''",
        );

        if currently_reading > 0 {
            content.push_str(",");
            content.push_str(&contents);
        } else {
            content.push_str(&contents);
        }

        currently_reading = currently_reading + 1;
    }

    content.push_str("]");
    return content;
}

/**
 * Read component-components folder
 * merge components and return
 * contents
 */
#[tauri::command]
fn get_components() -> String {
    let components_dir_path: PathBuf = PathBuf::from(&COMPONENTS_DIR_PATH);

    let paths: ReadDir = match fs::read_dir(&components_dir_path) {
        Ok(paths) => paths,
        Err(err) => {
            eprintln!("Failed to open components directory: {}", err);
            return String::from("[]");
        }
    };

    let mut content: String = String::from("[");

    let mut currently_reading: i32 = 0;
    for path in paths {
        let contents: String =
            fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

        if currently_reading > 0 {
            content.push_str(",");
            content.push_str(&contents);
        } else {
            content.push_str(&contents);
        }

        currently_reading = currently_reading + 1;
    }

    content.push_str("]");
    return content;
}

/**
 * Create project
 */
#[tauri::command]
fn create_project(name: &str, directory: &str) -> (bool, String) {
    let path = Path::new(directory).join(name);

    if path.exists() {
        return (false, "Project already exists".to_string());
    }

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
 * Get project
 */
#[tauri::command]
fn get_project(uuid: &str) -> &str {
    return uuid;
}

/**
 * Get projects
 */
#[tauri::command]
fn get_projects() {}

/**
 * Save contents in a file
 */
#[tauri::command]
fn save_page(filename: &str, content: &str) {
    fs::write(filename, content).expect("unable to write file");
}

fn is_directory_empty<P: AsRef<Path>>(directory_path: P) -> io::Result<bool> {
    let mut entries = fs::read_dir(directory_path)?;
    Ok(entries.next().is_none())
}

/**
 * Checks is a directory is empty or not
 */
#[tauri::command]
fn check_if_directory_empty(path: &str) -> Result<bool, String> {
    match is_directory_empty(path) {
        Ok(is_empty) => Ok(is_empty),
        Err(err) => Err(format!("Failed to check directory: {}", err)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            save_page,
            get_blocks,
            get_components,
            create_project,
            get_project,
            get_projects,
            check_if_directory_empty
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
