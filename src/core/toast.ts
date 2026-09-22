import type {
    ToastOptions,
    ToastUpdateOptions,
    PromiseToastOptions
} from "./types";
import { toastManager, configure } from "./manager";

export const toast = {
    /**
     * Show a success toast.
     */
    success(message: string, options: ToastOptions = {}) {
        return toastManager.create("success", {
            ...options,
            description: message
        });
    },

    /**
     * Show an error toast.
     */
    error(message: string, options: ToastOptions = {}) {
        return toastManager.create("error", {
            ...options,
            description: message
        });
    },

    /**
     * Show a warning toast.
     */
    warning(message: string, options: ToastOptions = {}) {
        return toastManager.create("warning", {
            ...options,
            description: message
        });
    },

    /**
     * Show an info toast.
     */
    info(message: string, options: ToastOptions = {}) {
        return toastManager.create("info", {
            ...options,
            description: message
        });
    },

    /**
     * Show a persistent loading toast that must be dismissed manually
     * or converted via `toast.update()` / `toast.promise()`.
     */
    loading(message: string, options: ToastOptions = {}) {
        return toastManager.create("loading", {
            ...options,
            duration: Infinity,
            dismissible: false,
            description: message
        });
    },

    /**
     * Show a fully custom toast.
     * You control the title, description, action, theme, and position.
     *
     * @example
     * toast.custom("Custom notification", { title: "Hey!", theme: "cyberpunk" });
     */
    custom(message: string, options: ToastOptions = {}) {
        return toastManager.create("custom", {
            ...options,
            description: message
        });
    },

    /**
     * Dismiss a toast by id.
     */
    dismiss(id: string) {
        toastManager.dismiss(id);
    },

    /**
     * Dismiss all visible and queued toasts.
     */
    dismissAll() {
        toastManager.dismissAll();
    },

    /**
     * Dismiss the most recently added visible toast.
     */
    dismissLatest() {
        toastManager.dismissLatest();
    },

    /**
     * Update an existing toast's properties.
     * Useful for transitioning a loading toast to success or error.
     */
    update(id: string, updates: ToastUpdateOptions) {
        return toastManager.update(id, updates);
    },

    /**
     * Track a promise: show a loading toast, then auto-transition to
     * success or error based on the promise outcome.
     *
     * @example
     * toast.promise(fetch("/api/save"), {
     *   loading: { description: "Saving..." },
     *   success: { description: "Saved!" },
     *   error:   { description: "Failed to save." }
     * });
     */
    promise<T>(
        promise: Promise<T>,
        options: PromiseToastOptions
    ): Promise<T> {
        const loadingToast = toast.loading(
            options.loading.description ?? "",
            { ...options.loading }
        );

        return promise
            .then((result) => {
                toast.update(loadingToast.id, {
                    type:        "success",
                    ...options.success,
                    duration:    options.success.duration ?? 3000,
                    dismissible: true
                });

                return result;
            })
            .catch((error) => {
                toast.update(loadingToast.id, {
                    type:        "error",
                    ...options.error,
                    duration:    options.error.duration ?? 4000,
                    dismissible: true
                });

                throw error;
            });
    },

    /**
     * Subscribe to toast state changes.
     * Returns an unsubscribe function.
     *
     * @example
     * const unsub = toast.subscribe((toasts) => console.log(toasts));
     * // later:
     * unsub();
     */
    subscribe(listener: (toasts: ReturnType<typeof toastManager.getToasts>) => void) {
        return toastManager.changes.subscribe(listener);
    },

    /**
     * Set global defaults for all toasts.
     * Per-toast options always override these.
     *
     * @example
     * toast.configure({ position: "bottom-right", theme: "minimal", duration: 3000 });
     */
    configure
};

export { toastManager };