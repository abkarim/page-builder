import { CanvasMessageData } from "../../src/screens/project/EditorTypes";
import { insertElement, target } from "./element";
import { addToHistory, History } from "./history";

/**
 * Update element style
 */
export function updateElementStyles(
  data: NonNullable<CanvasMessageData["styleData"]>,
) {
  if (!target.reference) return;

  const styleData: NonNullable<History["styleData"]> = {
    prev: {},
    current: {},
  };

  const targetElement = target.reference;
  /**
   * Don't apply any style if
   * target is insert element
   */
  if (targetElement === insertElement) return;

  for (const [key, value] of Object.entries(data.data)) {
    // @ts-expect-error
    styleData.prev[key] = targetElement.style[key] || "";
    // @ts-expect-error
    styleData.current[key] = value;
    // @ts-expect-error
    targetElement.style[key] = value;
  }

  addToHistory({
    type: "style",
    element: targetElement,
    styleData,
  });
}

export function undoElementStyle(history: History) {
  for (const [key, value] of Object.entries(history.styleData!.prev)) {
    // @ts-expect-error
    history.element.style[key] = value;
  }
}
export function redoElementStyle(history: History) {
  for (const [key, value] of Object.entries(history.styleData!.current)) {
    // @ts-expect-error
    history.element.style[key] = value;
  }
}
