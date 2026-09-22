import type { ToastItem } from "../core/types";
import { createElement, applyStyles } from "../utils/dom";
import { toast } from "../core/toast";
import { successIcon } from "../icons/success";
import { errorIcon } from "../icons/error";
import { warningIcon } from "../icons/warning";
import { infoIcon } from "../icons/info";
import { loadingIcon } from "../icons/loading";

/**
 * Build the full wrapper + card DOM element for a toast.
 * The wrapper carries animation data attributes and ARIA roles.
 * The card is the visual surface (themed, bordered, etc.).
 */
export function renderToast(toastItem: ToastItem): HTMLDivElement {
    // ── Wrapper ──────────────────────────────────────────────────────────────
    const classes = [
        "luma-toast",
        `luma-${toastItem.type}`,
        `luma-theme-${toastItem.theme}`,
    ];

    if (toastItem.className) {
        classes.push(...toastItem.className.trim().split(/\s+/));
    }

    const wrapper = createElement("div", classes);

    wrapper.dataset.toastId = toastItem.id;

    // Animation data attributes — CSS selectors drive the actual keyframes.
    wrapper.dataset.enter = toastItem.animationEnter;
    wrapper.dataset.exit  = toastItem.animationExit;

    // ARIA
    wrapper.setAttribute("role", toastItem.type === "error" ? "alert" : "status");
    wrapper.setAttribute("aria-live", toastItem.type === "error" ? "assertive" : "polite");

    // ── Card ─────────────────────────────────────────────────────────────────
    const card = createElement("div", ["luma-toast-card"]);

    // Inline style overrides (safely sets CSS variables & properties).
    applyStyles(card, toastItem.style);

    // Close on card body click.
    if (toastItem.closeOnClick) {
        card.style.cursor = "pointer";
        card.addEventListener("click", (e) => {
            // Don't double-fire if the close button or action button was clicked.
            const target = e.target as HTMLElement;
            if (
                target.closest(".luma-toast-close") ||
                target.closest(".luma-toast-action")
            ) return;

            toast.dismiss(toastItem.id);
        });
    }

    // ── Icon ──────────────────────────────────────────────────────────────────
    if (toastItem.showIcon) {
        const icon = createElement("div", ["luma-toast-icon"]);
        icon.innerHTML = getIcon(toastItem.type);
        card.appendChild(icon);
    }

    // ── Content ───────────────────────────────────────────────────────────────
    const content = createElement("div", ["luma-toast-content"]);

    if (toastItem.title) {
        const title = createElement("div", ["luma-toast-title"]);
        title.textContent = toastItem.title;
        content.appendChild(title);
    }

    if (toastItem.description) {
        const desc = createElement("div", ["luma-toast-description"]);
        desc.textContent = toastItem.description;
        content.appendChild(desc);
    }

    if (toastItem.action) {
        const action = buildActionButton(toastItem);
        content.appendChild(action);
    }

    card.appendChild(content);

    // ── Close button ──────────────────────────────────────────────────────────
    const close = createElement("button", ["luma-toast-close"]);
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Dismiss notification");
    close.setAttribute("title", "Dismiss");

    if (!toastItem.dismissible) {
        close.style.display = "none";
    }

    close.addEventListener("pointerdown", (e) => e.stopPropagation());
    close.addEventListener("click", (e) => {
        e.stopPropagation();
        toast.dismiss(toastItem.id);
    });

    card.appendChild(close);

    // ── Progress bar ──────────────────────────────────────────────────────────
    if (Number.isFinite(toastItem.duration)) {
        const progress = buildProgressBar(toastItem);

        if (toastItem.progressPosition === "top") {
            card.insertBefore(progress, card.firstChild);
        } else {
            card.appendChild(progress);
        }
    }

    wrapper.appendChild(card);

    return wrapper;
}

// ── Action button builder ─────────────────────────────────────────────────────

function buildActionButton(toastItem: ToastItem): HTMLButtonElement {
    const variant = toastItem.action?.variant ?? "solid";

    const action = createElement("button", [
        "luma-toast-action",
        `luma-action-${variant}`,
    ]);

    action.type = "button";
    action.textContent = toastItem.action!.label;
    action.setAttribute("aria-label", toastItem.action!.label);

    action.addEventListener("pointerdown", (e) => e.stopPropagation());
    action.addEventListener("click", (e) => {
        e.stopPropagation();
        toastItem.action?.onClick();
        toast.dismiss(toastItem.id);
    });

    return action;
}

// ── Progress bar builder ──────────────────────────────────────────────────────

function buildProgressBar(toastItem: ToastItem): HTMLDivElement {
    const progress = createElement("div", ["luma-progress"]);

    const elapsed = Date.now() - toastItem.createdAt;

    progress.style.animationDuration = `${toastItem.duration}ms`;
    // Negative delay makes the animation start mid-way (accounts for render lag).
    progress.style.animationDelay = `-${elapsed}ms`;

    if (toastItem.progressPosition === "top") {
        progress.classList.add("luma-progress-top");
    }

    return progress;
}

// ── Icon resolver ─────────────────────────────────────────────────────────────

function getIcon(type: ToastItem["type"]): string {
    switch (type) {
        case "success": return successIcon;
        case "error":   return errorIcon;
        case "warning": return warningIcon;
        case "loading": return loadingIcon;
        case "info":
        default:        return infoIcon;
    }
}