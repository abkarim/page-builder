use tauri::{
    http::{Request, Response},
    AppHandle,
};

use crate::commands::projects;

pub const PROTOCOL: &str = "project";
pub const PROTOCOL_PREFIX: &str = "project://localhost/";

pub fn register_custom_protocol(
    _app_handle: &AppHandle,
    request: &Request<Vec<u8>>,
) -> Response<Vec<u8>> {
    let uri = request.uri().to_string();

    let project_root = match projects::get_project_root() {
        Ok(path) => path,
        Err(err) => {
            println!("{}", err);
            return Response::builder()
                .status(404)
                .body("Not found".as_bytes().to_vec())
                .unwrap();
        }
    };

    // get actual response
    let uri = uri.replace(PROTOCOL_PREFIX, "");

    println!("{:?}", uri);

    let response_body = format!("Hello from Tauri! You requested: {}", uri);

    Response::builder()
        .status(200)
        .body(response_body.as_bytes().to_vec())
        .unwrap()
}
