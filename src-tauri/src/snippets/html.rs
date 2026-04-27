use crate::{
    commands::projects::{self, page::PageSettings},
    protocol::{self, EDITOR_ASSETS_PREFIX},
};
use dom_query::Document;
use regex::{escape, Regex};

pub const PAGE_BUILDER_CLASS_NAME: &str = "page-builder-element";
pub const PAGE_BUILDER_ELEMENT_ATTRIBUTE: &str = "page-builder-element";
pub const PAGE_BUILDER_COMMENT_WRAPPER: &str = "page-builder-wrapper";
pub const PAGE_BUILDER_READONLY_ATTRIBUTE: &str = "page-builder-readonly";

fn get_html_header_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start header -->
            <base href="{protocol_prefix}" />
            <link {page_builder_readonly} rel="stylesheet" href="{editor_assets}/css/editor.css">
            <!-- {page_builder_wrapper}-end header -->
        "#,
        protocol_prefix = protocol::PROTOCOL_PREFIX,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        editor_assets = EDITOR_ASSETS_PREFIX,
        page_builder_readonly = PAGE_BUILDER_READONLY_ATTRIBUTE
    )
}

fn get_html_footer_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start footer -->
            <script {page_builder_readonly} type="module" src="{editor_assets}/js/editor.js"></script>
            <!-- {page_builder_wrapper}-end footer -->
        "#,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        editor_assets = EDITOR_ASSETS_PREFIX,
        page_builder_readonly = PAGE_BUILDER_READONLY_ATTRIBUTE
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

                <link {page_builder_readonly}  rel="stylesheet" href="{css_path}{project_css_filename}">

            </head>
            <body>

                {body_snippet}

                <script {page_builder_readonly}  type="module" src="{js_path}{project_js_filename}"></script>

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
        project_js_filename = projects::PROJECT_JS_FILENAME,
        page_builder_readonly = PAGE_BUILDER_READONLY_ATTRIBUTE
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

        match Regex::new(&pattern) {
            Ok(re) => {
                content = re.replace(&content, new_snippet.as_str()).into_owned();
            }
            Err(err) => {
                println!("Error: {}", err)
            }
        }
    }

    content
}

pub fn get_configurations(html_content: String) -> PageSettings {
    let mut settings = PageSettings::default();

    let document = Document::from(html_content);
    let title = document.select("title").text().to_string();
    settings.title = title;

    let css = document.select("link[rel='stylesheet']");
    for c in css.iter() {
        // If this is a readonly element - ignore it
        if c.has_attr(PAGE_BUILDER_READONLY_ATTRIBUTE) {
            continue;
        }

        if let Some(val) = c.attr("href") {
            settings.css_links.push(val.to_string());
        }
    }

    let js = document.select("script");
    for j in js.iter() {
        // If this is a readonly element - ignore it
        if j.has_attr(PAGE_BUILDER_READONLY_ATTRIBUTE) {
            continue;
        }

        if let Some(val) = j.attr("src") {
            settings.js_links.push(val.to_string());
        }
    }

    settings
}
