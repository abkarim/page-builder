use tauri::{
    http::{Request, Response},
    AppHandle,
};

pub fn register_custom_protocol(
    app_handle: &AppHandle,
    request: &Request<Vec<u8>>,
) -> Response<Vec<u8>> {
    let uri = request.uri().to_string();
    println!("{:?}", uri);

    let response_body = format!("Hello from Tauri! You requested: {}", uri);

    Response::builder()
        .status(200)
        .body(response_body.as_bytes().to_vec())
        .unwrap()
}
