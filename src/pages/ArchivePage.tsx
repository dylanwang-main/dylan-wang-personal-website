import { useEffect, useMemo, useRef, useState } from 'react';
import { Draft, Eyebrow, SplitFlap } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { ARCHIVE, STATUS_LABEL, numberedArchive } from '../content/archive';
import { sectionById } from '../content/site';
import type { ArchiveCategory, ArchiveStatus, Media } from '../content/types';
import { useIsTouch, usePageMeta } from '../lib/hooks';

const catMedia = (c: ArchiveCategory): Media => ({
  alt: `Placeholder art for ${c.title}`,
  motif: c.motif,
  inks: c.inks,
  aspect: 0.8,
});

const STATUS_STYLE: Record<ArchiveStatus, string> = {
  using: 'text-moss',
  retired: 'text-ink-3',
  want: 'text-rust',
};

export function ArchivePage() {
  const s = sectionById('archive');
  usePageMeta('Archive', s.blurb);
  const all = useMemo(() => numberedArchive(), []);
  const [status, setStatus] = useState<ArchiveStatus | 'all'>('all');
  const isTouch = useIsTouch();

  // Hover preview that follows the cursor (desktop only)
  const [hoverCat, setHoverCat] = useState<ArchiveCategory | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isTouch) return;
    const move = (e: PointerEvent) => {
      if (previewRef.current) previewRef.current.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 90}px, 0) rotate(-3deg)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [isTouch]);

  const counts = {
    using: all.filter((x) => x.item.status === 'using').length,
    retired: all.filter((x) => x.item.status === 'retired').length,
    want: all.filter((x) => x.item.status === 'want').length,
  };

  return (
    <>
      <PageHeading
        section="archive"
        title="Archive"
        aside={<SplitFlap value={all.length} label="things on the shelf" />}
        intro={
          <p className="m-0">
            {s.blurb} Numbered so I can point at them. Retired stuff stays on the list, because what you stopped using says
            as much as what you use.
          </p>
        }
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <nav aria-label="Categories" className="border-y border-line py-3">
          <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 font-mono text-[10.5px] uppercase tracking-[0.14em]">
            {ARCHIVE.map((c, i) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="text-ink-2 hover:text-ink">
                  <span className="text-ink-3">{String(i + 1).padStart(2, '0')}</span> {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div role="tablist" aria-label="Filter by status" className="mt-4 flex flex-wrap gap-1.5">
          {(['all', 'using', 'retired', 'want'] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={status === k}
              onClick={() => setStatus(k)}
              className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                status === k ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2'
              }`}
            >
              {k === 'all' ? `All · ${all.length}` : `${STATUS_LABEL[k]} · ${counts[k]}`}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {ARCHIVE.map((c, ci) => {
            const rows = all.filter((x) => x.category === c && (status === 'all' || x.item.status === status));
            if (!rows.length) return null;
            return (
              <section key={c.slug} id={c.slug} aria-labelledby={`h-${c.slug}`} className="scroll-mt-24 pt-12">
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_120px] md:items-end">
                  <div>
                    <Eyebrow>{String(ci + 1).padStart(2, '0')} · Category</Eyebrow>
                    <h2 id={`h-${c.slug}`} className="m-0 mt-2 font-serif text-[44px] font-normal leading-none tracking-tight sm:text-[56px]">
                      {c.title}
                    </h2>
                    <p className="mt-2 max-w-md text-[15px] text-ink-2">{c.blurb}</p>
                  </div>
                  <div className="hidden w-[120px] md:block" style={{ transform: `rotate(${ci % 2 ? 3 : -3}deg)` }}>
                    <MediaView media={catMedia(c)} res={240} frame={ci + 1} />
                  </div>
                </div>
                <ol className="m-0 mt-6 list-none border-t border-ink p-0">
                  {rows.map(({ code, item }) => (
                    <li
                      key={code}
                      onPointerEnter={() => setHoverCat(c)}
                      onPointerLeave={() => setHoverCat(null)}
                      className="group grid grid-cols-[3.2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-line py-3.5 transition-colors hover:bg-paper-2/60 sm:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1.6fr)_6rem]"
                    >
                      <span className="font-mono text-[12px] tracking-[0.06em] text-ink-3">{code}</span>
                      <span className="text-[16px] font-medium text-ink">
                        {item.link ? (
                          <a className="link-dw" href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                        ) : (
                          <Draft on={item.draft}>{item.name}</Draft>
                        )}
                        {item.since && <span className="ml-2 font-mono text-[10px] text-ink-3">since {item.since}</span>}
                      </span>
                      <span className="col-span-2 col-start-2 row-start-2 text-[14.5px] text-ink-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
                        <Draft on={item.draft}>{item.oneLiner}</Draft>
                      </span>
                      <span
                        className={`col-start-3 row-start-1 text-right font-mono text-[10.5px] uppercase tracking-[0.14em] sm:col-start-4 ${STATUS_STYLE[item.status]}`}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </div>

      {!isTouch && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 w-[150px] shadow-[0_20px_40px_-22px_rgba(40,30,20,0.6)] transition-opacity duration-200"
          style={{ opacity: hoverCat ? 1 : 0 }}
        >
          {hoverCat && <MediaView media={catMedia(hoverCat)} res={300} />}
        </div>
      )}
    </>
  );
}
