"use strict";
(() => {
  // editor-assets/js/history.ts
  var availableUndo = [];
  var availableRedo = [];
  function addToHistory(data) {
    availableUndo.push(data);
    availableRedo.length = 0;
    sendMessageToParent({
      type: "historySync",
      payload: {
        availableUndo: availableUndo.length,
        availableRedo: availableRedo.length
      }
    });
  }
  function undo() {
    const removedElement = availableUndo.pop();
    if (removedElement !== void 0) {
      switch (removedElement.type) {
        case "insert":
          const parentElement = removedElement.element.parentElement;
          removedElement.target = {
            parent: parentElement,
            index: Array.from(parentElement.children).indexOf(
              removedElement.element
            )
          };
          removedElement.element.remove();
          break;
      }
      availableRedo.push(removedElement);
    }
    sendMessageToParent({
      type: "historySync",
      payload: {
        availableUndo: availableUndo.length,
        availableRedo: availableRedo.length
      }
    });
  }
  function redo() {
    const removedElement = availableRedo.pop();
    if (removedElement !== void 0) {
      switch (removedElement.type) {
        case "insert":
          const { parent, index } = removedElement.target;
          parent.insertBefore(removedElement.element, parent.children[index]);
      }
      availableUndo.push(removedElement);
    }
    sendMessageToParent({
      type: "historySync",
      payload: {
        availableUndo: availableUndo.length,
        availableRedo: availableRedo.length
      }
    });
  }

  // editor-assets/js/editor.ts
  var origin = "*";
  var target = {
    parent: null,
    reference: null
  };
  var pageBuilderData = {
    className: "page-builder-element"
  };
  var insertElement = document.querySelector(
    `button.insert-${pageBuilderData.className}`
  );
  function sendMessageToParent(data) {
    window.parent.postMessage(data, origin);
  }
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
  function insertElementToPage(element) {
    const { parent, position, reference } = target;
    if (!parent) {
      if (insertElement) {
        insertElement.before(element);
      }
      return;
    }
    if (!reference) {
      parent.prepend(element);
      return;
    }
    if (position === "before") reference.before(element);
    if (position === "after") reference.after(element);
  }
  function receiveMessageData(event) {
    const { type, payload } = event.data;
    if (type === "block") {
      if (payload?.type !== void 0 && payload.type === "insert") {
        const element = createElementFromBlock(payload.data);
        insertElementToPage(element);
        addToHistory({ type: "insert", element });
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
  insertElement.addEventListener("click", (e) => {
    target = {
      parent: document.body,
      reference: e.currentTarget,
      position: "before"
    };
    sendMessageToParent({
      type: "insert",
      payload: {
        target: "hey"
      }
    });
  });
})();
