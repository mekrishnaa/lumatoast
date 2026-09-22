import {
    DURATION_DEFAULT,
    TOAST_GAP_PX,
    Z_INDEX_BASE
} from "./tokens";

export const DEFAULT_DURATION         = DURATION_DEFAULT;
export const DEFAULT_POSITION         = "top-right"  as const;
export const DEFAULT_THEME            = "linear"     as const;
export const DEFAULT_DISMISSIBLE      = true;
export const DEFAULT_SHOW_ICON        = true;
export const DEFAULT_CLOSE_ON_CLICK   = false;
export const DEFAULT_PROGRESS_POS     = "bottom"     as const;
export const DEFAULT_ANIMATION_ENTER  = "slide"      as const;
export const DEFAULT_ANIMATION_EXIT   = "slide"      as const;
export const DEFAULT_ANIMATION_SPEED  = "normal"     as const;
export const MAX_VISIBLE_TOASTS       = 5;
export const STACK_GAP                = TOAST_GAP_PX;
export { Z_INDEX_BASE };