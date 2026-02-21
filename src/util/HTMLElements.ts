export const HTML_HEADERS_LIST = ["h1", "h2", "h3", "h4", "h5", "h6"];

export function isHeaderElement(component: string): boolean {
    return HTML_HEADERS_LIST.includes(component);
}
