#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, string};

fn is_file_exists(path: &str) -> bool {
    fs::metadata(path).is_ok()
}

#[tauri::command]
fn get_blocks() -> String {
    let paths = fs::read_dir("./../blocks").unwrap();

    let mut content = String::from("[");

    let mut currently_reading = 0;
    for path in paths {
        let contents = fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

        if currently_reading > 0 {
            content.push_str(",");
            content.push_str(&contents);
        } else {
            content.push_str(&contents);
        }

        currently_reading = currently_reading + 1;
    }

    content.push_str("]");
    return content;
}

#[tauri::command]
fn save_page(filename: &str, header_content: &str, content: &str) {
    let header: &str = "<!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charset=\"UTF-8\" />
      <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    ";

    let header_last: &str = "  </head>
    <body>";
    let footer: &str = "</body>

</html>";

    let mut final_data: String = String::from("");

    final_data.push_str(header);
    final_data.push_str(header_content);
    final_data.push_str(header_last);
    final_data.push_str(content);
    final_data.push_str(footer);

    fs::write(filename, final_data).expect("unable to write file");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_blocks, save_page,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
