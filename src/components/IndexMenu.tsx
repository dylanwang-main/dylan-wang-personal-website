/**
 * The Index: a full-screen menu that lists every section. It's the escape hatch
 * for anyone who doesn't want to spin the wheel, and the main nav on phones.
 * Opens with the Index button, "/" or ⌘K / Ctrl+K. Escape closes it.
 */
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { NOW } from '../content/now';
import { SECTIONS, site } from '../content/site';
import { Link, usePath } from '../router';

let open = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((s) => s());
export const indexMenu = {
  open() {
    open = true;
    emit();
  },
  close() {
    open = false;
    emit();
  },
  toggle() {
    open = !open;
    emit();
  },
};
const useOpen = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => open,
    () => false
  );

export function IndexButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => indexMenu.open()}
      className={`font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-ink-3 ${className}`}
      aria-haspopup="dialog"
    >
      Index <span className="text-ink-3">/</span>
    </button>
  );
}

export function IndexMenu() {
  const isOpen = useOpen();
  const path = usePath();
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Close on route change
  useEffect(() => {
    indexMenu.close();
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        indexMenu.toggle();
      } else if (e.key === 'Escape' && open) {
        indexMenu.close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => firstLink.current?.focus());
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Index"
          data-no-drift-scroll="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-paper"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 pb-10 pt-6 sm:px-10 sm:pt-9">
            <div className="flex items-start justify-between">
              <Link to="/" className="font-serif text-[22px] leading-none tracking-tight">
                {site.name}
              </Link>
              <button
                type="button"
                onClick={() => indexMenu.close()}
                className="font-mono text-[10.5px] uppercase tracking-[0.18em] hover:text-ink-3"
              >
                Close <span className="text-ink-3">esc</span>
              </button>
            </div>

            <nav aria-label="Sections" className="mt-12 flex-1 sm:mt-16">
              <ol className="m-0 list-none p-0">
                {SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    className="border-t border-line last:border-b"
                  >
                    <Link
                      ref={i === 0 ? firstLink : undefined}
                      to={s.path}
                      className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-3 py-3 sm:grid-cols-[5rem_1fr_auto] sm:py-4"
                    >
                      <span className="font-mono text-[11px] tracking-[0.14em] text-ink-3">{s.numeral}</span>
                      <span className="font-serif text-[44px] leading-[1.05] tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-[72px]">
                        {s.label}
                        {path.startsWith(s.path) && <span className="ml-3 align-middle text-[18px] text-rust">●</span>}
                      </span>
                      <span className="col-start-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 sm:col-start-3 sm:text-right">
                        {s.room}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ol>
            </nav>

            <div className="mt-10 grid gap-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Link to="/" className="hover:text-ink">
                  ← Back to the drift
                </Link>
                <Link to="/colophon" className="hover:text-ink">
                  Colophon
                </Link>
                <Link to="/changelog" className="hover:text-ink">
                  Changelog
                </Link>
              </div>
              <div className="flex flex-col gap-1.5">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                    {s.label} ↗
                  </a>
                ))}
              </div>
              <p className="m-0 normal-case tracking-normal text-ink-3 sm:text-right">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em]">Currently</span>
                <br />
                <span className="font-sans text-[13px]">{NOW.currently}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
