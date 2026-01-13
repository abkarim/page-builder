const connections: {
  editorName: string;
  availableFor: string[] | "*";
  notAvailableFor?: string[];
}[] = [
  {
    editorName: "text",
    availableFor: ["p", "h"],
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
    availableFor: "*",
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

  return true;
}
