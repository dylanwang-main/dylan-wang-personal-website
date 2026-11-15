/**
 * The calm version of the home page, for people who've asked their device for
 * reduced motion. Same cards, same sections, laid out as a still, tilted grid.
 */
import { MediaView } from '../components/MediaView';
import { NOW } from '../content/now';
import { SECTIONS, site } from '../content/site';
import { Link } from '../router';
import type { DriftCard } from './cards';

const TILTS = [-2, 1.4, -0.8, 2.2, -1.6, 0.9, -2.4, 1.8];

export function ReducedMotionGrid({ cards }: { cards: DriftCard[] }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-10">
      <p className="m-0 max-w-xl font-serif text-[28px] leading-snug sm:text-[36px]">{site.oneLiner}</p>
      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Currently: {NOW.currently}</p>

      {SECTIONS.map((s) => {
        const group = cards.filter((c) => c.section === s.id);
        return (
          <section key={s.id} aria-labelledby={`still-${s.id}`} className="mt-20">
            <div className="flex items-end justify-between border-b border-line pb-3">
              <h2 id={`still-${s.id}`} className="m-0 font-serif text-[40px] font-normal leading-none">
                <span className="mr-3 align-middle font-mono text-[11px] tracking-[0.14em] text-ink-3">{s.numeral}</span>
                {s.label}
              </h2>
              <Link to={s.path} className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2 hover:text-ink">
                Open →
              </Link>
            </div>
            <p className="mt-3 text-[15px] text-ink-2">{s.blurb}</p>
            <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {group.map((c, i) => (
                <li key={c.id} style={{ transform: `rotate(${TILTS[(c.frame + i) % TILTS.length]}deg)` }}>
                  <Link to={c.href} className="block" data-cursor="view" data-cursor-label="Open">
                    <MediaView media={{ ...c.media, animated: false }} res={360} frame={c.frame} />
                    <p className="m-0 mt-2 text-[14px]">{c.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
