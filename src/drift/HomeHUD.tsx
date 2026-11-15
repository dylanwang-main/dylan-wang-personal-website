/** The corners of the home page: tagline, name, links, and the quiet footer lines. */
import { useState } from 'react';
import { IndexButton } from '../components/IndexMenu';
import { NOW } from '../content/now';
import { site } from '../content/site';
import { Link } from '../router';

function pickTagline() {
  try {
    const saved = sessionStorage.getItem('dw-tagline');
    if (saved !== null && site.taglines[Number(saved)]) return site.taglines[Number(saved)];
    const i = Math.floor(Math.random() * site.taglines.length);
    sessionStorage.setItem('dw-tagline', String(i));
    return site.taglines[i];
  } catch {
    return site.taglines[0];
  }
}

export function HomeHUD({ showHint, isTouch }: { showHint: boolean; isTouch: boolean }) {
  const [tagline] = useState(pickTagline);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* Top left: rotated tagline */}
      <p
        className="paper-halo pointer-events-auto absolute left-5 top-5 m-0 origin-top-left whitespace-pre-line font-serif text-[17px] italic leading-[1.05] text-ink transition-transform duration-300 hover:rotate-0 sm:left-9 sm:top-8 sm:text-[21px]"
        style={{ transform: 'rotate(-4deg)' }}
      >
        {tagline}
      </p>

      {/* Top center: name */}
      <div className="absolute left-1/2 top-5 -translate-x-1/2 text-center sm:top-7">
        <h1 className="pointer-events-auto m-0 font-serif text-[26px] font-normal leading-none tracking-[-0.01em] sm:text-[34px]">
          <Link to="/about" aria-label="About Dylan Wang">
            {site.name}
          </Link>
        </h1>
      </div>

      {/* Top right: index + socials */}
      <div className="pointer-events-auto absolute right-5 top-5 flex flex-col items-end gap-[5px] sm:right-9 sm:top-8">
        <IndexButton />
        <span className="hidden flex-col items-end gap-[5px] sm:flex">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-ink-3"
            >
              {s.label}
            </a>
          ))}
          {site.email && (
            <a href={`mailto:${site.email}`} className="font-mono text-[10.5px] uppercase tracking-[0.18em] hover:text-ink-3">
              Email
            </a>
          )}
        </span>
      </div>

      {/* Center hint, fades after the first interaction */}
      <p
        className="paper-halo absolute left-1/2 top-[44%] m-0 w-[90vw] -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3 transition-opacity duration-700"
        style={{ opacity: showHint ? 0.85 : 0 }}
        aria-hidden="true"
      >
        {isTouch ? 'Swipe to drift · Turn the wheel' : 'Scroll to drift · Turn the wheel · Press / for the index'}
      </p>

      {/* Bottom corners */}
      <p className="pointer-events-auto absolute bottom-4 left-5 m-0 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 sm:bottom-7 sm:left-9 md:block">
        © {new Date().getFullYear()} {site.name}
        <br />
        <span className="text-ink-3">{site.location}</span>
      </p>
      <Link
        to="/now"
        className="pointer-events-auto absolute bottom-4 right-5 hidden max-w-[260px] text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-ink sm:bottom-7 sm:right-9 md:block"
      >
        <span className="mr-1 inline-block h-[6px] w-[6px] animate-pulse rounded-full bg-rust align-middle" /> Now
        <br />
        <span className="normal-case tracking-normal text-ink-3">{NOW.currently}</span>
      </Link>
    </div>
  );
}
