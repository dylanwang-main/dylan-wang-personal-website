/**
 * Live sliders for the drift. Shows when running locally or with ?tune in the URL.
 * Dial it in, hit "Copy settings", paste the JSON into drift/config.ts.
 */
import { useState } from 'react';
import { DRIFT_CONFIG, DriftConfig } from './config';

type Key = keyof DriftConfig;
const SLIDERS: { key: Key; label: string; min: number; max: number; step: number }[] = [
  { key: 'scrollSensitivity', label: 'Scroll speed', min: 0.004, max: 0.04, step: 0.001 },
  { key: 'scrollDamping', label: 'Scroll catch-up', min: 1, max: 8, step: 0.1 },
  { key: 'bandSpacing', label: 'Room spacing', min: 10, max: 28, step: 0.5 },
  { key: 'spreadX', label: 'Spread X', min: 4, max: 12, step: 0.1 },
  { key: 'spreadY', label: 'Spread Y', min: 2, max: 6, step: 0.1 },
  { key: 'parallaxX', label: 'Parallax', min: 0, max: 4, step: 0.1 },
  { key: 'idleSpeed', label: 'Idle drift', min: 0, max: 2.5, step: 0.05 },
  { key: 'tiltVariance', label: 'Tilt', min: 0, max: 2, step: 0.05 },
  { key: 'cardBaseWidth', label: 'Card size', min: 2, max: 4.5, step: 0.05 },
  { key: 'inactiveOpacity', label: 'Other rooms', min: 0.1, max: 1, step: 0.05 },
  { key: 'hoverScale', label: 'Hover scale', min: 1, max: 1.25, step: 0.01 },
  { key: 'wheelStepCooldownMs', label: 'Wheel cooldown', min: 150, max: 800, step: 10 },
];

export function FeelTuner({ config, onChange }: { config: DriftConfig; onChange: (c: DriftConfig) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="absolute bottom-20 left-4 z-30 sm:left-9" data-no-drift-scroll="true">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2 hover:text-ink"
      >
        {open ? 'Close tuner' : 'Feel tuner'}
      </button>
      {open && (
        <div className="mt-2 max-h-[60vh] w-[300px] overflow-y-auto rounded-[4px] border border-line bg-paper/95 p-4 shadow-xl">
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(config, null, 2)).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="rounded bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper"
            >
              {copied ? 'Copied' : 'Copy settings'}
            </button>
            <button
              onClick={() => onChange(DRIFT_CONFIG)}
              className="rounded border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {SLIDERS.map((s) => (
              <label key={s.key} className="block">
                <span className="flex justify-between font-mono text-[10.5px] text-ink-2">
                  <span>{s.label}</span>
                  <span className="text-ink">{Number(config[s.key]).toFixed(s.step < 0.01 ? 3 : 2)}</span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={config[s.key] as number}
                  onChange={(e) => onChange({ ...config, [s.key]: parseFloat(e.target.value) })}
                  className="w-full accent-ink"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
