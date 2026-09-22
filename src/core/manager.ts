import {
    DEFAULT_DISMISSIBLE,
    DEFAULT_DURATION,
    DEFAULT_POSITION,
    DEFAULT_THEME,
    DEFAULT_SHOW_ICON,
    DEFAULT_CLOSE_ON_CLICK,
    DEFAULT_PROGRESS_POS,
    DEFAULT_ANIMATION_ENTER,
    DEFAULT_ANIMATION_EXIT,
    DEFAULT_ANIMATION_SPEED,
    MAX_VISIBLE_TOASTS
} from "./constants";

import type {
    ToastItem,
    ToastOptions,
    ToastPosition,
    ToastTheme,
    ToastType,
    ToastUpdateOptions,
    ToastProgressPosition,
    ToastAnimationEnter,
    ToastAnimationExit,
    ToastAnimationSpeed,
} from "./types";

import { createToastId } from "../utils/id";
import { EventEmitter } from "../utils/events";

// ── Global configuration ───────────────────────────────────────────────────────

export interface ToastConfig {
    /** Default auto-dismiss duration in ms. Default: 4000 */
    duration?: number;
    /** Default screen position. Default: "top-right" */
    position?: ToastPosition;
    /** Default visual theme. Default: "linear" */
    theme?: ToastTheme;
    /** Default dismissible flag. Default: true */
    dismissible?: boolean;
    /** Maximum number of toasts visible at once. Default: 5 */
    maxVisible?: number;
    /** Show the type icon by default. Default: true */
    showIcon?: boolean;
    /** Dismiss on card body click by default. Default: false */
    closeOnClick?: boolean;
    /** Default progress bar placement. Default: "bottom" */
    progressPosition?: ToastProgressPosition;
    /** Default enter animation. Default: "slide" */
    animationEnter?: ToastAnimationEnter;
    /** Default exit animation. Default: "slide" */
    animationExit?: ToastAnimationExit;
    /**
     * Global animation speed preset.
     * Applies `--luma-duration-enter/exit/stack` CSS variables on <html>.
     * Default: "normal"
     */
    animationSpeed?: ToastAnimationSpeed;
}

let globalConfig: Required<ToastConfig> = {
    duration:         DEFAULT_DURATION,
    position:         DEFAULT_POSITION,
    theme:            DEFAULT_THEME,
    dismissible:      DEFAULT_DISMISSIBLE,
    maxVisible:       MAX_VISIBLE_TOASTS,
    showIcon:         DEFAULT_SHOW_ICON,
    closeOnClick:     DEFAULT_CLOSE_ON_CLICK,
    progressPosition: DEFAULT_PROGRESS_POS,
    animationEnter:   DEFAULT_ANIMATION_ENTER,
    animationExit:    DEFAULT_ANIMATION_EXIT,
    animationSpeed:   DEFAULT_ANIMATION_SPEED,
};

// Speed → CSS duration values (ms)
const SPEED_MAP: Record<ToastAnimationSpeed, { enter: number; exit: number; stack: number }> = {
    slow:   { enter: 500, exit: 450, stack: 400 },
    normal: { enter: 320, exit: 300, stack: 280 },
    fast:   { enter: 180, exit: 160, stack: 150 },
};

/**
 * Apply animation speed CSS variables to <html> so all toasts pick them up.
 */
function applyAnimationSpeed(speed: ToastAnimationSpeed): void {
    if (typeof document === "undefined") return;

    const { enter, exit, stack } = SPEED_MAP[speed];
    const root = document.documentElement;

    root.style.setProperty("--luma-duration-enter", `${enter}ms`);
    root.style.setProperty("--luma-duration-exit",  `${exit}ms`);
    root.style.setProperty("--luma-duration-stack", `${stack}ms`);
}

/**
 * Set global defaults for all toasts.
 * Per-toast options always override these.
 *
 * @example
 * configure({
 *   position: "bottom-right",
 *   theme: "minimal",
 *   duration: 3000,
 *   progressPosition: "top",
 *   animationEnter: "scale",
 *   animationSpeed: "fast",
 * });
 */
export function configure(config: ToastConfig): void {
    globalConfig = { ...globalConfig, ...config };

    if (config.animationSpeed) {
        applyAnimationSpeed(config.animationSpeed);
    }
}

// ── ToastManager ──────────────────────────────────────────────────────────────

export class ToastManager {
    private visible: ToastItem[] = [];
    private queue:   ToastItem[] = [];

    readonly changes = new EventEmitter<ToastItem[]>();

    /**
     * Returns all visible toasts.
     */
    getToasts(): ToastItem[] {
        return [...this.visible];
    }

    /**
     * Create a new toast.
     */
    create(type: ToastType, options: ToastOptions = {}): ToastItem {
        const toast: ToastItem = {
            id:               options.id               ?? createToastId(),
            type,
            title:            options.title,
            description:      options.description,
            duration:         options.duration         ?? globalConfig.duration,
            dismissible:      options.dismissible      ?? globalConfig.dismissible,
            position:         options.position         ?? globalConfig.position,
            theme:            options.theme            ?? globalConfig.theme,
            action:           options.action,
            // customization
            className:        options.className,
            style:            options.style,
            showIcon:         options.showIcon         ?? globalConfig.showIcon,
            closeOnClick:     options.closeOnClick     ?? globalConfig.closeOnClick,
            progressPosition: options.progressPosition ?? globalConfig.progressPosition,
            animationEnter:   options.animationEnter   ?? globalConfig.animationEnter,
            animationExit:    options.animationExit    ?? globalConfig.animationExit,
            // internal
            createdAt:        Date.now(),
            visible:          false
        };

        if (this.visible.length >= globalConfig.maxVisible) {
            this.queue.push(toast);
        } else {
            toast.visible = true;
            this.visible.push(toast);
            this.changes.emit(this.getToasts());
        }

        return toast;
    }

    /**
     * Remove a toast by id.
     */
    dismiss(id: string): void {
        const index = this.visible.findIndex((t) => t.id === id);

        if (index === -1) return;

        this.visible.splice(index, 1);

        if (this.queue.length > 0) {
            const next = this.queue.shift()!;
            next.visible = true;
            this.visible.push(next);
        }

        this.changes.emit(this.getToasts());
    }

    /**
     * Remove all visible and queued toasts.
     */
    dismissAll(): void {
        this.visible = [];
        this.queue   = [];
        this.changes.emit([]);
    }

    /**
     * Remove the most recently added visible toast.
     */
    dismissLatest(): void {
        const latest = this.visible[this.visible.length - 1];
        if (!latest) return;
        this.dismiss(latest.id);
    }

    /**
     * Update an existing toast by id.
     * Works on both visible and queued toasts.
     */
    update(id: string, updates: ToastUpdateOptions): ToastItem | null {
        const visibleToast = this.visible.find((t) => t.id === id);

        if (visibleToast) {
            Object.assign(visibleToast, updates);

            if (updates.duration !== undefined) {
                visibleToast.createdAt = Date.now();
            }

            this.changes.emit(this.getToasts());
            return visibleToast;
        }

        const queuedToast = this.queue.find((t) => t.id === id);

        if (queuedToast) {
            Object.assign(queuedToast, updates);

            if (updates.duration !== undefined) {
                queuedToast.createdAt = Date.now();
            }

            return queuedToast;
        }

        return null;
    }
}

export const toastManager = new ToastManager();