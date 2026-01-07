import { type Block } from "../../src/components/editor/block";
import { sendMessageToParent } from "./message";

let target: {
  parent: HTMLElement | null;
  reference: HTMLElement | null;
  position?: "before" | "after";
} = {
  parent: null,
  reference: null,
};

const pageBuilderData = {
  className: "page-builder-element",
};

/**
 * Get insert Element
 */
const insertElement = document.querySelector(
  `button.insert-${pageBuilderData.className}`,
);

/**
 * Create element from string
 */
export function createElementFromBlock(data: Block): HTMLElement {
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
export function insertElementToPage(element: HTMLElement) {
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

  if (position === "before") reference.before(element);
  if (position === "after") reference.after(element);
}

insertElement!.addEventListener("click", (e) => {
  /**
   * TODO
   * Determine and modify target info
   */
  target = {
    parent: document.body,
    reference: e.currentTarget as HTMLElement,
    position: "before",
  };

  sendMessageToParent({
    type: "insert",
    payload: {
      target: "hey",
    },
  });
});
