use std::{
    fs::{self},
    path::PathBuf,
};

#[cfg(dev)]
const BLOCKS_DIR_PATH: &str = "./../block-templates";
#[cfg(not(dev))]
const BLOCKS_DIR_PATH: &str = "./_up_/block-templates";

/**
 * Read block-components folder
 * merge blocks and return
 * contents
 */
#[tauri::command]
pub fn get_blocks() -> Result<String, String> {
    let blocks_dir_path: PathBuf = PathBuf::from(&BLOCKS_DIR_PATH);

    let paths = fs::read_dir(&blocks_dir_path).map_err(|e| e.to_string())?;

    let mut content: String = String::from("[");

    let mut currently_reading: i32 = 0;
    for path in paths {
        let mut contents: String =
            fs::read_to_string(path.unwrap().path()).expect("Failed to read file");

        // Add attribute
        contents = contents.replace(
            "$ATTR_VALUES$",
            "page-builder-element='true' draggable='true' ondragstart='dragStart(event)' onClick='handleStyle(event)' class=''",
        );

        if currently_reading > 0 {
            content.push_str(",");
            content.push_str(&contents);
        } else {
            content.push_str(&contents);
        }

        currently_reading = currently_reading + 1;
    }

    content.push_str("]");

    Ok(content)
}
