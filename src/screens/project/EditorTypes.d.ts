/**
 * Communication message event type
 */
export interface EditorMessageData {
  type: "test" | "insert";
  payload: Record<string, unknown>;
}
