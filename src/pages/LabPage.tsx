import { useState } from 'react';
import { DraftTag, Eyebrow, StageBadge, Tag } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { LAB, STAGE_LABEL } from '../content/lab';
import { sectionById } from '../content/site';
import type { Stage } from '../content/types';
import { formatDate, usePageMeta } from '../lib/hooks';
import { Link } from '../router';

const STAGE_HELP: Record<Stage, string> = {
  seedling: 'just an idea or a first sketch',
  growing: 'actively working on it',
  evergreen: 'done enough that I use it every day',
  paused: 'parked, might come back',
};

export function LabPage() {
  const s = sectionById('lab');
  usePageMeta('Lab', s.blurb);
  const [stage, setStage] = useState<Stage | 'all'>('all');
  const stages = Array.from(new Set(LAB.map((l) => l.stage)));
  const items = stage === 'all' ? LAB : LAB.filter((l) => l.stage === stage);

  return (
    <>
      <PageHeading
        section="lab"
        title="Lab"
        intro={
          <p className="m-0">
            {s.blurb} Everything here has a growth stage, so you know how seriously to take it.
          </p>
        }
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <div className="grid gap-3 border-y border-line py-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <dl className="m-0 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-2">
            {(Object.keys(STAGE_HELP) as Stage[]).map((k) => (
              <div key={k} className="flex items-center gap-2">
                <dt>
                  <StageBadge stage={k} />
                </dt>
                <dd className="m-0">{STAGE_HELP[k]}</dd>
              </div>
            ))}
          </dl>
          <div role="tablist" aria-label="Filter by stage" className="flex flex-wrap gap-1.5">
            {(['all', ...stages] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={stage === k}
                onClick={() => setStage(k)}
                className={`rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                  stage === k ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2'
                }`}
              >
                {k === 'all' ? 'All' : STAGE_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        <ol className="m-0 mt-4 list-none p-0">
          {items.map((l) => (
            <li key={l.slug} id={l.slug} className="scroll-mt-24 border-b border-line py-10">
              <div className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)_minmax(0,0.9fr)] md:gap-10">
                <div className="max-w-[200px]">
                  <div style={{ transform: `rotate(${(LAB.indexOf(l) % 2 ? 1 : -1) * 1.8}deg)` }}>
                    <MediaView media={l.cover} res={360} frame={LAB.indexOf(l) + 1} />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StageBadge stage={l.stage} />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                      Started {formatDate(l.started)} · Updated {formatDate(l.updated)}
                    </span>
                  </div>
                  <h2 className="mb-0 mt-3 font-serif text-[38px] font-normal leading-[1] tracking-tight sm:text-[46px]">
                    {l.title}
                    <DraftTag on={l.draft} />
                  </h2>
                  <p className="mt-3 text-[16.5px] leading-relaxed text-ink-2">{l.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {l.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  {l.links?.length ? (
                    <div className="mt-4 flex gap-4">
                      {l.links.map((lk) => (
                        <Link key={lk.href} to={lk.href} className="link-dw font-mono text-[11px] uppercase tracking-[0.12em]">
                          {lk.label} →
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div>
                  <Eyebrow>Log</Eyebrow>
                  <ol className="m-0 mt-3 list-none space-y-3 border-l border-line p-0 pl-4">
                    {l.notes.map((n, i) => (
                      <li key={i} className="relative text-[14.5px] leading-relaxed text-ink">
                        <span className="absolute -left-[21px] top-[9px] h-[9px] w-[9px] rounded-full border border-ink bg-paper" />
                        {n.startsWith('Fill in') ? <span className="draft-copy">{n}</span> : n}
                      </li>
                    ))}
                  </ol>
                  {l.next && (
                    <p className="mt-5 rounded-[3px] bg-paper-2 px-3 py-2 text-[13.5px] text-ink-2">
                      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Next</span>
                      {l.next}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
