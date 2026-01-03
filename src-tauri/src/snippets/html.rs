use crate::{
    commands::projects,
    protocol::{self, EDITOR_ASSETS_PREFIX},
};
use regex::{escape, Regex};

pub const PAGE_BUILDER_CLASS_NAME: &str = "page-builder-element";
pub const PAGE_BUILDER_ELEMENT_ATTRIBUTE: &str = "page-builder-element";
pub const PAGE_BUILDER_COMMENT_WRAPPER: &str = "page-builder-wrapper";

fn get_html_header_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start header -->
            <base href="{protocol_prefix}" />
            <link rel="stylesheet" href="{editor_assets}/css/editor.css">
            <!-- {page_builder_wrapper}-end header -->
        "#,
        protocol_prefix = protocol::PROTOCOL_PREFIX,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        editor_assets = EDITOR_ASSETS_PREFIX
    )
}

fn get_html_footer_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start footer -->
            <script src="{editor_assets}/js/editor.js"></script>
            <!-- {page_builder_wrapper}-end footer -->
        "#,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        editor_assets = EDITOR_ASSETS_PREFIX
    )
}

fn get_html_body_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start body -->
            <button {page_builder_element_attribute} class="insert-{page_builder_class_name}">+</button>
            <!-- {page_builder_wrapper}-end body -->
        "#,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        page_builder_class_name = PAGE_BUILDER_CLASS_NAME,
        page_builder_element_attribute = PAGE_BUILDER_ELEMENT_ATTRIBUTE
    )
}

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

                {header_snippet}

                <link rel="stylesheet" href="{css_path}{project_css_filename}">

            </head>
            <body>

                {body_snippet}

                <script type="module" src="{js_path}{project_js_filename}"></script>

                {footer_snippet}
            </body>
            </html>
        "#,
        title = title,
        header_snippet = get_html_header_snippet(),
        footer_snippet = get_html_footer_snippet(),
        body_snippet = get_html_body_snippet(),
        css_path = projects::PROJECT_ASSETS_CSS_PATH,
        js_path = projects::PROJECT_ASSETS_JS_PATH,
        project_css_filename = projects::PROJECT_CSS_FILENAME,
        project_js_filename = projects::PROJECT_JS_FILENAME
    )
}

/**
 * It replaces content with updated snippets
 *
 * it updates dynamically generated content
 * header, body, footer
 */
pub fn get_updated_contents(current_content: String) -> String {
    let mut content = current_content.clone();

    let replacements = [
        ("header", get_html_header_snippet()),
        ("body", get_html_body_snippet()),
        ("footer", get_html_footer_snippet()),
    ];

    let wrapper = escape(PAGE_BUILDER_COMMENT_WRAPPER);
    for (target, new_snippet) in replacements {
        let pattern =
            format!(r"<!-- {wrapper}-start {target} -->[\s\S]*?<!-- {wrapper}-end {target} -->");

        if let Ok(re) = Regex::new(&pattern) {
            content = re.replace(&content, new_snippet.as_str()).into_owned();
        }
    }

    content
}
