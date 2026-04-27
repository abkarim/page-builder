use std::{
    path::PathBuf,
    sync::{Mutex, OnceLock},
};

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::commands::projects::get_project_root;

#[derive(Debug, Serialize, Deserialize, TS, Default)]
#[ts(export)]
pub struct PageSettings {
    #[serde(default)]
    pub title: String,

    #[serde(default)]
    pub css_links: Vec<String>,

    #[serde(default)]
    pub js_links: Vec<String>,
}

pub static CURRENT_PAGE: OnceLock<Mutex<Option<String>>> = OnceLock::new();

pub fn get_current_page() -> Result<String, String> {
    let page_mutex = match CURRENT_PAGE.get() {
        Some(m) => m,
        None => return Err("current page is not initialized".to_string()),
    };

    let mutex_guard = match page_mutex.lock() {
        Ok(g) => g,
        Err(e) => return Err(format!("failed to lock current page mutex {}", e)),
    };

    match mutex_guard.as_ref() {
        Some(p) => Ok(p.clone()),
        None => Err("current page not found".to_string()),
    }
}

#[tauri::command]
pub fn set_current_page(path: String) -> Result<String, String> {
    let page_mutex = match CURRENT_PAGE.get() {
        Some(m) => m,
        None => return Err("current page is not initialized".to_string()),
    };

    let mut mutex_guard = match page_mutex.lock() {
        Ok(g) => g,
        Err(e) => return Err(format!("failed to lock current page mutex {}", e)),
    };

    *mutex_guard = Some(path.clone());

    Ok("setting current page success".to_string())
}

#[tauri::command]
pub fn get_current_page_settings() -> Result<PageSettings, String> {
    let project_root = get_project_root()?;
    let current_page_name = get_current_page()?;

    let html_content =
        crate::fs::get_project_file_content(&PathBuf::from(project_root), &current_page_name)?;

    let settings = crate::snippets::html::get_configurations(html_content);

    Ok(settings)
}

#[tauri::command]
pub fn save_current_page_settings(settings: PageSettings) -> Result<String, String> {
    let project_root = get_project_root()?;
    let current_page_name = get_current_page()?;

    // let html_content =
    //     crate::fs::get_project_file_content(&PathBuf::from(project_root), &current_page_name)?;

    // let settings = crate::snippets::html::get_configurations(html_content);

    Ok("settings saved successfully".to_string())
}
