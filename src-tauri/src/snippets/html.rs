pub fn get_html_snippet(title: &String) -> String {
    format!(
        r#"
        <!DOCTYPE html>
        <html>
        <head>
            <title>{}</title>
        </head>
        <body>
        </body>
        </html>
    "#,
        title
    )
}
