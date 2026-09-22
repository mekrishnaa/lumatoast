import { ANIMATION_ENTER_MS, ANIMATION_EXIT_MS } from "../core/tokens";

/**
 * Run a function after the toast enter animation completes.
 * Useful for attaching focus or analytics after a toast becomes visible.
 */
export function onEnter(element: HTMLElement, callback: () => void): void {
    const id = window.setTimeout(callback, ANIMATION_ENTER_MS);

    // Clean up if the element is removed before the animation finishes.
    const observer = new MutationObserver(() => {
        if (!element.isConnected) {
            clearTimeout(id);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Trigger the exit animation on a toast element, then call the callback.
 * This is a helper for programmatic removal with animation.
 */
export function onExit(element: HTMLElement, callback: () => void): void {
    element.classList.add("luma-toast-exit");

    const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target !== element) return;
        element.removeEventListener("transitionend", handleTransitionEnd);
        callback();
    };

    element.addEventListener("transitionend", handleTransitionEnd);

    // Fallback if transitionend never fires (e.g. no CSS loaded, reduced motion).
    window.setTimeout(() => {
        if (element.isConnected) {
            element.removeEventListener("transitionend", handleTransitionEnd);
            callback();
        }
    }, ANIMATION_EXIT_MS + 50);
}

