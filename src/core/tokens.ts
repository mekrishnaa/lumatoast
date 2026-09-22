/**
 * LumaToast design tokens.
 *
 * These constants map to CSS custom properties used by the themes.
 * Override any of these in your CSS to customise LumaToast globally
 * or per-theme without writing extra class selectors.
 *
 * @example
 * ```css
 * :root {
 *   --luma-bg: #1a1a2e;
 *   --luma-radius: 24px;
 *   --luma-font: "Inter", sans-serif;
 * }
 * ```
 */

// ── Duration tokens (ms) ──────────────────────────────────────────────────────

export const DURATION_SHORT    = 2000;
export const DURATION_DEFAULT  = 4000;
export const DURATION_LONG     = 6000;
export const DURATION_INFINITE = Infinity;

// ── Animation tokens (ms) ─────────────────────────────────────────────────────

export const ANIMATION_ENTER_MS = 320;
export const ANIMATION_EXIT_MS  = 300;
export const ANIMATION_STACK_MS = 280;

// ── Layout tokens ─────────────────────────────────────────────────────────────

export const TOAST_WIDTH_PX = 340;
export const TOAST_GAP_PX   = 12;

// ── Z-index ───────────────────────────────────────────────────────────────────

export const Z_INDEX_BASE = 1000;

// ── CSS variable names (single source of truth) ───────────────────────────────
//    All --luma-* CSS properties that users can override.

export const CSS_VARS = {
    // Card layout
    WIDTH:   "--luma-width",
    RADIUS:  "--luma-radius",
    PADDING: "--luma-padding",
    GAP:     "--luma-gap",

    // Background & border
    BG:           "--luma-bg",
    BORDER_COLOR: "--luma-border-color",
    BORDER_WIDTH: "--luma-border-width",
    SHADOW:       "--luma-shadow",
    BACKDROP:     "--luma-backdrop",

    // Typography
    FONT:           "--luma-font",
    TITLE_SIZE:     "--luma-title-size",
    TITLE_WEIGHT:   "--luma-title-weight",
    TITLE_COLOR:    "--luma-title-color",
    DESC_SIZE:      "--luma-desc-size",
    DESC_COLOR:     "--luma-desc-color",
    LINE_HEIGHT:    "--luma-line-height",
    LETTER_SPACING: "--luma-letter-spacing",

    // Icon
    ICON_SIZE: "--luma-icon-size",

    // Close button
    CLOSE_COLOR: "--luma-close-color",
    CLOSE_SIZE:  "--luma-close-size",

    // Action button
    ACTION_BG:           "--luma-action-bg",
    ACTION_COLOR:        "--luma-action-color",
    ACTION_HOVER_BG:     "--luma-action-hover-bg",
    ACTION_RADIUS:       "--luma-action-radius",
    ACTION_PADDING:      "--luma-action-padding",
    ACTION_SIZE:         "--luma-action-size",
    ACTION_WEIGHT:       "--luma-action-weight",
    ACTION_BORDER:       "--luma-action-border",
    ACTION_HOVER_BORDER: "--luma-action-hover-border",

    // Progress bar
    PROGRESS_HEIGHT:  "--luma-progress-height",
    PROGRESS_RADIUS:  "--luma-progress-radius",
    PROGRESS_SUCCESS: "--luma-progress-success",
    PROGRESS_ERROR:   "--luma-progress-error",
    PROGRESS_WARNING: "--luma-progress-warning",
    PROGRESS_INFO:    "--luma-progress-info",
    PROGRESS_LOADING: "--luma-progress-loading",
    PROGRESS_CUSTOM:  "--luma-progress-custom",

    // Accent colors (used for type-specific accents like border-left)
    ACCENT_SUCCESS: "--luma-accent-success",
    ACCENT_ERROR:   "--luma-accent-error",
    ACCENT_WARNING: "--luma-accent-warning",
    ACCENT_INFO:    "--luma-accent-info",

    // Animation durations (set by animationSpeed config)
    DURATION_ENTER: "--luma-duration-enter",
    DURATION_EXIT:  "--luma-duration-exit",
    DURATION_STACK: "--luma-duration-stack",
} as const;

// ── CSS class names (single source of truth) ──────────────────────────────────

export const CLASS_CONTAINER   = "luma-toast-container";
export const CLASS_TOAST       = "luma-toast";
export const CLASS_CARD        = "luma-toast-card";
export const CLASS_ICON        = "luma-toast-icon";
export const CLASS_CONTENT     = "luma-toast-content";
export const CLASS_TITLE       = "luma-toast-title";
export const CLASS_DESCRIPTION = "luma-toast-description";
export const CLASS_ACTION      = "luma-toast-action";
export const CLASS_CLOSE       = "luma-toast-close";
export const CLASS_PROGRESS    = "luma-progress";
export const CLASS_EXIT        = "luma-toast-exit";