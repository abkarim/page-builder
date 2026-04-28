use crate::{
    commands::projects::{
        self,
        page::{LinkSchema, LinkScope, PageSettings},
    },
    protocol::{self, EDITOR_ASSETS_PREFIX},
};
use dom_query::{Document, Selection};
use regex::{escape, Regex};

pub const PAGE_BUILDER_CLASS_NAME: &str = "page-builder-element";
pub const PAGE_BUILDER_ELEMENT_ATTRIBUTE: &str = "page-builder-element";
pub const PAGE_BUILDER_COMMENT_WRAPPER: &str = "page-builder-wrapper";
pub const PAGE_BUILDER_READONLY_ATTRIBUTE: &str = "page-builder-readonly";
pub const PAGE_BUILDER_IDENTIFIER: &str = "page-builder-identifier";
pub const PAGE_BUILDER_ASSET_SCOPE: &str = "page-builder-asset-scope";

fn generate_css_link(href: &str, id: Option<&str>, readonly: bool) -> String {
    let mut attrs = Vec::new();
    attrs.push("rel=\"stylesheet\"".to_string());
    attrs.push(format!("href=\"{}\"", href));

    if readonly {
        attrs.push(PAGE_BUILDER_READONLY_ATTRIBUTE.to_string());
    }

    if let Some(id_val) = id {
        attrs.push(format!("{}=\"{}\"", PAGE_BUILDER_IDENTIFIER, id_val));
    }

    format!("<link {}>", attrs.join(" "))
}

fn generate_js_link(src: &str, id: Option<&str>, readonly: bool) -> String {
    let mut attrs = Vec::new();
    attrs.push(format!("src=\"{}\"", src));
    attrs.push(format!("type=\"module\""));

    if readonly {
        attrs.push(PAGE_BUILDER_READONLY_ATTRIBUTE.to_string());
    }

    if let Some(id_val) = id {
        attrs.push(format!("{}=\"{}\"", PAGE_BUILDER_IDENTIFIER, id_val));
    }

    format!("<script {}></script>", attrs.join(" "))
}

fn get_html_header_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start header -->
            <base href="{protocol_prefix}" />
            {css_tag}
            <!-- {page_builder_wrapper}-end header -->
        "#,
        protocol_prefix = protocol::PROTOCOL_PREFIX,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        css_tag = generate_css_link(
            &format!("{}/css/editor.css", EDITOR_ASSETS_PREFIX),
            None,
            true
        )
    )
}

fn get_html_footer_snippet() -> String {
    format!(
        r#"
            <!-- {page_builder_wrapper}-start footer -->
            {js_tag}
            <!-- {page_builder_wrapper}-end footer -->
        "#,
        page_builder_wrapper = PAGE_BUILDER_COMMENT_WRAPPER,
        js_tag = generate_js_link(
            &format!("{}/js/editor.js", EDITOR_ASSETS_PREFIX),
            None,
            true
        )
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

                {css_tag}
            </head>
            <body>

                {body_snippet}

                {js_tag}

                {footer_snippet}
            </body>
            </html>
        "#,
        title = title,
        header_snippet = get_html_header_snippet(),
        footer_snippet = get_html_footer_snippet(),
        body_snippet = get_html_body_snippet(),
        css_tag = generate_css_link(
            &format!(
                "{}{}",
                projects::PROJECT_ASSETS_CSS_PATH,
                projects::PROJECT_CSS_FILENAME
            ),
            None,
            true
        ),
        js_tag = generate_js_link(
            &format!(
                "{}{}",
                projects::PROJECT_ASSETS_JS_PATH,
                projects::PROJECT_JS_FILENAME
            ),
            None,
            true
        ),
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

fn get_link_schema_attributes(element: Selection<'_>, link_attr_name: &str) -> LinkSchema {
    let mut link = LinkSchema::default();

    if let Some(val) = element.attr(link_attr_name) {
        link.link = val.to_string();
    }

    if let Some(scope) = element.attr(PAGE_BUILDER_ASSET_SCOPE) {
        link.scope = match scope.to_string().to_lowercase().as_str() {
            "project" => LinkScope::Project,
            "page" => LinkScope::Page,
            _ => LinkScope::default(),
        };
    }

    if let Some(id) = element.attr(PAGE_BUILDER_IDENTIFIER) {
        link.identifier = id.to_string();
    }

    link
}

pub fn get_asset_configurations(html_content: String) -> PageSettings {
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

        let css_link = get_link_schema_attributes(c, "href");
        if !css_link.link.is_empty() {
            settings.css_links.push(css_link);
        }
    }

    let js = document.select("script");
    for j in js.iter() {
        // If this is a readonly element - ignore it
        if j.has_attr(PAGE_BUILDER_READONLY_ATTRIBUTE) {
            continue;
        }

        let js_link = get_link_schema_attributes(j, "src");
        if !js_link.link.is_empty() {
            settings.js_links.push(js_link);
        }
    }

    settings
}

pub fn update_asset_configurations(html_content: String, configurations: PageSettings) -> String {
    let PageSettings {
        title,
        css_links,
        js_links,
    } = configurations;
    let document = Document::from(html_content);

    // update title
    let doc_title = document.select("title");
    doc_title.set_text(title.as_str());

    // update css links
    for LinkSchema {
        identifier,
        link,
        scope,
    } in css_links
    {
        let selector = format!("link[{}='{}']", PAGE_BUILDER_IDENTIFIER, &identifier);
        let mut element = document.select(&selector);

        // if link is empty, remove it
        if link.is_empty() {
            // remove element if exists
            if !element.is_empty() {
                element.remove();
            }

            continue;
        }

        // If not found then we must add it
        if element.is_empty() {
            let html = generate_css_link(&link, Some(&identifier), false);

            // Insert this element in header as the last element
            document.select("head").append_html(html);

            element = document.select(&selector);
        }

        // update link
        element.set_attr("href", &link);

        // update scope
        element.set_attr(PAGE_BUILDER_ASSET_SCOPE, scope.as_ref());
    }

    // update js links
    for LinkSchema {
        identifier,
        link,
        scope,
    } in js_links
    {
        let selector = format!("script[{}='{}']", PAGE_BUILDER_IDENTIFIER, &identifier);
        let mut element = document.select(&selector);

        // if link is empty, remove it
        if link.is_empty() {
            // remove element if exists
            if !element.is_empty() {
                element.remove();
            }

            continue;
        }

        // If not found then we must add it
        if element.is_empty() {
            let html = generate_js_link(&link, Some(&identifier), false);

            document.select("body").append_html(html);

            element = document.select(&selector);
        }

        // update link
        element.set_attr("src", &link);

        // update scope
        element.set_attr(PAGE_BUILDER_ASSET_SCOPE, scope.as_ref());
    }

    document.html().to_string()
}
