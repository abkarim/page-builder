const connections: {
  editorName: string;
  availableFor: string[] | "*";
  notAvailableFor?: string[];
}[] = [
  {
    editorName: "text",
    availableFor: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "button"],
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
    editorName: "text",
    availableFor: ["p", "h1", "h2", "h3", "h5", "h6"],
  },
  {
    editorName: "heading",
    availableFor: ["h1", "h2", "h3", "h4", "h5", "h6"],
  },
  {
    editorName: "image",
    availableFor: ["img"],
  },
  {
    editorName: "button",
    availableFor: ["button"],
  },
  {
    editorName: "tag",
    availableFor: ["div", "section", "column"],
  },
];

export function isElementEditorAvilableForComponent(
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
