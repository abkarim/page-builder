import {
  type CanvasMessageData,
  type EditorMessageData,
} from "../../src/screens/project/EditorTypes";
import { type Block } from "../../src/components/editor/block";
import { addToHistory, type History, redo, undo } from "./history";

const origin = "*";

let target: {
  parent: HTMLElement | null;
  reference: HTMLElement | null;
  position?: "before" | "after";
} = {
  parent: null,
  reference: null,
};

const pageBuilderData = {
  className: "page-builder-element",
};

/**
 * Get insert Element
 */
const insertElement = document.querySelector(
  `button.insert-${pageBuilderData.className}`,
);

/**
 * Send message to parent
 */
export function sendMessageToParent(data: EditorMessageData) {
  window.parent.postMessage(data, origin);
}

/**
 * Create element from string
 */
function createElementFromBlock(data: Block): HTMLElement {
  const element = document.createElement(data.tag);
  if (data.content) {
    element.innerHTML = data.content;
  }

  if (data.attributes) {
    data.attributes.forEach((attribute) => {
      Object.entries(attribute).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    });
  }

  return element;
}

/**
 * Insert Element to page
 */
function insertElementToPage(element: HTMLElement) {
  const { parent, position, reference } = target;

  /**
   * If no parent found insert the element after
   * the insertElement
   */
  if (!parent) {
    if (insertElement) {
      insertElement.before(element);
    }
    return;
  }

  /**
   * If not found insert as first child
   */
  if (!reference) {
    parent.prepend(element);
    return;
  }

  if (position === "before") reference.before(element);
  if (position === "after") reference.after(element);
}

/**
 * Receive message from Parent
 */
function receiveMessageData(event: MessageEvent<CanvasMessageData>) {
  const { type, payload } = event.data;

  if (type === "block") {
    if (payload?.type !== undefined && payload.type === "insert") {
      const element = createElementFromBlock(payload.data as Block);

      insertElementToPage(element);
      addToHistory({ type: "insert", element: element });
    }

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

insertElement!.addEventListener("click", (e) => {
  /**
   * TODO
   * Determine and modify target info
   */
  target = {
    parent: document.body,
    reference: e.currentTarget as HTMLElement,
    position: "before",
  };

  sendMessageToParent({
    type: "insert",
    payload: {
      target: "hey",
    },
  });
});

/**
 * This line fixes ts issue
 * TS thinks this file is trying to overwrite browser values
 */
export {};
