import { ElementStylesEditorProps } from "@/components/editor/Index";

/**
 * Communication message event type
 */
export interface EditorMessageData {
  type: "test" | "insert" | "historySync" | "styleEditor";
  payload?: Record<string, unknown>;
}

export interface CanvasMessageData {
  type: "block" | "component" | "undo" | "redo" | "style";
  payload?: {
    type: "insert";
    data: unknown;
  };
  styleData?: {
    type: keyof ElementStylesEditorProps["data"];
    data: ElementStylesEditorProps["data"][keyof ElementStylesEditorProps["data"]];
  };
}
