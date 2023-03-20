#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
// use regex::Regex;

// fn is_file_exists(path: &str) -> bool {
//     fs::metadata(path).is_ok()
// }

#[tauri::command]
fn get_blocks() -> String {
    let paths = fs::read_dir("./../blocks").unwrap();

    let mut content = String::from("[");

    let mut currently_reading = 0;
    for path in paths {
        let mut contents = fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

        // Add default text

        // Add default style

        // Add attribute
        contents = contents.replace(
            "page-builder-element='true'",
            "page-builder-element='true' draggable='true' ondragstart='dragStart(event)' class='demo'",
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

#[tauri::command]
fn save_page(filename: &str, content: &str) {
    fs::write(filename, content).expect("unable to write file");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_blocks, save_page,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
