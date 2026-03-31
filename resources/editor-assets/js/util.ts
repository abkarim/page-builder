/**
 * Generates a unique XPath for a given DOM element.
 * @param el The target DOM element.
 * @returns The XPath string.
 */
export function getXPath(el: Element | null): string {
    if (!el) {
        return "";
    }
    const parts: string[] = [];
    let currentNode: Element | null = el;

    while (currentNode && currentNode.nodeType === Node.ELEMENT_NODE) {
        let part = currentNode.tagName.toLowerCase();
        let siblings = currentNode.parentNode?.children;

        if (siblings && siblings.length > 1) {
            let count = 1;
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                if (sibling.nodeName === currentNode.nodeName) {
                    if (sibling === currentNode) {
                        part += `[${count}]`;
                        break;
                    }
                    count++;
                }
            }
        }
        parts.unshift(part);
        currentNode = currentNode.parentNode as Element | null;
    }

    return `/${parts.join("/")}`;
}

export function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

export function changeTagName(element: HTMLElement, targetTag: string) {
    const newElement = document.createElement(targetTag);

    for (const attr of element.attributes) {
        newElement.setAttribute(attr.name, attr.value);
    }

    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }

    element.parentNode?.replaceChild(newElement, element);
}
