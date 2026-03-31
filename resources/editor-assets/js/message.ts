import { type Block } from "../../../src/components/editor/block";
import {
    type CanvasMessageData,
    type EditorMessageData,
} from "../../../src/screens/project/EditorTypes";
import { createElementFromBlock, insertElementToPage } from "./element";
import { addToHistory, redo, undo } from "./history";
import { updateElementStyles } from "./editor/styles";
import { updateElementEdits } from "./editor/element";

const origin = "*";

/**
 * Send message to parent
 */
export function sendMessageToParent(data: EditorMessageData) {
    window.parent.postMessage(data, origin);
}

/**
 * Receive message from Parent
 */
function receiveMessageData(event: MessageEvent<CanvasMessageData>) {
    const { type, payload, styleData, elementEditsData } = event.data;

    if (type === "block") {
        if (payload?.type !== undefined && payload.type === "insert") {
            const element = createElementFromBlock(payload.data as Block);

            insertElementToPage(element);
            addToHistory({ type: "insert", element: element });
        }

        return;
    }

    if (type === "style") {
        if (!styleData) return;
        updateElementStyles(styleData);
        return;
    }

    if (type === "element_edits") {
        if (!elementEditsData) return;
        updateElementEdits(elementEditsData);
        return;
    }

    if (type === "undo") {
        undo();
        return;
    }

    if (type === "redo") {
        redo();
        return;
    }
}

window.addEventListener("message", receiveMessageData);
