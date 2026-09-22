import type { ToastPosition } from "../core/types";
import { createElement } from "../utils/dom";

const CONTAINER_CLASS = "luma-toast-container";

const containers = new Map<ToastPosition, HTMLElement>();

export function getContainer(position: ToastPosition): HTMLElement {
  const existing = containers.get(position);

  if (existing) return existing;

  const container = createElement("div", [
    CONTAINER_CLASS,
    `luma-${position}`
  ]);

  container.dataset.position = position;
  container.setAttribute("role", "region");
  container.setAttribute("aria-live", "polite");
  container.setAttribute("aria-atomic", "false");
  container.setAttribute("aria-relevant", "additions removals");

  document.body.appendChild(container);

  containers.set(position, container);

  return container;
}

export function removeContainer(position: ToastPosition) {
  const container = containers.get(position);

  if (!container) return;

  container.remove();
  containers.delete(position);
}