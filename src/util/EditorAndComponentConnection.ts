const connections: {
  editorName: string;
  availableFor: string[] | "*";
  notAvailableFor?: string[];
}[] = [
  {
    editorName: "text",
    availableFor: ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
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
    editorName: "margin",
    availableFor: "*",
  },
  {
    editorName: "padding",
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
