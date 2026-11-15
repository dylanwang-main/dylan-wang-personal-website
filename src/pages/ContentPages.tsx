import { useMemo, useState } from 'react';
import { Blocks } from '../components/Blocks';
import { DraftTag, Eyebrow, Tag } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { CONTENT, CONTENT_KIND_LABEL, contentBySlug } from '../content/content';
import { sectionById, site } from '../content/site';
import type { ContentItem } from '../content/types';
import { usePageMeta } from '../lib/hooks';
import { Link } from '../router';
import { NotFound } from './NotFound';
import { NextUp } from './WorkPages';

const PLATFORM: Record<ContentItem['platform'], string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  multi: 'Instagram + TikTok',
};

const TILTS = [-2.2, 1.6, -0.8, 2.4, -1.8, 1.1];

export function ContentPage() {
  const s = sectionById('content');
  usePageMeta('Content', s.blurb);
  const kinds = useMemo(() => Array.from(new Set(CONTENT.map((c) => c.kind))), []);
  const [kind, setKind] = useState<ContentItem['kind'] | 'all'>('all');
  const items = kind === 'all' ? CONTENT : CONTENT.filter((c) => c.kind === kind);

  return (
    <>
      <PageHeading
        section="content"
        title="Content"
        intro={
          <p className="m-0">
            {s.blurb} Everything lives on{' '}
            <a className="link-dw" href={site.socials[0].href} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>{' '}
            first. This is the director's cut, with notes.
          </p>
        }
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div role="tablist" aria-label="Filter by kind" className="flex flex-wrap gap-2 border-y border-line py-3">
          {(['all', ...kinds] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                kind === k ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2'
              }`}
            >
              {k === 'all' ? `All · ${CONTENT.length}` : CONTENT_KIND_LABEL[k]}
            </button>
          ))}
        </div>

        <ul className="m-0 mt-12 grid list-none gap-x-10 gap-y-16 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <li key={c.slug} className={i % 3 === 1 ? 'lg:translate-y-14' : ''}>
              <Link to={`/content/${c.slug}`} className="group block" data-cursor="view" data-cursor-label="Watch">
                <div
                  className="shadow-[0_18px_40px_-28px_rgba(40,30,20,0.55)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-0 group-hover:scale-[1.025]"
                  style={{ transform: `rotate(${TILTS[CONTENT.indexOf(c) % TILTS.length]}deg)` }}
                >
                  <MediaView media={c.cover} res={520} frame={CONTENT.indexOf(c) + 1} label={c.cover.caption} />
                </div>
                <div className="mt-5">
                  <Eyebrow>
                    {CONTENT_KIND_LABEL[c.kind]} · {c.when}
                  </Eyebrow>
                  <h2 className="m-0 mt-2 font-serif text-[30px] font-normal leading-[1.05] tracking-tight">
                    {c.title}
                    <DraftTag on={c.draft} />
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{c.summary}</p>
                  <p className="m-0 mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                    About: <span className="text-ink-2">{c.theme}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function ContentDetail({ slug }: { slug: string }) {
  const c = contentBySlug(slug);
  usePageMeta(c ? c.title : 'Not found', c?.summary);
  if (!c) return <NotFound />;
  const idx = CONTENT.indexOf(c);
  const next = CONTENT[(idx + 1) % CONTENT.length];

  return (
    <article>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 sm:px-10 sm:pt-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
        <div>
          <Link to="/content" className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 hover:text-ink">
            ← All content
          </Link>
          <div className="mt-10 md:sticky md:top-24">
            <div style={{ transform: `rotate(${TILTS[idx % TILTS.length] * 0.6}deg)` }} className="shadow-[0_24px_50px_-30px_rgba(40,30,20,0.6)]">
              <MediaView media={c.cover} res={760} frame={idx + 1} label={c.cover.caption} />
            </div>
            {c.cover.caption && (
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">{c.cover.caption}</p>
            )}
          </div>
        </div>
        <div className="md:pt-16">
          <Eyebrow>
            02 · {CONTENT_KIND_LABEL[c.kind]} · {c.when}
          </Eyebrow>
          <h1 className="mb-0 mt-3 font-serif text-[52px] font-normal leading-[0.95] tracking-[-0.02em] sm:text-[80px]">
            {c.title}
            <DraftTag on={c.draft} />
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink-2">{c.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Tag>{PLATFORM[c.platform]}</Tag>
            <Tag>{c.theme}</Tag>
          </div>
          {c.links?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {c.links.map((l) => (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ink px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-80"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          ) : null}
          <div className="mt-10 border-t border-line pt-8">
            <Blocks blocks={c.body} />
          </div>
        </div>
      </div>
      <NextUp to={`/content/${next.slug}`} eyebrow="Next in content" title={next.title} />
    </article>
  );
}
