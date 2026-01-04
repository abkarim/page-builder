const origin = "*";
/**
 * Send message to parent
 */
function sendMessageToParent() {
    window.parent.postMessage("HI", origin);
}
sendMessageToParent();
export {};
