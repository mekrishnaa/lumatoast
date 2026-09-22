// ── Toast type ────────────────────────────────────────────────────────────────

export type ToastType =
    | "success"
    | "error"
    | "warning"
    | "info"
    | "loading"
    | "custom";

// ── Theme ─────────────────────────────────────────────────────────────────────

export type ToastTheme =
    | "linear"
    | "aurora"
    | "vision"
    | "minimal"
    | "cupertino"
    | "material"
    | "terminal"
    | "github"
    | "cyberpunk";

// ── Position ──────────────────────────────────────────────────────────────────

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

// ── Progress bar placement ────────────────────────────────────────────────────

/** Where the progress bar is rendered inside the card. */
export type ToastProgressPosition = "top" | "bottom";

// ── Animation types ───────────────────────────────────────────────────────────

/** Enter animation style. */
export type ToastAnimationEnter =
    | "slide"    // slide down + fade (default)
    | "fade"     // fade only
    | "scale"    // scale up from center
    | "bounce"   // spring overshoot
    | "none";    // instant

/** Exit animation style. */
export type ToastAnimationExit =
    | "slide"    // slide out sideways + fade (default)
    | "fade"     // fade only
    | "none";    // instant

/** Global animation speed preset. */
export type ToastAnimationSpeed = "slow" | "normal" | "fast";

// ── Action button ─────────────────────────────────────────────────────────────

/** Action button visual variant. */
export type ToastActionVariant = "solid" | "outline" | "ghost";

export interface ToastAction {
    label: string;
    onClick: () => void;
    /** Visual style of the action button. Default: "solid" */
    variant?: ToastActionVariant;
}

// ── Options ───────────────────────────────────────────────────────────────────

export interface ToastOptions {
    /** Stable id — useful for `toast.update()`. Auto-generated if omitted. */
    id?: string;

    /** Bold title text rendered above the description. */
    title?: string;

    /** Body text of the toast. */
    description?: string;

    /** Auto-dismiss delay in ms. Use `Infinity` to never auto-dismiss. Default: 4000 */
    duration?: number;

    /** Show the × close button. Default: true */
    dismissible?: boolean;

    /** Screen position of the toast. Default: "top-right" */
    position?: ToastPosition;

    /** Visual theme preset. Default: "linear" */
    theme?: ToastTheme;

    /** Action button shown inside the toast. */
    action?: ToastAction;

    // ── Customization ────────────────────────────────────────────────────────

    /** Extra CSS class(es) added to the toast wrapper element. */
    className?: string;

    /**
     * Inline styles applied to the toast card.
     * Supports both regular CSS properties and CSS custom properties.
     *
     * @example
     * style: { "--luma-bg": "#1a1a2e", borderRadius: "24px" }
     */
    style?: Record<string, string>;

    /** Show the type icon. Default: true */
    showIcon?: boolean;

    /**
     * Dismiss the toast when the user clicks anywhere on the card body.
     * Default: false
     */
    closeOnClick?: boolean;

    /** Where the progress bar is placed inside the card. Default: "bottom" */
    progressPosition?: ToastProgressPosition;

    /** Enter animation style. Default: "slide" */
    animationEnter?: ToastAnimationEnter;

    /** Exit animation style. Default: "slide" */
    animationExit?: ToastAnimationExit;
}

// ── ToastItem (internal resolved state) ──────────────────────────────────────

export interface ToastItem extends ToastOptions {
    id: string;
    type: ToastType;

    title?: string;
    description?: string;
    action?: ToastAction;

    duration: number;
    dismissible: boolean;
    position: ToastPosition;
    theme: ToastTheme;

    showIcon: boolean;
    closeOnClick: boolean;
    progressPosition: ToastProgressPosition;
    animationEnter: ToastAnimationEnter;
    animationExit: ToastAnimationExit;

    createdAt: number;
    visible: boolean;
}

// ── Update options ─────────────────────────────────────────────────────────────

export interface ToastUpdateOptions {
    type?: ToastType;

    title?: string;
    description?: string;

    duration?: number;
    dismissible?: boolean;

    action?: ToastAction;

    theme?: ToastTheme;
    className?: string;
    style?: Record<string, string>;
    showIcon?: boolean;
    progressPosition?: ToastProgressPosition;
}

// ── Promise options ────────────────────────────────────────────────────────────

export interface PromiseToastOptions {
    loading: ToastOptions;
    success: ToastOptions;
    error: ToastOptions;
}