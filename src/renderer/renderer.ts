import { toast } from "../core/toast";
import type { ToastItem, ToastPosition } from "../core/types";
import { attachSwipeGesture } from "./gestures";
import type { TimerState } from "../utils/timer";
import { getContainer, removeContainer } from "./container";
import { renderToast } from "../components/toast";
import { recordPositions, animateStack, updateDepth } from "./animations";
import { loadingIcon } from "../icons/loading";
import { infoIcon } from "../icons/info";
import { warningIcon } from "../icons/warning";
import { errorIcon } from "../icons/error";
import { successIcon } from "../icons/success";
import { ANIMATION_EXIT_MS } from "../core/tokens";
import { applyStyles } from "../utils/dom";

let initialized = false;

/** Keeps rendered DOM elements by toast ID. */
const renderedToasts = new Map<string, HTMLElement>();

/** Keeps timer state for every toast. */
const timers = new Map<string, TimerState>();

/**
 * Initialize the DOM renderer. Must be called once before showing toasts.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function initializeRenderer() {
    if (typeof window === "undefined") return;
    if (initialized) return;
    initialized = true;

    toast.subscribe(syncToasts);
    window.addEventListener("keydown", handleEscapeKey);
}

// ── Keyboard support ──────────────────────────────────────────────────────────

function handleEscapeKey(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    toast.dismissLatest();
}

// ── Core sync loop ────────────────────────────────────────────────────────────

function syncToasts(toasts: ToastItem[]) {
    // Snapshot positions before DOM mutations (FLIP step 1: First).
    recordPositions(renderedToasts);

    const activeIds = new Set(toasts.map((t) => t.id));

    // Remove dismissed toasts.
    for (const [id, element] of renderedToasts.entries()) {
        if (!activeIds.has(id)) {
            removeToast(id, element);
        }
    }

    // Group toasts by position so each container is managed independently.
    const grouped = new Map<ToastPosition, ToastItem[]>();

    toasts.forEach((toastItem) => {
        const list = grouped.get(toastItem.position) ?? [];
        list.push(toastItem);
        grouped.set(toastItem.position, list);
    });

    // Render or patch each group.
    grouped.forEach((positionToasts, position) => {
        const container = getContainer(position);

        positionToasts.forEach((toastItem) => {
            const existing = renderedToasts.get(toastItem.id);

            if (existing) {
                // Patch the existing DOM element in-place.
                patchToast(existing, toastItem);

                // If the toast transitioned from loading → success/error,
                // start the auto-dismiss timer now.
                if (
                    Number.isFinite(toastItem.duration) &&
                    !timers.has(toastItem.id)
                ) {
                    startTimer(toastItem, existing);
                }

                return;
            }

            // New toast: render and mount.
            const element = renderToast(toastItem);
            container.appendChild(element);
            renderedToasts.set(toastItem.id, element);
            startTimer(toastItem, element);
        });
    });

    // FLIP: animate existing toasts from their old positions to new ones.
    requestAnimationFrame(() => {
        animateStack(renderedToasts);
        updateDepth(renderedToasts);
    });
}

// ── In-place DOM patching (for toast.update) ──────────────────────────────────

function patchToast(element: HTMLElement, toastItem: ToastItem) {
    // Update wrapper classes (type + theme).
    const baseClasses = [
        "luma-toast",
        `luma-${toastItem.type}`,
        `luma-theme-${toastItem.theme}`,
    ];

    if (toastItem.className) {
        baseClasses.push(...toastItem.className.trim().split(/\s+/));
    }

    element.className = baseClasses.join(" ");

    // Preserve data-removing if set.
    element.dataset.enter = toastItem.animationEnter;
    element.dataset.exit  = toastItem.animationExit;

    const card = element.querySelector(".luma-toast-card") as HTMLElement;
    if (!card) return;

    // Inline style overrides.
    applyStyles(card, toastItem.style);

    // --- Icon ---
    const iconSlot = card.querySelector(".luma-toast-icon") as HTMLElement | null;

    if (toastItem.showIcon) {
        if (iconSlot) {
            iconSlot.innerHTML = resolveIcon(toastItem.type);
        }
        // Icon was hidden before — we don't re-add it here to keep patching simple.
        // The full element will be reconstructed on next dismiss+show.
    } else {
        iconSlot?.remove();
    }

    // --- Title ---
    const title = card.querySelector(".luma-toast-title") as HTMLElement | null;

    if (toastItem.title) {
        if (title) {
            title.textContent = toastItem.title;
        } else {
            const node = document.createElement("div");
            node.className = "luma-toast-title";
            node.textContent = toastItem.title;
            card.querySelector(".luma-toast-content")?.prepend(node);
        }
    } else {
        title?.remove();
    }

    // --- Description ---
    const description = card.querySelector(".luma-toast-description") as HTMLElement | null;

    if (toastItem.description) {
        if (description) {
            description.textContent = toastItem.description;
        } else {
            const node = document.createElement("div");
            node.className = "luma-toast-description";
            node.textContent = toastItem.description;
            card.querySelector(".luma-toast-content")?.appendChild(node);
        }
    } else {
        description?.remove();
    }

    // --- Close button ---
    const close = card.querySelector(".luma-toast-close") as HTMLButtonElement | null;
    if (close) {
        close.style.display = toastItem.dismissible ? "" : "none";
    }

    // --- Progress bar ---
    const existingProgress = card.querySelector(".luma-progress") as HTMLElement | null;

    if (Number.isFinite(toastItem.duration)) {
        if (!existingProgress) {
            // Loading → Success/Error: create the progress bar for the first time.
            const progress = document.createElement("div");
            progress.className = "luma-progress";
            progress.style.animationDuration = `${toastItem.duration}ms`;

            if (toastItem.progressPosition === "top") {
                progress.classList.add("luma-progress-top");
                card.insertBefore(progress, card.firstChild);
            } else {
                card.appendChild(progress);
            }
        }
        // If it already exists, leave it — do not reset the animation.
    } else {
        existingProgress?.remove();
    }
}

function resolveIcon(type: ToastItem["type"]): string {
    switch (type) {
        case "success": return successIcon;
        case "error":   return errorIcon;
        case "warning": return warningIcon;
        case "loading": return loadingIcon;
        case "info":
        default:        return infoIcon;
    }
}

// ── Timer management ──────────────────────────────────────────────────────────

function startTimer(toastItem: ToastItem, element: HTMLElement) {
    const { duration } = toastItem;

    // Loading toasts have duration = Infinity — no auto-dismiss.
    if (!Number.isFinite(duration)) {
        timers.delete(toastItem.id);
        return;
    }

    const timer: TimerState = {
        timeoutId: 0,
        startedAt: Date.now(),
        remaining: duration
    };

    const schedule = () => {
        timer.startedAt = Date.now();
        timer.timeoutId = window.setTimeout(() => {
            toast.dismiss(toastItem.id);
        }, timer.remaining);
    };

    schedule();
    timers.set(toastItem.id, timer);

    attachHoverEvents(element, toastItem.id);
    attachSwipeGesture(
        element,
        toastItem.id,
        toastItem.position,
        () => pauseTimer(toastItem.id, element),
        () => resumeTimer(toastItem.id, element)
    );
}

function pauseTimer(id: string, element: HTMLElement) {
    const timer = timers.get(id);
    if (!timer) return;

    clearTimeout(timer.timeoutId);
    timer.remaining -= Date.now() - timer.startedAt;

    const progress = element.querySelector(".luma-progress") as HTMLElement | null;
    if (progress) progress.style.animationPlayState = "paused";
}

function resumeTimer(id: string, element: HTMLElement) {
    const timer = timers.get(id);
    if (!timer) return;

    timer.startedAt = Date.now();
    timer.timeoutId = window.setTimeout(() => {
        toast.dismiss(id);
    }, timer.remaining);

    const progress = element.querySelector(".luma-progress") as HTMLElement | null;
    if (progress) progress.style.animationPlayState = "running";
}

function attachHoverEvents(element: HTMLElement, toastId: string) {
    element.addEventListener("mouseenter", () => pauseTimer(toastId, element));
    element.addEventListener("mouseleave", () => resumeTimer(toastId, element));
}

// ── Toast removal with exit animation ────────────────────────────────────────

function removeToast(id: string, element: HTMLElement) {
    const timer = timers.get(id);

    if (timer) {
        clearTimeout(timer.timeoutId);
        timers.delete(id);
    }

    if (element.dataset.removing === "true") return;
    element.dataset.removing = "true";

    // Trigger exit animation class.
    // CSS uses [data-exit="slide"] / [data-exit="fade"] / [data-exit="none"]
    // selectors on .luma-toast-exit to apply the right transform.
    requestAnimationFrame(() => {
        element.classList.add("luma-toast-exit");
    });

    const cleanup = () => {
        const container = element.parentElement as HTMLElement | null;

        element.remove();
        renderedToasts.delete(id);

        // Remove the position container if it's now empty.
        if (container && container.childElementCount === 0) {
            const position = container.dataset.position as ToastPosition;
            removeContainer(position);
        }
    };

    // Primary: wait for the CSS transition to finish.
    const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target !== element) return;
        element.removeEventListener("transitionend", handleTransitionEnd);
        cleanup();
    };

    element.addEventListener("transitionend", handleTransitionEnd);

    // Fallback: in case transitionend never fires (reduced motion, no CSS).
    window.setTimeout(() => {
        if (element.isConnected) {
            element.removeEventListener("transitionend", handleTransitionEnd);
            cleanup();
        }
    }, ANIMATION_EXIT_MS + 50);
}
