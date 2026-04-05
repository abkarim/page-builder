mod commands;
mod db;
mod fs;
mod protocol;
mod snippets;
mod zip;

use commands::{projects, templates};
use std::{
    path::PathBuf,
    sync::{Mutex, OnceLock},
};
use tauri::{path::BaseDirectory, Manager};

pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");
pub static RESOURCES_DIRECTORY: OnceLock<PathBuf> = OnceLock::new();

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .register_uri_scheme_protocol(protocol::PROTOCOL, move |context, request| {
            let app_handle = context.app_handle();
            let res = protocol::register_custom_protocol(&app_handle, &request);

            let (mut parts, body) = res.into_parts();

            parts
                .headers
                .insert("Access-Control-Allow-Origin", "*".parse().unwrap());

            tauri::http::Response::from_parts(parts, body)
        })
        .setup(|app| {
            let resources_path = if cfg!(debug_assertions) {
                std::env::current_dir()
                    .expect("failed to get current directory")
                    .parent()
                    .expect("failed to get parent dir of current working dir")
                    .join("resources")
            } else {
                app.path()
                    .resolve("/", BaseDirectory::Resource)
                    .expect("failed to resolve resources directory")
            };

            RESOURCES_DIRECTORY
                .set(resources_path.clone())
                .expect("failed to set resources path");

            projects::PROJECT_ROOT
                .set(Mutex::new(None))
                .expect("Failed to initialize PROJECT_ROOT status variable");

            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            projects::create_project,
            projects::remove_project,
            projects::get_projects,
            projects::get_project,
            projects::export_project,
            projects::create_new_design,
            projects::get_designs,
            projects::get_project_file_content,
            projects::get_project_configuration,
            projects::update_current_project_configuration,
            projects::update_project_file_content,
            templates::blocks::get_blocks,
            templates::components::get_components
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
