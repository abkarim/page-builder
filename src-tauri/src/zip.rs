use minify_html::{minify, Cfg};
use std::fs::File;
use std::io::Write;
use std::path::Path;
use walkdir::WalkDir;
use zip::write::SimpleFileOptions;

pub fn perform_zip(
    src_dir: &Path,
    dst_file: &Path,
    minify_web_file: bool,
) -> zip::result::ZipResult<()> {
    let file = File::create(dst_file)?;
    let mut zip = zip::ZipWriter::new(file);
    let options = SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);

    let minify_cfg = Cfg {
        minify_css: true,
        minify_js: true,
        keep_comments: false,
        ..Default::default()
    };

    let walk = WalkDir::new(src_dir);

    for entry in walk.into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();

        // CRITICAL: Skip the destination zip file itself to avoid recursion
        if path == dst_file {
            continue;
        }

        let name = path.strip_prefix(src_dir).unwrap();
        let name_str = name.to_string_lossy();

        if path.is_dir() {
            zip.add_directory(name_str, options)?;
        } else if path.is_file() {
            zip.start_file(name_str, options)?;

            let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
            let is_web_file = matches!(ext, "html" | "css" | "js");

            let mut fallback = true;

            if minify_web_file && is_web_file {
                if let Ok(content) = std::fs::read_to_string(path) {
                    let minified = minify(content.as_bytes(), &minify_cfg);
                    zip.write_all(&minified)?;
                    fallback = false;
                }
            }

            if fallback == true {
                let mut f = File::open(path)?;
                // Using std::io::copy is more memory efficient than reading to a buffer
                std::io::copy(&mut f, &mut zip)?;
            }
        }
    }

    zip.finish()?;
    Ok(())
}
