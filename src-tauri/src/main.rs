#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

#[tauri::command]
fn get_blocks() -> String {
    let paths = fs::read_dir("./../blocks").unwrap();

    let mut content = String::from("[");

    let mut currently_reading = 0;
    for path in paths {
        let contents = fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

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
fn save_new_page(filename: &str, content: &str) -> bool {
    return true;
}

#[tauri::command]
fn update_page(filename: &str, content: &str) -> bool {
    return true;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_blocks,
            save_new_page,
            update_page
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
