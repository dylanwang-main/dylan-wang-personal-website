/**
 * Small shared pieces: draft markers, tags, stage badges, the split-flap counter.
 */
import { ReactNode, useEffect, useState } from 'react';
import { site } from '../content/site';
import type { Stage } from '../content/types';
import { STAGE_GLYPH, STAGE_LABEL } from '../content/lab';
import { useReducedMotion } from '../lib/hooks';

/** Wraps copy that still needs Dylan's own words */
export function Draft({ on, children }: { on?: boolean; children: ReactNode }) {
  if (!on || !site.showDraftMarkers) return <>{children}</>;
  return (
    <span className="draft-copy" title="Draft: rewrite this in your own words (content files, draft: true)">
      {children}
    </span>
  );
}

export function DraftTag({ on }: { on?: boolean }) {
  if (!on || !site.showDraftMarkers) return null;
  return (
    <span
      className="ml-2 inline-block translate-y-[-1px] rounded-full border border-rust/50 px-1.5 py-[1px] align-middle font-mono text-[9px] uppercase tracking-[0.14em] text-rust"
      title="Draft: rewrite this in your own words"
    >
      draft
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2">
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3 ${className}`}>{children}</p>
  );
}

const STAGE_COLOR: Record<Stage, string> = {
  seedling: 'text-ochre border-ochre/50',
  growing: 'text-moss border-moss/50',
  evergreen: 'text-sky border-sky/50',
  paused: 'text-ink-3 border-line',
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.12em] ${STAGE_COLOR[stage]}`}
    >
      <span aria-hidden="true">{STAGE_GLYPH[stage]}</span>
      {STAGE_LABEL[stage]}
    </span>
  );
}

/**
 * Split-flap counter. Each digit flips through a few values before landing,
 * staggered left to right, like an old departures board.
 */
export function SplitFlap({ value, digits = 3, label }: { value: number; digits?: number; label?: string }) {
  const target = String(value).padStart(digits, '0');
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? target : '0'.repeat(digits));

  useEffect(() => {
    if (reduced) {
      setShown(target);
      return;
    }
    let frame = 0;
    const total = 14 + digits * 5;
    const id = window.setInterval(() => {
      frame += 1;
      setShown(
        target
          .split('')
          .map((d, i) => (frame >= 14 + i * 5 ? d : String((Number(d) + frame + i * 3) % 10)))
          .join('')
      );
      if (frame >= total) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [target, digits, reduced]);

  return (
    <span className="inline-flex items-center gap-3" aria-label={`${value}${label ? ' ' + label : ''}`}>
      <span className="inline-flex gap-[3px]" aria-hidden="true">
        {shown.split('').map((d, i) => (
          <span
            key={i}
            className="relative inline-flex h-[1.5em] w-[1.05em] items-center justify-center overflow-hidden rounded-[3px] bg-ink font-mono text-paper"
          >
            {d}
            <span className="absolute inset-x-0 top-1/2 h-px bg-paper/25" />
          </span>
        ))}
      </span>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2" aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}
