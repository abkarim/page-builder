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
 * Get insert Element
 */
const insertElement = document.querySelector(`button.insert-${pageBuilderData.className}`);
insertElement.addEventListener("click", () => sendMessageToParent({
    type: "insert",
    payload: {
        target: "hey",
    },
}));
export {};
