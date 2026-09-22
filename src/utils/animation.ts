/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
}

/**
 * Map a value from one range to another.
 *
 * @example
 * // Map drag distance (0–180px) to opacity (1.0–0.35)
 * mapRange(Math.abs(x), 0, 180, 1.0, 0.35)
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    const ratio = (value - inMin) / (inMax - inMin);
    return outMin + ratio * (outMax - outMin);
}

/**
 * Returns true if the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

