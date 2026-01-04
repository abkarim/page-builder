/**
 * Communication message event type
 */
export interface EditorMessageData {
  type: "test" | "insert";
  payload: Record<string, unknown>;
}

export interface CanvasMessageData {
  type: "element";
  payload: {
    type: "insert";
    data: unknown;
  };
}
