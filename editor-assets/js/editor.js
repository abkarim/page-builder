/**
 * Send message to parent
 */
function sendMessageToParent() {
  window.parent.postMessage("HI", "*");
}

sendMessageToParent();
