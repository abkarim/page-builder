use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use walkdir::WalkDir;
use zip::write::SimpleFileOptions;

pub fn perform_zip(src_dir: &Path, dst_file: &Path) -> zip::result::ZipResult<()> {
    let file = File::create(dst_file)?;
    let mut zip = zip::ZipWriter::new(file);
    let options = SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);

    let walk = WalkDir::new(src_dir);

    for entry in walk.into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();

        // CRITICAL: Skip the destination zip file itself to avoid recursion
        if path == dst_file {
            continue;
        }

        let name = path.strip_prefix(src_dir).unwrap();

        if path.is_dir() {
            zip.add_directory(name.to_string_lossy(), options)?;
        } else if path.is_file() {
            zip.start_file(name.to_string_lossy(), options)?;
            let mut f = File::open(path)?;

            // Using std::io::copy is more memory efficient than reading to a buffer
            std::io::copy(&mut f, &mut zip)?;
        }
    }

    zip.finish()?;
    Ok(())
}
