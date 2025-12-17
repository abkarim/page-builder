use crate::{commands::projects, protocol};

pub fn get_html_snippet(title: &String) -> String {
    format!(
        r#"
            <!DOCTYPE html>
            <html lang="en">
            <html>
            <head>
                <base href="{protocol_prefix}" />
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{title}</title>
                <link rel="stylesheet" href="{css_path}{project_css_filename}">
            </head>
            <body>

                <script src="{js_path}{project_js_filename}"></script>
            </body>
            </html>
        "#,
        title = title,
        css_path = projects::PROJECT_ASSETS_CSS_PATH,
        js_path = projects::PROJECT_ASSETS_JS_PATH,
        project_css_filename = projects::PROJECT_CSS_FILENAME,
        project_js_filename = projects::PROJECT_JS_FILENAME,
        protocol_prefix = protocol::PROTOCOL_PREFIX
    )
}
