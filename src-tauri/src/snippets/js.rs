pub fn generate_default_js() -> String {
    r#"
        export const sleep = ms => new Promise(res => setTimeout(res, ms));

    "#
    .to_string()
}
