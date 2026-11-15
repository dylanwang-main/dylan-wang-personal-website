/**
 * The section wheel, clipped at the bottom edge of the screen.
 *
 * - Scroll over it, drag it, swipe it, or use the arrow keys: one gesture = one section.
 * - The section at the top is active. Click it (or press Enter) to open that page.
 * - Click any other label to rotate it to the top.
 * It's drawn in SVG inside the DOM (not WebGL), so text stays crisp and accessible,
 * and a plain <nav> list mirrors it for screen readers.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS } from '../content/site';
import type { SectionId } from '../content/types';
import { Link } from '../router';
import type { DriftConfig } from './config';

interface Props {
  activeSection: SectionId;
  /** The user turned the wheel to a section */
  onSelectSection: (section: SectionId) => void;
  /** The user asked to open the active section */
  onOpenSection: (section: SectionId) => void;
  config: DriftConfig;
  isMobile: boolean;
}

const N = SECTIONS.length;
const SEG = (2 * Math.PI) / N;
const DRAG_THRESHOLD_PX = 6;
const TICKS = 72;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const wrapPi = (rad: number) => Math.atan2(Math.sin(rad), Math.cos(rad));
// Nearest whole-segment index (unbounded, so the wheel never spins the long way round)
const indexForAngle = (rad: number) => Math.round(-rad / SEG);
const sectionIndexForAngle = (rad: number) => mod(indexForAngle(rad), N);
const idxOf = (id: SectionId) => Math.max(0, SECTIONS.findIndex((s) => s.id === id));

export function SectionWheel({ activeSection, onSelectSection, onOpenSection, config, isMobile }: Props) {
  // Rendered angle, spring target (always a whole number of segments), spring velocity
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);

  const isDraggingRef = useRef(false);
  const movedRef = useRef(false);
  const capturedRef = useRef(false);
  const dragStartXYRef = useRef({ x: 0, y: 0 });
  const lastPointerAngleRef = useRef(0);
  const lastPointerTimeRef = useRef(0);

  // Mouse-wheel gesture state (one gesture = one step)
  const gestureRef = useRef({ lastTime: 0, lastAbs: 0, lockUntil: 0, consumed: false });
  const lastSectionIndexRef = useRef(idxOf(activeSection));

  const [displayAngle, setDisplayAngle] = useState(0);
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const latest = useRef({ onSelectSection, onOpenSection, config });
  latest.current = { onSelectSection, onOpenSection, config };

  const pulse = useCallback((idx: number) => {
    setPulsingIndex(idx);
    window.setTimeout(() => setPulsingIndex((curr) => (curr === idx ? null : curr)), 280);
  }, []);

  const commitSection = useCallback(
    (idx: number) => {
      if (lastSectionIndexRef.current === idx) return;
      lastSectionIndexRef.current = idx;
      latest.current.onSelectSection(SECTIONS[idx].id);
      pulse(idx);
    },
    [pulse]
  );

  const stepBy = useCallback(
    (n: number) => {
      const k = indexForAngle(targetRef.current) + n;
      targetRef.current = -k * SEG;
      commitSection(mod(k, N));
    },
    [commitSection]
  );

  const retarget = useCallback((idx: number) => {
    const kCur = indexForAngle(targetRef.current);
    const half = N / 2;
    const diff = mod(idx - kCur + half, N) - half;
    targetRef.current = -(kCur + diff) * SEG;
  }, []);

  const goToSection = useCallback(
    (idx: number) => {
      retarget(idx);
      commitSection(idx);
    },
    [retarget, commitSection]
  );

  // Follow outside changes (scrolling through the rooms turns the wheel too)
  useEffect(() => {
    if (isDraggingRef.current) return;
    const idx = idxOf(activeSection);
    if (sectionIndexForAngle(targetRef.current) !== idx) {
      retarget(idx);
      lastSectionIndexRef.current = idx;
      pulse(idx);
    }
  }, [activeSection, retarget, pulse]);

  // Critically damped spring toward the target, so it settles without bounce
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let shown = angleRef.current;
    const tick = (now: number) => {
      const f = Math.min(3, (now - last) / 16.667);
      last = now;
      if (!isDraggingRef.current) {
        const k = latest.current.config.wheelSnapStrength;
        const damping = 1 / Math.pow(1 + Math.sqrt(k), 2);
        const err = targetRef.current - angleRef.current;
        velocityRef.current += err * k * f;
        velocityRef.current *= Math.pow(damping, f);
        angleRef.current += velocityRef.current * f;
        if (Math.abs(err) < 1e-4 && Math.abs(velocityRef.current) < 1e-4) {
          angleRef.current = targetRef.current;
          velocityRef.current = 0;
        }
      }
      if (Math.abs(angleRef.current - shown) > 1e-5) {
        shown = angleRef.current;
        setDisplayAngle(shown);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Arrow keys step one section, Enter opens the active one
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('input, textarea, select, [role="dialog"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === 'Enter') {
        // Let focused links and buttons do their own thing
        if (el?.closest?.('a, button')) return;
        e.preventDefault();
        latest.current.onOpenSection(SECTIONS[sectionIndexForAngle(targetRef.current)].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepBy]);

  // Scroll / trackpad over the wheel: exactly one section per gesture
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
    const rawY = e.deltaY * unit;
    const rawX = e.deltaX * unit;
    const delta = Math.abs(rawY) >= Math.abs(rawX) ? rawY : rawX;
    const abs = Math.abs(delta);
    const g = gestureRef.current;
    const cfg = latest.current.config;
    // The event's own timestamp, so slow frames can't make one gesture look like several
    const now = e.timeStamp > 0 && e.timeStamp < 1e12 ? e.timeStamp : performance.now();
    const gap = now - g.lastTime;
    const isFresh = gap > 140 || abs > g.lastAbs * 1.35 + 2;
    g.lastTime = now;
    g.lastAbs = abs;
    if (isFresh && now >= g.lockUntil) g.consumed = false;
    if (g.consumed || now < g.lockUntil) return;
    if (abs < 0.016 / cfg.wheelSensitivity) return;
    g.consumed = true;
    g.lockUntil = now + cfg.wheelStepCooldownMs;
    stepBy(delta > 0 ? 1 : -1);
  };

  const pointerAngle = (x: number, y: number) => {
    if (!wheelRef.current) return 0;
    const r = wheelRef.current.getBoundingClientRect();
    return Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    movedRef.current = false;
    capturedRef.current = false;
    dragStartXYRef.current = { x: e.clientX, y: e.clientY };
    lastPointerAngleRef.current = pointerAngle(e.clientX, e.clientY);
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    if (!movedRef.current) {
      if (Math.hypot(e.clientX - dragStartXYRef.current.x, e.clientY - dragStartXYRef.current.y) < DRAG_THRESHOLD_PX) return;
      movedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        capturedRef.current = true;
      } catch {
        /* dragging still works without capture */
      }
    }
    const a = pointerAngle(e.clientX, e.clientY);
    const dA = wrapPi(a - lastPointerAngleRef.current);
    angleRef.current += dA;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    velocityRef.current = velocityRef.current * 0.6 + ((dA / dt) * 16.667) * 0.4;
    lastPointerTimeRef.current = now;
    lastPointerAngleRef.current = a;
    commitSection(sectionIndexForAngle(angleRef.current));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = false;
    if (capturedRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      capturedRef.current = false;
    }
    if (!movedRef.current) return;
    const d = latest.current.config.wheelInertiaDamping;
    const projected = angleRef.current + velocityRef.current * (d / (1 - d));
    const startK = indexForAngle(angleRef.current);
    const k = Math.max(startK - 2, Math.min(startK + 2, indexForAngle(projected)));
    targetRef.current = -k * SEG;
    commitSection(mod(k, N));
  };

  const D = isMobile ? 330 : 560;
  const R = D / 2;
  const inner = R * 0.46;
  const rim = R * 0.79;
  const visibleH = D * config.wheelVisibleFraction;
  const activeIdx = idxOf(activeSection);
  const active = SECTIONS[activeIdx];

  return (
    <>
      {/* Screen-reader and keyboard mirror of the wheel */}
      <nav aria-label="Sections" className="sr-only-dw">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link to={s.path}>
                {s.numeral} {s.label}: {s.blurb}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="sr-only-dw" aria-live="polite">
        {active.label}, section {activeIdx + 1} of {N}. Press Enter to open.
      </p>

      {/* Active section blurb, floating just above the wheel */}
      <div
        className="pointer-events-none absolute left-1/2 z-[6] w-[min(94vw,520px)] -translate-x-1/2 px-10 py-6 text-center"
        style={{
          bottom: visibleH + (isMobile ? 4 : 10),
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(245,244,241,0.94) 35%, rgba(245,244,241,0) 100%)',
        }}
        aria-hidden="true"
      >
        <p key={active.id} className="paper-halo m-0 animate-[dw-fade-up_.45s_ease-out] text-balance font-serif text-[17px] italic leading-snug text-ink-2 sm:text-[19px]">
          {active.blurb}
        </p>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[5] -translate-x-1/2 select-none"
        style={{ width: D, height: visibleH }}
        aria-hidden="true"
      >
        {/* Apex marker */}
        <div className="pointer-events-none absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
          <div className="h-2.5 w-px bg-ink" />
        </div>

        <div
          ref={wheelRef}
          data-no-drift-scroll="true"
          data-cursor="view"
          data-cursor-label="Turn"
          onWheel={handleWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="pointer-events-auto absolute left-0 top-0 touch-none"
          style={{ width: D, height: D, borderRadius: '50%' }}
        >
          <svg
            viewBox={`0 0 ${D} ${D}`}
            className="h-full w-full"
            style={{ transform: `rotate(${displayAngle * (180 / Math.PI)}deg)`, transformOrigin: 'center center' }}
          >
            <circle cx={R} cy={R} r={R - 1.5} fill="#FAF9F6" stroke="#D9D4C8" strokeWidth="1" />
            <circle cx={R} cy={R} r={inner} fill="#F5F4F1" stroke="#D9D4C8" strokeWidth="1" />

            {/* Clock-like ticks around the edge */}
            {Array.from({ length: TICKS }).map((_, i) => {
              const a = (i / TICKS) * Math.PI * 2;
              const major = i % (TICKS / N) === 0;
              const r1 = R - 3;
              const r2 = R - (major ? 15 : 8);
              return (
                <line
                  key={`t${i}`}
                  x1={R + r1 * Math.cos(a)}
                  y1={R + r1 * Math.sin(a)}
                  x2={R + r2 * Math.cos(a)}
                  y2={R + r2 * Math.sin(a)}
                  stroke={major ? '#8A857B' : '#D0CABD'}
                  strokeWidth={major ? 1 : 0.75}
                />
              );
            })}

            {/* Dividers between sections */}
            {Array.from({ length: N }).map((_, i) => {
              const a = i * SEG - Math.PI / 2 + SEG / 2;
              return (
                <line
                  key={`d${i}`}
                  x1={R + inner * Math.cos(a)}
                  y1={R + inner * Math.sin(a)}
                  x2={R + (R - 18) * Math.cos(a)}
                  y2={R + (R - 18) * Math.sin(a)}
                  stroke="#E0DBD0"
                  strokeWidth="1"
                />
              );
            })}

            {SECTIONS.map((s, idx) => {
              const base = idx * SEG - Math.PI / 2;
              const x = R + rim * Math.cos(base);
              const y = R + rim * Math.sin(base);
              const world = mod(displayAngle + idx * SEG, 2 * Math.PI);
              const dist = Math.min(world, 2 * Math.PI - world);
              const isTop = dist < SEG * 0.45;
              const deg = (base * 180) / Math.PI + 90;
              return (
                <g
                  key={s.id}
                  transform={`translate(${x}, ${y}) rotate(${deg})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (movedRef.current) return;
                    if (idx === sectionIndexForAngle(targetRef.current)) latest.current.onOpenSection(s.id);
                    else goToSection(idx);
                  }}
                  style={{ pointerEvents: 'all' }}
                >
                  <rect x={-70} y={-26} width={140} height={52} fill="transparent" />
                  <text
                    textAnchor="middle"
                    y={-7}
                    style={{
                      fontFamily: '"Geist Mono", ui-monospace, monospace',
                      fontSize: isMobile ? 8.5 : 9.5,
                      letterSpacing: '0.18em',
                      fill: '#8A857B',
                      opacity: isTop ? 1 : 0.55,
                    }}
                  >
                    {s.numeral}
                  </text>
                  <text
                    textAnchor="middle"
                    y={isMobile ? 12 : 15}
                    style={{
                      fontFamily: '"Instrument Serif", Georgia, serif',
                      fontSize: isTop ? (isMobile ? 21 : 27) : isMobile ? 16 : 20,
                      fill: isTop ? '#1A1A1A' : '#8A857B',
                      opacity: isTop ? 1 : 0.6,
                      transition: 'font-size .2s, opacity .2s',
                      transform: pulsingIndex === idx ? 'scale(1.12)' : 'scale(1)',
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                    }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* Center: "open" prompt, counter-rotated so it stays upright */}
            <g transform={`rotate(${-displayAngle * (180 / Math.PI)}, ${R}, ${R})`}>
              <text
                x={R}
                y={R - inner + (isMobile ? 26 : 34)}
                textAnchor="middle"
                style={{ fontFamily: '"Geist Mono", ui-monospace, monospace', fontSize: isMobile ? 8.5 : 9.5, letterSpacing: '0.2em', fill: '#8A857B' }}
              >
                {isMobile ? 'TAP TO OPEN' : 'CLICK OR ENTER'}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
