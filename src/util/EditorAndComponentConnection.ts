import { HTML_HEADERS_LIST } from "./HTMLElements";

const connections: {
    editorName: string;
    availableFor: string[] | "*";
    notAvailableFor?: string[];
}[] = [
    {
        editorName: "text",
        availableFor: ["p", "button", ...HTML_HEADERS_LIST],
    },
    {
        editorName: "border",
        availableFor: "*",
    },
    {
        editorName: "color",
        availableFor: "*",
    },
    {
        editorName: "layout",
        availableFor: ["column"],
    },
    {
        editorName: "spacing",
        availableFor: "*",
    },
    {
        editorName: "position",
        availableFor: "*",
    },
    {
        editorName: "size",
        availableFor: "*",
    },
    {
        editorName: "customCSS",
        availableFor: "*",
    },
];

export function isEditorAvailableForComponent(
    editor: string,
    component: string,
): boolean {
    const connection = connections.find((conn) => conn.editorName === editor);
    if (!connection) return false;

    /**
     * Not available if this is
     * explicitly disabled for this component
     */
    if (connection.notAvailableFor?.includes(component)) return false;

    if (connection.availableFor === "*") return true;

    return connection.availableFor.includes(component);
}

const editorConnections: {
    editorName: string;
    availableFor: string[] | "*";
    notAvailableFor?: string[];
}[] = [
    {
        editorName: "classname",
        availableFor: "*",
    },
    {
        editorName: "html",
        availableFor: ["html"],
    },
    {
        editorName: "content",
        availableFor: ["p", ...HTML_HEADERS_LIST],
    },
    {
        editorName: "asset",
        availableFor: ["img"],
    },
    {
        editorName: "button",
        availableFor: ["button"],
    },
    {
        editorName: "tag",
        availableFor: ["div", "section", "column", ...HTML_HEADERS_LIST],
    },
];

export function isElementEditorAvailableForComponent(
    editor: string,
    component: string,
) {
    const connection = editorConnections.find(
        (conn) => conn.editorName === editor,
    );
    if (!connection) return false;

    /**
     * Not available if this is
     * explicitly disabled for this component
     */
    if (connection.notAvailableFor?.includes(component)) return false;

    if (connection.availableFor === "*") return true;

    return connection.availableFor.includes(component);
}
