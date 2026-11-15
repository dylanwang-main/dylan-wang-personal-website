/**
 * A tiny history router. The site has a handful of routes, so this keeps
 * dependencies down. navigate() pushes a URL, usePath() re-renders on change,
 * and <Link> behaves like a normal link (cmd-click still opens a new tab).
 */
import { AnchorHTMLAttributes, MouseEvent, forwardRef, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', notify);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getPath() {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function usePath() {
  return useSyncExternalStore(subscribe, getPath, () => '/');
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.href);
  if (url.origin !== window.location.origin) {
    window.location.href = to;
    return;
  }
  const next = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (next === current) return;

  if (opts.replace) window.history.replaceState({}, '', next);
  else window.history.pushState({}, '', next);

  notify();

  // Jump to a hash target after the next paint, otherwise to the top
  requestAnimationFrame(() => {
    if (url.hash) {
      document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  });
}

export function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, onClick, target, rel, ...rest },
  ref
) {
  const external = isExternal(to);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || external) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      ref={ref}
      href={to}
      onClick={handleClick}
      target={external ? target ?? '_blank' : target}
      rel={external ? rel ?? 'noopener noreferrer' : rel}
      {...rest}
    />
  );
});

/** Matches "/work/:slug" style patterns. Returns params or null. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const pParts = pattern.split('/').filter(Boolean);
  const aParts = path.split('/').filter(Boolean);
  if (pParts.length !== aParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(aParts[i]);
    else if (pParts[i] !== aParts[i]) return null;
  }
  return params;
}
