import { ElementEditorProps } from "@/components/editor/elementsEditor/Index";
import { ElementStylesEditorProps } from "@/components/editor/Index";

/**
 * Communication message event type
 */
export interface EditorMessageData {
    type: "test" | "insert" | "historySync" | "styleEditor";
    payload?: Record<string, unknown>;
}

export interface CanvasMessageData {
    type: "block" | "component" | "undo" | "redo" | "style" | "element_edits";
    payload?: {
        type: "insert";
        data: unknown;
    };
    styleData?: {
        type: keyof ElementStylesEditorProps["data"];
        data: Partial<
            ElementStylesEditorProps["data"][keyof ElementStylesEditorProps["data"]]
        >;
    };
    elementEditsData?: {
        type: keyof ElementEditorProps["data"];
        data: Partial<
            ElementEditorProps["data"][keyof ElementEditorProps["data"]]
        >;
    };
}
