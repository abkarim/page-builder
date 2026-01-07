import { sendMessageToParent } from "./editor";

/**
 * History
 */
export type History = {
  type: "insert";
  element: HTMLElement;
  target?: {
    parent: HTMLElement;
    index: number;
  };
};
const availableUndo: History[] = [];
const availableRedo: History[] = [];

export function addToHistory(data: History) {
  availableUndo.push(data);

  /**
   * Clear redo on history add
   */
  availableRedo.length = 0;

  sendMessageToParent({
    type: "historySync",
    payload: {
      availableUndo: availableUndo.length,
      availableRedo: availableRedo.length,
    },
  });
}

export function undo() {
  const removedElement = availableUndo.pop();
  if (removedElement !== undefined) {
    switch (removedElement.type) {
      case "insert":
        /**
         * Get target info
         */
        const parentElement = removedElement.element.parentElement!;
        removedElement.target = {
          parent: parentElement,
          index: Array.from(parentElement.children).indexOf(
            removedElement.element,
          ),
        };

        /**
         * Remove this element from page
         */
        removedElement.element.remove();
        break;
    }

    availableRedo.push(removedElement);
  }

  sendMessageToParent({
    type: "historySync",
    payload: {
      availableUndo: availableUndo.length,
      availableRedo: availableRedo.length,
    },
  });
}

export function redo() {
  const removedElement = availableRedo.pop();
  if (removedElement !== undefined) {
    switch (removedElement.type) {
      case "insert":
        /**
         * Put this item back in the page where it was
         */
        const { parent, index } = removedElement.target!;
        parent.insertBefore(removedElement.element, parent.children[index]);
    }

    availableUndo.push(removedElement);
  }

  sendMessageToParent({
    type: "historySync",
    payload: {
      availableUndo: availableUndo.length,
      availableRedo: availableRedo.length,
    },
  });
}
