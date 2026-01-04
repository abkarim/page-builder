import { type EditorMessageData } from "../../src/screens/project/EditorTypes";

const origin = "*";

const pageBuilderData = {
  className: "page-builder-element",
};

/**
 * Send message to parent
 */
function sendMessageToParent(data: EditorMessageData) {
  window.parent.postMessage(data, origin);
}

/**
 * Get insert Element
 */
const insertElement = document.querySelector(
  `button.insert-${pageBuilderData.className}`,
);
insertElement!.addEventListener("click", () =>
  sendMessageToParent({
    type: "insert",
    payload: {
      target: "hey",
    },
  }),
);

/**
 * This line fixes ts issue
 * TS thinks this file is trying to overwrite browser values
 */
export {};
