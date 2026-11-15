import { Blocks } from '../components/Blocks';
import { DraftTag, Eyebrow, Tag } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { sectionById } from '../content/site';
import { WORK, workBySlug } from '../content/work';
import { usePageMeta } from '../lib/hooks';
import { Link } from '../router';
import { NotFound } from './NotFound';

const STATUS: Record<string, string> = { ongoing: 'Ongoing', shipped: 'Done', paused: 'Paused' };

export function WorkPage() {
  const s = sectionById('work');
  usePageMeta('Work', s.blurb);
  return (
    <>
      <PageHeading section="work" title="Work" intro={<p className="m-0">{s.blurb} Each one starts with the question it was trying to answer.</p>} />
      <ol className="mx-auto max-w-6xl list-none px-5 sm:px-10">
        {WORK.map((w, i) => (
          <li key={w.slug} className="border-t border-line">
            <Link
              to={`/work/${w.slug}`}
              data-cursor="view"
              data-cursor-label="Read"
              className="group grid gap-6 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12"
            >
              <div className="relative">
                <div
                  className="transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-0 group-hover:scale-[1.02]"
                  style={{ transform: `rotate(${i % 2 ? 1.6 : -1.4}deg)` }}
                >
                  <MediaView media={w.cover} res={560} frame={i + 1} label={w.cover.caption} aspect={1.25} />
                </div>
              </div>
              <div className="flex flex-col">
                <Eyebrow>
                  {String(i + 1).padStart(2, '0')} · {w.role} · {w.when}
                </Eyebrow>
                <h2 className="mb-0 mt-3 font-serif text-[40px] font-normal leading-[1] tracking-tight sm:text-[56px]">
                  {w.title}
                  <DraftTag on={w.draft} />
                </h2>
                <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-2">{w.hook}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  {w.status && (
                    <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink">
                      ● {STATUS[w.status]}
                    </span>
                  )}
                  {w.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                  <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 transition-transform group-hover:translate-x-1">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-6 max-w-6xl border-t border-line px-5 pt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 sm:px-10">
        Looking for a résumé? That lives on my other site. This one is the long version.
      </p>
    </>
  );
}

export function WorkDetail({ slug }: { slug: string }) {
  const w = workBySlug(slug);
  usePageMeta(w ? w.title : 'Not found', w?.hook);
  if (!w) return <NotFound />;
  const idx = WORK.indexOf(w);
  const next = WORK[(idx + 1) % WORK.length];

  return (
    <article>
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-10 sm:pt-14">
        <Link to="/work" className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3 hover:text-ink">
          ← All work
        </Link>
        <Eyebrow className="mt-10">
          01 · Work · {String(idx + 1).padStart(2, '0')}
        </Eyebrow>
        <h1 className="mb-0 mt-3 font-serif text-[56px] font-normal leading-[0.95] tracking-[-0.02em] sm:text-[96px]">
          {w.title}
          <DraftTag on={w.draft} />
        </h1>
        <p className="mt-6 max-w-3xl font-serif text-[24px] italic leading-snug text-ink-2 sm:text-[30px]">{w.hook}</p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-10">
        <MediaView media={w.cover} res={1100} aspect={1.9} frame={idx + 1} showCaption />
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-5 sm:px-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 font-mono text-[11px] uppercase tracking-[0.12em] md:grid-cols-1">
            <div>
              <dt className="text-ink-3">Role</dt>
              <dd className="m-0 mt-1 normal-case tracking-normal text-ink">{w.role}</dd>
            </div>
            <div>
              <dt className="text-ink-3">When</dt>
              <dd className="m-0 mt-1 normal-case tracking-normal text-ink">{w.when}</dd>
            </div>
            {w.status && (
              <div>
                <dt className="text-ink-3">Status</dt>
                <dd className="m-0 mt-1 normal-case tracking-normal text-ink">{STATUS[w.status]}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink-3">Tags</dt>
              <dd className="m-0 mt-1 flex flex-wrap gap-1.5">
                {w.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </dd>
            </div>
            {w.links?.length ? (
              <div>
                <dt className="text-ink-3">Links</dt>
                <dd className="m-0 mt-1 flex flex-col gap-1 normal-case tracking-normal">
                  {w.links.map((l) => (
                    <Link key={l.href} to={l.href} className="link-dw text-ink">
                      {l.label} ↗
                    </Link>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
        <div className="max-w-2xl">
          <Blocks blocks={w.body} />
        </div>
      </div>

      <NextUp to={`/work/${next.slug}`} eyebrow="Next in work" title={next.title} />
    </article>
  );
}

export function NextUp({ to, eyebrow, title }: { to: string; eyebrow: string; title: string }) {
  return (
    <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-10">
      <Link to={to} className="group block border-t border-line pt-6" data-cursor="view" data-cursor-label="Next">
        <Eyebrow>{eyebrow}</Eyebrow>
        <p className="m-0 mt-2 font-serif text-[40px] leading-none tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-[64px]">
          {title} →
        </p>
      </Link>
    </div>
  );
}
