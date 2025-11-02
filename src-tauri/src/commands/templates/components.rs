use std::{
    fs::{self, ReadDir},
    path::PathBuf,
};

#[cfg(dev)]
const COMPONENTS_DIR_PATH: &str = "./../component-templates";
#[cfg(not(dev))]
const COMPONENTS_DIR_PATH: &str = "./_up_/component-templates";

/**
 * Read component-components folder
 * merge components and return
 * contents
 */
#[tauri::command]
pub fn get_components() -> String {
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
