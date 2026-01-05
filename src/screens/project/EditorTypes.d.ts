/**
 * Communication message event type
 */
export interface EditorMessageData {
  type: "test" | "insert";
  payload: Record<string, unknown>;
}

export interface CanvasMessageData {
  type: "block" | "component";
  payload: {
    type: "insert";
    data: unknown;
  };
}
