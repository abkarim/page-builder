use std::{
    collections::HashMap,
    path::PathBuf,
    sync::{Mutex, OnceLock},
};

use chrono::Utc;
use serde::{Deserialize, Serialize};
use strum::{AsRefStr, Display};
use ts_rs::TS;

use crate::{
    commands::projects::{get_project_configuration, get_project_root},
    db,
};

#[derive(Debug, Serialize, Deserialize, TS, Default, Display, AsRefStr)]
pub enum LinkScope {
    Project,

    #[default]
    Page,
}

#[derive(Debug, Serialize, Deserialize, TS, Default)]
pub struct LinkSchema {
    #[serde(default)]
    pub link: String,
    pub scope: LinkScope,
    pub identifier: String,
}

#[derive(Debug, Serialize, Deserialize, TS, Default)]
#[ts(export)]
pub struct PageSettings {
    #[serde(default)]
    pub title: String,

    #[serde(default)]
    pub css_links: Vec<LinkSchema>,

    #[serde(default)]
    pub js_links: Vec<LinkSchema>,
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

/**
 * Update project file
 */
#[tauri::command]
pub fn update_current_page_content(new_content: String) -> Result<String, String> {
    let project_configuration = get_project_configuration()?;
    let project_root = get_project_root()?;
    let current_page_name = get_current_page()?;

    let project_path = PathBuf::from(project_root);

    crate::fs::write_project_file_content(&project_path, &current_page_name, new_content)?;

    // Set updated at in db
    let mut data_to_update = HashMap::new();
    data_to_update.insert("updated_at", Utc::now().to_rfc3339());

    let mut filter = HashMap::new();
    filter.insert("id", project_configuration.uuid.clone());

    db::update(db::PROJECTS_TABLE, data_to_update, filter).map_err(|e| e.to_string())?;

    Ok("updated successfully".to_string())
}

#[tauri::command]
pub fn get_current_page_settings() -> Result<PageSettings, String> {
    let project_root = get_project_root()?;
    let current_page_name = get_current_page()?;

    let html_content =
        crate::fs::get_project_file_content(&PathBuf::from(project_root), &current_page_name)?;

    let settings = crate::snippets::html::get_asset_configurations(html_content);

    Ok(settings)
}

#[tauri::command]
pub fn save_current_page_settings(settings: PageSettings) -> Result<String, String> {
    let project_root = get_project_root()?;
    let current_page_name = get_current_page()?;

    let project_path = PathBuf::from(project_root);

    let current_content = crate::fs::get_project_file_content(&project_path, &current_page_name)?;
    let updated_content =
        crate::snippets::html::update_asset_configurations(current_content, settings);

    update_current_page_content(updated_content)?;

    Ok("settings saved successfully".to_string())
}
