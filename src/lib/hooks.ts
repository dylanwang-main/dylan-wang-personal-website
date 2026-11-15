import { RefObject, useEffect, useState } from 'react';
import { site } from '../content/site';

function useMedia(query: string, fallback = false) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : fallback
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Honors the OS setting, plus ?motion=reduce for testing */
export function useReducedMotion() {
  const os = useMedia('(prefers-reduced-motion: reduce)');
  const forced =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('motion') === 'reduce';
  return os || forced;
}

/** Touch-first devices (phones, tablets): no hover, coarse pointer */
export function useIsTouch() {
  return useMedia('(hover: none), (pointer: coarse)');
}

export function useIsNarrow() {
  return useMedia('(max-width: 640px)');
}

export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '120px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Sets <title> and the meta description for the current page */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.name;
    const desc = description ?? site.oneLiner;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = desc;
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', desc);
  }, [title, description]);
}

export function formatDate(iso: string) {
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  const month = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' });
  return d ? `${month} ${d}, ${y}` : `${month} ${y}`;
}
