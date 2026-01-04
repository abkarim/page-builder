const origin = "*";
const pageBuilderData = {
    className: "page-builder-element",
};
/**
 * Send message to parent
 */
function sendMessageToParent(data) {
    window.parent.postMessage(data, origin);
}
/**
 * Receive message from Parent
 */
function receiveMessageData(event) {
    const { type, payload } = event.data;
    if (type === "element") {
        if (payload.type === "insert") {
            const body = document.querySelector("body");
            body.innerHTML = payload.data + body.innerHTML;
        }
    }
}
window.addEventListener("message", receiveMessageData);
/**
 * Get insert Element
 */
const insertElement = document.querySelector(`button.insert-${pageBuilderData.className}`);
insertElement.addEventListener("click", () => {
    sendMessageToParent({
        type: "insert",
        payload: {
            target: "hey",
        },
    });
});
export {};
