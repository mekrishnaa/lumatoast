import { toast } from "../core/toast";
import type { ToastPosition } from "../core/types";

const DISMISS_THRESHOLD = 120;
const MAX_ROTATION      = 8;
const EXIT_DISTANCE     = 450;

/**
 * Attach swipe-to-dismiss gesture to a toast element.
 *
 * - Left/right positions → swipe horizontally to dismiss
 * - Center positions     → swipe in the direction away from the edge
 * - Top positions        → swipe up to dismiss
 * - Bottom positions     → swipe down to dismiss
 *
 * Pauses the auto-dismiss timer while the user is dragging.
 */
export function attachSwipeGesture(
    element: HTMLElement,
    toastId: string,
    position: ToastPosition,
    onPause: () => void,
    onResume: () => void
): void {
    const isVertical = position === "top-center" || position === "bottom-center";
    const isBottom   = position.startsWith("bottom");

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let dragging = false;

    const card = element.querySelector(".luma-toast-card") as HTMLElement;

    // Allow the axis we're not using for dragging to scroll the page normally.
    card.style.touchAction = isVertical ? "pan-x" : "pan-y";

    const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as HTMLElement;

        // Don't start swipe from buttons or links.
        if (
            target.closest(".luma-toast-close") ||
            target.closest(".luma-toast-action")
        ) {
            return;
        }

        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        currentX = 0;
        currentY = 0;

        onPause();

        element.style.transition = "none";
        element.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
        if (!dragging) return;

        currentX = event.clientX - startX;
        currentY = event.clientY - startY;

        if (isVertical) {
            // Top-center / bottom-center: drag vertically.
            const clampedY = isBottom
                ? Math.max(0, currentY)   // bottom: only drag down
                : Math.min(0, currentY);  // top: only drag up

            element.style.transform = `translate3d(0, ${clampedY}px, 0)`;
            element.style.opacity = `${Math.max(0.35, 1 - Math.abs(clampedY) / 180)}`;
        } else {
            // Left / right / top-left / etc.: drag horizontally.
            const rotate =
                Math.sign(currentX) *
                Math.min(Math.abs(currentX) / 20, MAX_ROTATION);

            element.style.transform = `translate3d(${currentX}px, 0, 0) rotate(${rotate}deg)`;
            element.style.opacity = `${Math.max(0.35, 1 - Math.abs(currentX) / 180)}`;
        }
    };

    const handlePointerUp = (event: PointerEvent) => {
        if (!dragging) return;

        dragging = false;
        element.releasePointerCapture(event.pointerId);

        element.style.transition =
            "transform 280ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease";

        const delta = isVertical ? currentY : currentX;

        if (Math.abs(delta) >= DISMISS_THRESHOLD) {
            // Fly off screen in the drag direction.
            if (isVertical) {
                const exitY = delta > 0 ? EXIT_DISTANCE : -EXIT_DISTANCE;
                element.style.transform = `translate3d(0, ${exitY}px, 0)`;
            } else {
                const exitX     = delta > 0 ? EXIT_DISTANCE : -EXIT_DISTANCE;
                const exitRotate = delta > 0 ? 12 : -12;
                element.style.transform = `translate3d(${exitX}px, 0, 0) rotate(${exitRotate}deg)`;
            }

            element.style.opacity = "0";

            setTimeout(() => {
                toast.dismiss(toastId);
            }, 280);

            return;
        }

        // Not far enough — spring back.
        element.style.transform = "";
        element.style.opacity = "1";

        onResume();
    };

    element.addEventListener("pointerdown",  handlePointerDown);
    element.addEventListener("pointermove",  handlePointerMove);
    element.addEventListener("pointerup",    handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);
}