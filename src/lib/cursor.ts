/**
 * Tiny store so the 3D scene (which has no DOM elements to hover) can tell the
 * custom cursor what it is over. DOM elements use data-cursor attributes instead.
 */
export type CursorMode = 'default' | 'link' | 'view';

export interface CursorOverride {
  mode: CursorMode;
  label?: string;
  caption?: string;
}

let override: CursorOverride | null = null;
const listeners = new Set<() => void>();

export function setCursorOverride(next: CursorOverride | null) {
  override = next;
  listeners.forEach((l) => l());
}

export function getCursorOverride() {
  return override;
}

export function subscribeCursor(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
