/** Renders long-form entry bodies (paragraphs, headings, lists, media rows). */
import type { Block } from '../content/types';
import { Draft } from './bits';
import { MediaView } from './MediaView';

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-dw text-[16.5px] text-ink sm:text-[17.5px]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return (
              <p key={i}>
                <Draft on={b.draft}>{b.text}</Draft>
              </p>
            );
          case 'h':
            return (
              <h2 key={i} className="mb-3 mt-10 font-serif text-[28px] font-normal leading-tight tracking-tight sm:text-[32px]">
                {b.text}
              </h2>
            );
          case 'quote':
            return (
              <blockquote key={i} className="my-8 border-l border-ink pl-5">
                <p className="font-serif text-[26px] italic leading-snug sm:text-[30px]">
                  <Draft on>{b.text}</Draft>
                </p>
                {b.cite && (
                  <cite className="font-mono text-[10.5px] not-italic uppercase tracking-[0.14em] text-ink-3">
                    {b.cite}
                  </cite>
                )}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={i} className="my-4 list-none space-y-2 p-0">
                {b.items.map((item, j) => (
                  <li key={j} className="grid grid-cols-[1.4rem_1fr] leading-relaxed">
                    <span className="font-mono text-[11px] leading-[1.9] text-ink-3">{String(j + 1).padStart(2, '0')}</span>
                    <span>
                      <Draft on={b.draft}>{item}</Draft>
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'media':
            return (
              <div
                key={i}
                className={`my-10 grid gap-4 ${b.media.length === 1 ? '' : b.media.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}
              >
                {b.media.map((m, j) => (
                  <MediaView key={j} media={m} res={640} showCaption />
                ))}
              </div>
            );
          case 'note':
            return (
              <p key={i} className="my-6 rounded-[3px] bg-paper-2 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-2">
                {b.text}
              </p>
            );
        }
      })}
    </div>
  );
}
