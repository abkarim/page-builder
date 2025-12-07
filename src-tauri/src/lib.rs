mod commands;
mod db;
mod fs;
mod snippets;

use commands::{projects, templates};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            projects::create_project,
            projects::remove_project,
            projects::get_projects,
            projects::get_project,
            projects::create_new_design,
            projects::get_designs,
            projects::get_project_file_content,
            templates::blocks::get_blocks,
            templates::components::get_components
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
