import { ANIMATION_STACK_MS } from "../core/tokens";

const previousPositions = new Map<string, DOMRect>();

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Snapshot current positions of all rendered toasts (FLIP step 1: First).
 * Must be called before any DOM mutations.
 */
export function recordPositions(elements: Map<string, HTMLElement>): void {
    previousPositions.clear();

    elements.forEach((element, id) => {
        previousPositions.set(id, element.getBoundingClientRect());
    });
}

/**
 * Animate each toast from its old position to its new position (FLIP steps 2–4).
 * Skips toasts that are mid-removal so they don't fight the exit animation.
 */
export function animateStack(elements: Map<string, HTMLElement>): void {
    if (prefersReducedMotion()) return;

    elements.forEach((element, id) => {
        // Don't fight the exit animation on toasts being removed.
        if (element.dataset.removing === "true") return;

        const previous = previousPositions.get(id);
        if (!previous) return;

        const next = element.getBoundingClientRect();
        const deltaY = previous.top - next.top;

        if (deltaY === 0) return;

        // Invert: jump to where it was.
        element.style.transition = "none";
        element.style.transform = `translateY(${deltaY}px)`;

        // Play: let CSS transition it to the natural position.
        requestAnimationFrame(() => {
            element.style.transition = `transform ${ANIMATION_STACK_MS}ms cubic-bezier(.2,.8,.2,1)`;
            element.style.transform = "";
        });
    });
}

/**
 * Update z-index so newer toasts appear on top.
 */
export function updateDepth(elements: Map<string, HTMLElement>): void {
    const list = [...elements.values()];

    list.forEach((element, index) => {
        element.style.zIndex = String(1000 - index);
        element.style.removeProperty("--luma-scale");
    });
}