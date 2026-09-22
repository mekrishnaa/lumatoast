/**
 * Creates an HTML element with optional CSS class names.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    classNames: string[] = []
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (classNames.length) {
        element.classList.add(...classNames);
    }

    return element;
}

/**
 * Removes all child nodes from an element.
 * Used internally when re-rendering content in-place.
 */
export function clearElement(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Safely applies inline styles and CSS custom properties to an element.
 * Protects against prototype pollution and ensures CSS variables are properly set via setProperty().
 */
export function applyStyles(element: HTMLElement, style?: Record<string, string>): void {
    if (!style || typeof style !== "object") return;

    for (const [key, value] of Object.entries(style)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        if (typeof value !== "string") continue;

        if (key.startsWith("--")) {
            element.style.setProperty(key, value);
        } else {
            (element.style as any)[key] = value;
        }
    }
}