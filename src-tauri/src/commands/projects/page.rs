use std::{
    path::PathBuf,
    sync::{Mutex, OnceLock},
};

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS, Default)]
#[ts(export)]
pub struct PageSettings {
    #[serde(default)]
    title: String,

    #[serde(default)]
    css_links: Vec<String>,

    #[serde(default)]
    js_links: Vec<String>,
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

fn get_current_page_path() -> Result<PathBuf, String> {
    let current_project = crate::projects::get_project_root()?;
    let current_page = get_current_page()?;

    let page_path = PathBuf::from(current_project).join(current_page);

    if !page_path.exists() {
        return Err("current page not found".to_string());
    }

    Ok(page_path)
}

#[tauri::command]
pub fn get_current_page_settings() -> Result<PageSettings, String> {
    let current_page_path = get_current_page_path()?;
    let settings = PageSettings::default();

    Ok(settings)
}
