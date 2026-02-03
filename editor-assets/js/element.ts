import { isBlock } from "../../src/components/editor/blockUtil";
import { type Block } from "../../src/components/editor/block";
import { type ElementStylesEditorProps } from "../../src/components/editor/Index";
import { sendMessageToParent } from "./message";
import { addToHistory, History } from "./history";
import { throttle } from "./util";

const defaultTarget = {
  parent: null,
  reference: null,
};

export let target: {
  parent: HTMLElement | null;
  reference: HTMLElement | null;
  position?: "before" | "after";
} = defaultTarget;

const pageBuilderData = {
  className: "page-builder-element",
  placeholderElementClassName: "page-buider-element-placeholder",
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
  let { parent, position, reference } = target;

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

export function moveElementInPage(element: HTMLElement) {
  element.remove();

  insertElementToPage(element);
}

/**
 * Drag and Drop functionality
 */
const updateDragPosition = throttle(
  (targetElement: HTMLElement, offsetY: number) => {
    /**
     * Identify and change target
     *
     * 1. if target element is insert element
     * set target as it's parent
     *
     * 2. if target element is body
     * add element to the end of the page
     */
    if (targetElement === document.body || targetElement === insertElement) {
      target = defaultTarget;
    } else {
      target = {
        parent: targetElement.parentElement,
        reference: targetElement,
        position: targetElement.offsetHeight / 2 < offsetY ? "after" : "before",
      };
    }

    moveElementInPage(placeholderElement);
  },
  70,
);

const placeholderElement = createElementFromBlock({
  id: 2334233247234,
  name: "Placeholder",
  tag: "div",
  attributes: [
    {
      class: pageBuilderData.placeholderElementClassName,
    },
  ],
});

/**
 * Set target on drag
 */
document.body.addEventListener("dragover", (e) => {
  e.preventDefault();

  const { target: targetElement, offsetY } = e;

  if (targetElement instanceof HTMLElement) {
    updateDragPosition(targetElement, offsetY);
  }
});

/**
 * Insert Element on drop
 */
document.body.addEventListener("drop", (e) => {
  e.preventDefault();

  /**
   * Get data
   * and data must be of type Block
   */
  const data = e.dataTransfer?.getData("text/plain");
  if (data === undefined) return;

  const block = JSON.parse(data);
  if (!isBlock(block)) return;

  const element = createElementFromBlock(block);
  insertElementToPage(element);
  placeholderElement.remove();

  addToHistory({ type: "insert", element });
});

/**
 * Remove placeholder element
 * after drag functionality ends
 */
document.body.addEventListener("dragleave", () => placeholderElement.remove());

/**
 * Element selection functionality
 */
function selectElement(e: Event) {
  if (!e.target) return;
  const element = e.target as HTMLElement;

  /**
   * We want everything except
   * the insert element
   */
  if (element === insertElement) {
    target = {
      parent: document.body,
      reference: insertElement as HTMLElement,
      position: "before",
    };

    sendMessageToParent({
      type: "insert",
    });

    return;
  }

  /**
   * Set target element
   */
  target = {
    parent: element.parentElement,
    reference: element,
  };

  /**
   * If element is body
   * target needs to be set correctly
   */
  if (element === document.body) {
    target = {
      parent: element,
      reference: insertElement,
      position: "before",
    };
  }

  const { textAlign, color, fontFamily, textTransform, margin, padding } =
    element.style;

  const stylesData: ElementStylesEditorProps["data"] = {
    text: {
      textAlign,
      textTransform,
      color,
      fontFamily,
    },
    spacing: {
      margin,
      padding,
    },
  };

  sendMessageToParent({
    type: "styleEditor",
    payload: {
      tagName: element.tagName,
      stylesData,
    },
  });
}

document.body.addEventListener("click", selectElement);

/**
 * It sets the selectElement
 * on body
 */
document.body.click();
