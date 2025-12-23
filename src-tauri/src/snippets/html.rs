use crate::{
    commands::projects,
    protocol::{self, EDITOR_ASSETS_PREFIX},
};

pub const PAGE_BUILDER_CLASS_NAME: &str = "page-builder-element";
pub const PAGE_BUILDER_ELEMENT_ATTRIBUTE: &str = "page-builder-element";
pub const PAGE_BUILDER_COMMENT_WRAPPER: &str = "page-builder-wrapper";

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

                <!-- {page_builder_wrapper}-start -->
                <base href="{protocol_prefix}" />
                <link rel="stylesheet" href="{editor_assets}/css/editor.css">
                <!-- {page_builder_wrapper}-end -->

                <link rel="stylesheet" href="{css_path}{project_css_filename}">

            </head>
            <body>

                <button {page_builder_element_attribute} class="insert-{page_builder_class_name}">+</button>

                <script src="{js_path}{project_js_filename}"></script>

                <!-- {page_builder_wrapper}-start -->
                <script src="{editor_assets}/js/editor.js"></script>
                <!-- {page_builder_wrapper}-end -->
            </body>
            </html>
        "#,
        title = title,
        css_path = projects::PROJECT_ASSETS_CSS_PATH,
        js_path = projects::PROJECT_ASSETS_JS_PATH,
        project_css_filename = projects::PROJECT_CSS_FILENAME,
        project_js_filename = projects::PROJECT_JS_FILENAME,
        protocol_prefix = protocol::PROTOCOL_PREFIX,
        page_builder_class_name = PAGE_BUILDER_CLASS_NAME,
        page_builder_element_attribute = PAGE_BUILDER_ELEMENT_ATTRIBUTE,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        editor_assets = EDITOR_ASSETS_PREFIX
    )
}
