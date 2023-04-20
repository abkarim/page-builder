#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::{self, ReadDir};
use std::path::PathBuf;

#[cfg(dev)]
const BLOCKS_DIR_PATH: &str = "./../blocks";
#[cfg(not(dev))]
const BLOCKS_DIR_PATH: &str = "./_up_/blocks";

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
