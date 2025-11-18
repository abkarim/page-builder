use crate::commands::projects;

pub fn get_html_snippet(title: &String) -> String {
    format!(
        r#"
            <!DOCTYPE html>
            <html lang="en">
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{title}</title>
                <link rel="stylesheet" href="{css_path}styles.css">
            </head>
            <body>

                <script src"{js_path}app.js"></script>
            </body>
            </html>
        "#,
        title = title,
        css_path = projects::ASSETS_CSS_PATH,
        js_path = projects::ASSETS_JS_PATH
    )
}
