use mime_guess;
use percent_encoding::percent_decode_str;
use std::{fs, path::Path};

use tauri::{
    http::{Request, Response, StatusCode},
    AppHandle,
};

use crate::commands::projects::{self, EDITOR_ASSETS_PATH};

pub const PROTOCOL: &str = "project";
pub const PROTOCOL_PREFIX: &str = "project://localhost/";
pub const EDITOR_ASSETS_PREFIX: &str = "core";

pub fn register_custom_protocol(
    _app_handle: &AppHandle,
    request: &Request<Vec<u8>>,
) -> Response<Vec<u8>> {
    let uri = request.uri().to_string();
    let decoded_uri = percent_decode_str(&uri.replace(PROTOCOL_PREFIX, ""))
        .decode_utf8_lossy()
        .trim_start_matches('/')
        .to_string();

    let mut response = Response::builder().status(200).body(Vec::new()).unwrap();

    // Prevent Path Traversal
    // Check if any part of the path attempts to go "up" using '..'
    if decoded_uri.contains("..") || decoded_uri.starts_with('/') || decoded_uri.contains('\\') {
        *response.status_mut() = StatusCode::FORBIDDEN;
        *response.body_mut() = "Access Denied: Illegal path sequence".as_bytes().to_vec();
        return response;
    }

    // Prevents access to .env, .git, .htaccess, etc.
    if decoded_uri
        .split('/')
        .any(|segment| segment.starts_with('.'))
    {
        *response.status_mut() = StatusCode::FORBIDDEN;
        *response.body_mut() = "Access Denied: Hidden files restricted".as_bytes().to_vec();
        return response;
    }

    let project_root = match projects::get_project_root() {
        Ok(path) => path,
        Err(err) => {
            *response.status_mut() = StatusCode::NOT_FOUND;
            *response.body_mut() = err.as_bytes().to_vec();

            return response;
        }
    };

    let editor_assets_prefix = format!("{}/", EDITOR_ASSETS_PREFIX);
    // is this uri requests core files
    if decoded_uri.starts_with(&editor_assets_prefix) {
        let decoded_uri = decoded_uri.replace(&editor_assets_prefix, "");

        let dir_path = EDITOR_ASSETS_PATH
            .get()
            .expect("editor assets path not found");
        if !dir_path.exists() {
            *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
            *response.body_mut() = "editor assets not found".as_bytes().to_vec();
            return response;
        }

        let dir_path = dir_path.join(decoded_uri);
        if !dir_path.exists() {
            *response.status_mut() = StatusCode::NOT_FOUND;
            *response.body_mut() = "editor asset not found".as_bytes().to_vec();
            return response;
        }

        match fs::read(&dir_path) {
            Ok(data) => {
                *response.status_mut() = StatusCode::OK;
                *response.body_mut() = data;

                let mime = mime_guess::from_path(&dir_path)
                    .first_or_octet_stream()
                    .to_string();
                response
                    .headers_mut()
                    .insert("Content-Type", mime.parse().unwrap());
            }
            Err(err) => {
                *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                *response.body_mut() = format!("Error: {}", err).into_bytes();
            }
        }

        return response;
    }

    let file_path = Path::new(&project_root).join(&decoded_uri);
    if !file_path.exists() {
        *response.status_mut() = StatusCode::NOT_FOUND;
        *response.body_mut() = "requested file not found".as_bytes().to_vec();

        return response;
    }

    // read file as bytes
    match fs::read(&file_path) {
        Ok(data) => {
            *response.status_mut() = StatusCode::OK;
            *response.body_mut() = data;

            // set the content type
            let mime = mime_guess::from_path(&file_path)
                .first_or_octet_stream()
                .to_string();
            response
                .headers_mut()
                .insert("Content-Type", mime.parse().unwrap());
        }
        Err(err) => {
            *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
            *response.body_mut() = format!("Error: {}", err).into_bytes();
        }
    }

    response
}
