import { type Block } from "../../src/components/editor/block";
import {
  type CanvasMessageData,
  type EditorMessageData,
} from "../../src/screens/project/EditorTypes";
import {
  createElementFromBlock,
  insertElementToPage,
  updateElementStyles,
} from "./element";
import { addToHistory, redo, undo } from "./history";

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
  const { type, payload, styleData } = event.data;

  if (type === "block") {
    if (payload?.type !== undefined && payload.type === "insert") {
      const element = createElementFromBlock(payload.data as Block);

      insertElementToPage(element);
      addToHistory({ type: "insert", element: element });
    }

    return;
  }

  if (type === "style") {
    updateElementStyles(styleData);
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
