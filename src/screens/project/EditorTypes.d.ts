/**
 * Communication message event type
 */
export interface EditorMessageData {
  type: "test" | "insert" | "historySync";
  payload?: Record<string, unknown>;
}

export interface CanvasMessageData {
  type: "block" | "component" | "undo" | "redo";
  payload?: {
    type: "insert";
    data: unknown;
  };
}
