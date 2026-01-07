"use strict";
(() => {
  // src/components/editor/blockUtil.ts
  function isBlock(obj) {
    return obj !== null && obj !== void 0 && typeof obj.id === "number" && typeof obj.name === "string" && typeof obj.tag === "string";
  }

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

  // editor-assets/js/message.ts
  var origin = "*";
  function sendMessageToParent(data) {
    window.parent.postMessage(data, origin);
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

  // editor-assets/js/element.ts
  var target = {
    parent: null,
    reference: null
  };
  var pageBuilderData = {
    className: "page-builder-element",
    placeholderElementClassName: "page-buider-element-placeholder"
  };
  var insertElement = document.querySelector(
    `button.insert-${pageBuilderData.className}`
  );
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
  function moveElementInPage(element) {
    element.remove();
    insertElementToPage(element);
  }
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
  var placeholderElement = createElementFromBlock({
    id: 2334233247234,
    name: "Placeholder",
    tag: "div",
    attributes: [
      {
        class: pageBuilderData.placeholderElementClassName
      }
    ]
  });
  document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
    const { target: targetElement, offsetY } = e;
    if (!(targetElement instanceof HTMLElement)) return;
    target = {
      parent: targetElement.parentElement,
      reference: targetElement,
      position: targetElement.offsetHeight / 2 < offsetY ? "after" : "before"
    };
    moveElementInPage(placeholderElement);
  });
  document.body.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (data === void 0) return;
    const block = JSON.parse(data);
    if (!isBlock(block)) return;
    const element = createElementFromBlock(block);
    insertElementToPage(element);
    placeholderElement.remove();
    addToHistory({ type: "insert", element });
  });
  document.body.addEventListener("dragleave", () => placeholderElement.remove());
})();
