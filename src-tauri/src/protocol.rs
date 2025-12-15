use tauri::{
    http::{Request, Response},
    AppHandle,
};

use crate::commands::projects;

pub fn register_custom_protocol(
    app_handle: &AppHandle,
    request: &Request<Vec<u8>>,
) -> Response<Vec<u8>> {
    let uri = request.uri().to_string();
    println!("{:?}", uri);

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

    let response_body = format!("Hello from Tauri! You requested: {}", uri);

    Response::builder()
        .status(200)
        .body(response_body.as_bytes().to_vec())
        .unwrap()
}
