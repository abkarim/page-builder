/**
 * This line fixes ts issue
 * TS thinks this file is trying to overwrite browser values
 */
export {};

const origin = "*";

/**
 * Send message to parent
 */
function sendMessageToParent() {
  window.parent.postMessage("HI", origin);
}

sendMessageToParent();
