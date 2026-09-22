/**
 * Generates unique IDs for every toast.
 * Format: toast-<timestamp>-<counter>
 *
 * Example:
 * toast-1758189234567-1
 * toast-1758189234571-2
 */

let counter = 0;

export function createToastId(prefix = "toast"): string {
    counter += 1;

    return `${prefix}-${Date.now()}-${counter}`;
}