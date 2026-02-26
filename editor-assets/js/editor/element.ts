import { CanvasMessageData } from "../../../src/screens/project/EditorTypes";
import { target } from "../element";
import { addToHistory, History } from "../history";
import { changeTagName } from "../util";

export function updateElementEdits(
    editsData: NonNullable<CanvasMessageData["elementEditsData"]>,
) {
    const targetElement = target.reference;
    if (!targetElement) return;

    let prevData = {};

    const data: Record<string, string> = {};

    switch (editsData.type) {
        case "tagData":
            prevData = { tagName: targetElement.tagName };
            data.tagName = editsData.data.tagName;
            break;

        case "htmlData":
            break;

        case "contentData":
            prevData = { innerText: targetElement.innerText };
            data.innerText = editsData.data.content;
            break;

        case "classNameData":
            prevData = { className: targetElement.className };
            data.className = editsData.data.className.join(" ");
            break;

        case "buttonData":
            prevData = { type: targetElement.getAttribute("type") };
            data.type = editsData.data.type;
            break;

        case "assetData":
            prevData = { src: targetElement.getAttribute("src") };
            data.src = editsData.data.src;
            break;

        default:
        // const _data: never = editsData.type;
    }

    applyElementEdit(targetElement, data);

    if (Object.keys(prevData).length !== 0) {
        addToHistory({
            type: "elementEdit",
            element: targetElement,
            elementEditData: {
                prev: prevData,
                current: data,
            },
        });
    }
}

export function undoElementEdit(history: History) {
    const data = history.elementEditData?.prev;
    if (!data) return;
    applyElementEdit(history.element, data);
}

export function redoElementEdit(history: History) {
    const data = history.elementEditData?.current;
    if (!data) return;
    applyElementEdit(history.element, data);
}

function applyElementEdit(element: HTMLElement, data: Record<string, string>) {
    for (const [key, value] of Object.entries(data)) {
        switch (key) {
            case "innerText":
                element.innerText = value;
                break;

            case "tagName":
                changeTagName(element, value);
                break;

            case "srcdoc":
                element.setAttribute("srcdoc", value);
                break;

            case "className":
                element.className = value;
                break;

            case "type":
                element.setAttribute("type", value);
                break;

            case "src":
                element.setAttribute("src", value);
                break;
        }
    }
}
