mod commands;
mod db;
mod fs;
mod protocol;
mod snippets;
mod zip;

use commands::{projects, templates};
use std::sync::Mutex;
use tauri::{path::BaseDirectory, Manager};

pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

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
            let resources_path = app.path().resolve("/", BaseDirectory::Resource)?;

            projects::PROJECT_ROOT
                .set(Mutex::new(None))
                .expect("Failed to initialize PROJECT_ROOT status variable");

            projects::EDITOR_ASSETS_PATH
                .set(resources_path.join("editor-assets"))
                .expect("failed to set editor assets path");

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
            projects::update_project_file_content,
            templates::blocks::get_blocks,
            templates::components::get_components
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
