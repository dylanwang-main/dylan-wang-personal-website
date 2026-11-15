/**
 * Layout for every inner page: a quiet header, the page, and a footer that
 * ends with a way to say hi and a way back to the drift.
 */
import { ReactNode } from 'react';
import { NOW } from '../content/now';
import { SECTIONS, site } from '../content/site';
import type { SectionId } from '../content/types';
import { Link, usePath } from '../router';
import { IndexButton } from './IndexMenu';

export function SiteHeader() {
  const path = usePath();
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-paper/85 backdrop-blur-[6px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-10">
        <Link to="/" className="group flex items-baseline gap-2" aria-label={`${site.name}, back to the drift`}>
          <span className="font-serif text-[22px] leading-none tracking-tight">{site.name}</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors group-hover:text-ink sm:inline">
            ← drift
          </span>
        </Link>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="m-0 flex list-none gap-5 p-0">
            {SECTIONS.map((s) => {
              const active = path === s.path || path.startsWith(s.path + '/');
              return (
                <li key={s.id}>
                  <Link
                    to={s.path}
                    aria-current={active ? 'page' : undefined}
                    className={`font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors ${
                      active ? 'text-ink' : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    <span className="mr-1 text-[9px] opacity-60">{s.numeral}</span>
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <IndexButton className="md:hidden" />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="m-0 font-serif text-[40px] leading-[1.05] tracking-tight sm:text-[52px]">
              Say hi.
            </p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-2">
              The fastest way to reach me is a DM on Instagram
              {site.email ? (
                <>
                  , or email{' '}
                  <a className="link-dw" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
            <span className="mb-1 text-ink-3">Elsewhere</span>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                {s.label} <span className="text-ink-3 normal-case tracking-normal">{s.handle}</span> ↗
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
            <span className="mb-1 text-ink-3">This site</span>
            <Link to="/" className="hover:text-ink">
              ← Back to the drift
            </Link>
            <Link to="/now" className="hover:text-ink">
              Now
            </Link>
            <Link to="/colophon" className="hover:text-ink">
              Colophon
            </Link>
            <Link to="/changelog" className="hover:text-ink">
              Changelog
            </Link>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name} · {site.location}
          </span>
          <span>
            Currently: <span className="normal-case tracking-normal">{NOW.currently}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Big numbered page heading used by every section page */
export function PageHeading({
  section,
  title,
  intro,
  aside,
}: {
  section?: SectionId;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  const s = section ? SECTIONS.find((x) => x.id === section) : undefined;
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-10 sm:pt-20">
      {s && (
        <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
          {s.numeral} · {s.room}
        </p>
      )}
      <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="m-0 font-serif text-[64px] font-normal leading-[0.95] tracking-[-0.02em] sm:text-[104px]">
          {title}
        </h1>
        {aside}
      </div>
      {intro && <div className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{intro}</div>}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only-dw focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
