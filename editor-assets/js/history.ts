import {
    redoElementEdit,
    redoElementStyle,
    undoElementEdit,
    undoElementStyle,
} from "./styles";
import { sendMessageToParent } from "./message";

/**
 * History
 */
export type History = {
    type: "insert" | "style" | "elementEdit";
    element: HTMLElement;
    target?: {
        parent: HTMLElement;
        index: number;
    };
    styleData?: {
        prev: Record<string, string>;
        current: Record<string, string>;
    };
    elementEditData?: {
        prev: Record<string, string>;
        current: Record<string, string>;
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
    const removedItem = availableUndo.pop();
    if (removedItem !== undefined) {
        switch (removedItem.type) {
            case "insert":
                /**
                 * Get target info
                 */
                const parentElement = removedItem.element.parentElement!;
                removedItem.target = {
                    parent: parentElement,
                    index: Array.from(parentElement.children).indexOf(
                        removedItem.element,
                    ),
                };

                /**
                 * Remove this element from page
                 */
                removedItem.element.remove();
                break;

            case "style":
                undoElementStyle(removedItem);
                break;

            case "elementEdit":
                undoElementEdit(removedItem);
                break;

            default:
                const _check: never = removedItem.type;
        }

        availableRedo.push(removedItem);
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
    const removedItem = availableRedo.pop();
    if (removedItem !== undefined) {
        switch (removedItem.type) {
            case "insert":
                /**
                 * Put this item back in the page where it was
                 */
                const { parent, index } = removedItem.target!;
                parent.insertBefore(
                    removedItem.element,
                    parent.children[index],
                );
                break;

            case "style":
                redoElementStyle(removedItem);
                break;

            case "elementEdit":
                redoElementEdit(removedItem);
                break;

            default:
                const _check: never = removedItem.type;
        }

        availableUndo.push(removedItem);
    }

    sendMessageToParent({
        type: "historySync",
        payload: {
            availableUndo: availableUndo.length,
            availableRedo: availableRedo.length,
        },
    });
}
