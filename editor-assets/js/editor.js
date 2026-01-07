const origin = "*";
let target = {
    parent: null,
    reference: null,
};
const pageBuilderData = {
    className: "page-builder-element",
};
const availableUndo = [];
const availableRedo = [];
/**
 * Get insert Element
 */
const insertElement = document.querySelector(`button.insert-${pageBuilderData.className}`);
/**
 * Send message to parent
 */
function sendMessageToParent(data) {
    window.parent.postMessage(data, origin);
}
/**
 * Create element from string
 */
function createElementFromBlock(data) {
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
function insertElementToPage(element) {
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
    if (position === "before")
        reference.before(element);
    if (position === "after")
        reference.after(element);
}
/**
 * Receive message from Parent
 */
function receiveMessageData(event) {
    const { type, payload } = event.data;
    if (type === "block") {
        if (payload?.type !== undefined && payload.type === "insert") {
            const element = createElementFromBlock(payload.data);
            insertElementToPage(element);
            availableUndo.push({ type: "insert", element: element });
            sendMessageToParent({
                type: "historySync",
                payload: {
                    availableUndo: availableUndo.length,
                    availableRedo: availableRedo.length,
                },
            });
        }
    }
}
window.addEventListener("message", receiveMessageData);
insertElement.addEventListener("click", (e) => {
    /**
     * TODO
     * Determine and modify target info
     */
    target = {
        parent: document.body,
        reference: e.currentTarget,
        position: "before",
    };
    sendMessageToParent({
        type: "insert",
        payload: {
            target: "hey",
        },
    });
});
export {};
