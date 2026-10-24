/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { DRIFT_CONFIG, SECTIONS, SectionName } from '../config';

interface SectionWheelProps {
  activeSection: SectionName;
  onSelectSection: (section: SectionName) => void;
  onOpenSectionDetail: (section: SectionName) => void;
  config: typeof DRIFT_CONFIG;
  isMobile: boolean;
}

const SEGMENT_COUNT = SECTIONS.length;
const SEGMENT_ANGLE = (2 * Math.PI) / SEGMENT_COUNT;
const DRAG_THRESHOLD_PX = 6;

const mod = (n: number, m: number) => ((n % m) + m) % m;
// Wrap an angle difference into (-PI, PI]
const wrapPi = (rad: number) => Math.atan2(Math.sin(rad), Math.cos(rad));
// Nearest whole-segment index (unbounded, so the wheel never spins the long way round)
const indexForAngle = (rad: number) => Math.round(-rad / SEGMENT_ANGLE);
const sectionIndexForAngle = (rad: number) => mod(indexForAngle(rad), SEGMENT_COUNT);

export function SectionWheel({
  activeSection,
  onSelectSection,
  onOpenSectionDetail,
  config,
  isMobile,
}: SectionWheelProps) {
  // Rendered angle, spring target (always a whole number of segments), spring velocity
  const angleRef = useRef<number>(0);
  const targetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // Pointer drag state
  const isDraggingRef = useRef<boolean>(false);
  const movedRef = useRef<boolean>(false);
  const capturedRef = useRef<boolean>(false);
  const dragStartXYRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerAngleRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);

  // Mouse-wheel gesture state (one gesture = one step)
  const gestureRef = useRef({ lastTime: 0, lastAbs: 0, lockUntil: 0, consumed: false });

  // Last section we reported upward, to avoid duplicate onSelectSection calls
  const lastSectionIndexRef = useRef<number>(Math.max(0, SECTIONS.indexOf(activeSection)));

  const [displayAngle, setDisplayAngle] = useState(0);
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);

  const wheelRef = useRef<HTMLDivElement>(null);

  // Always-fresh props for long-lived handlers
  const latest = useRef({ onSelectSection, onOpenSectionDetail, config });
  latest.current = { onSelectSection, onOpenSectionDetail, config };

  const pulse = useCallback((idx: number) => {
    setPulsingIndex(idx);
    window.setTimeout(() => setPulsingIndex((curr) => (curr === idx ? null : curr)), 280);
  }, []);

  // Report a new top section upward (and pulse its label) once per change
  const commitSection = useCallback(
    (idx: number) => {
      if (lastSectionIndexRef.current === idx) return;
      lastSectionIndexRef.current = idx;
      latest.current.onSelectSection(SECTIONS[idx]);
      pulse(idx);
    },
    [pulse]
  );

  // Move the spring target by whole segments (+1 = next section)
  const stepBy = useCallback(
    (n: number) => {
      const k = indexForAngle(targetRef.current) + n;
      targetRef.current = -k * SEGMENT_ANGLE;
      commitSection(mod(k, SEGMENT_COUNT));
    },
    [commitSection]
  );

  // Aim the spring at a given section by the shortest route
  const retarget = useCallback((idx: number) => {
    const kCur = indexForAngle(targetRef.current);
    const half = SEGMENT_COUNT / 2;
    const diff = mod(idx - kCur + half, SEGMENT_COUNT) - half;
    targetRef.current = -(kCur + diff) * SEGMENT_ANGLE;
  }, []);

  const goToSection = useCallback(
    (idx: number) => {
      retarget(idx);
      commitSection(idx);
    },
    [retarget, commitSection]
  );

  // Follow external changes to the active section (e.g. other UI selecting a section)
  useEffect(() => {
    if (isDraggingRef.current) return;
    const idx = SECTIONS.indexOf(activeSection);
    if (idx === -1) return;
    if (sectionIndexForAngle(targetRef.current) !== idx) {
      retarget(idx);
      lastSectionIndexRef.current = idx;
    }
  }, [activeSection, retarget]);

  // Spring animation toward the target. Critically damped, so it settles on a section without bounce.
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

  // Arrow keys step one section at a time, Enter opens the active section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        latest.current.onOpenSectionDetail(SECTIONS[sectionIndexForAngle(targetRef.current)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepBy]);

  // Mouse wheel / trackpad over the wheel: exactly one section per gesture.
  // Trackpad momentum and fast mouse spins are swallowed until the gesture ends.
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();

    const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
    const rawY = e.deltaY * unit;
    const rawX = e.deltaX * unit;
    const delta = Math.abs(rawY) >= Math.abs(rawX) ? rawY : rawX;
    const abs = Math.abs(delta);

    const g = gestureRef.current;
    const cfg = latest.current.config;
    // Use the event's own timestamp so a busy main thread (slow frames) can't make one
    // gesture look like several. Fall back to the clock if the browser uses epoch time.
    const now = e.timeStamp > 0 && e.timeStamp < 1e12 ? e.timeStamp : performance.now();

    // A new gesture starts after a pause, or when the scroll speed jumps back up
    const gap = now - g.lastTime;
    const isFresh = gap > 140 || abs > g.lastAbs * 1.35 + 2;
    g.lastTime = now;
    g.lastAbs = abs;

    if (isFresh && now >= g.lockUntil) g.consumed = false;
    if (g.consumed || now < g.lockUntil) return;

    // Higher wheelSensitivity = smaller flick needed
    const minDelta = 0.016 / cfg.wheelSensitivity;
    if (abs < minDelta) return;

    g.consumed = true;
    g.lockUntil = now + cfg.wheelStepCooldownMs;
    stepBy(delta > 0 ? 1 : -1);
  };

  // Pointer drag (mouse and touch). Pointer capture only starts after a real drag,
  // so plain clicks on labels still work.
  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    movedRef.current = false;
    capturedRef.current = false;
    dragStartXYRef.current = { x: e.clientX, y: e.clientY };
    lastPointerAngleRef.current = getPointerAngle(e.clientX, e.clientY);
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    if (!movedRef.current) {
      const dx = e.clientX - dragStartXYRef.current.x;
      const dy = e.clientY - dragStartXYRef.current.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      movedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        capturedRef.current = true;
      } catch {
        // Capture is a nicety, dragging still works without it
      }
    }

    const pointerAngle = getPointerAngle(e.clientX, e.clientY);
    const dAngle = wrapPi(pointerAngle - lastPointerAngleRef.current);
    angleRef.current += dAngle;

    // Smoothed drag velocity (rad per frame) for the release fling
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    velocityRef.current = velocityRef.current * 0.6 + ((dAngle / dt) * 16.667) * 0.4;
    lastPointerTimeRef.current = now;
    lastPointerAngleRef.current = pointerAngle;

    commitSection(sectionIndexForAngle(angleRef.current));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = false;

    if (capturedRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if capture was already lost
      }
      capturedRef.current = false;
    }

    // Plain click: leave the target alone, the label's onClick handles it
    if (!movedRef.current) return;

    // Fling: project forward a little, then settle on a whole section (max 2 segments away)
    const d = latest.current.config.wheelInertiaDamping;
    const projected = angleRef.current + velocityRef.current * (d / (1 - d));
    const startK = indexForAngle(angleRef.current);
    const k = Math.max(startK - 2, Math.min(startK + 2, indexForAngle(projected)));
    targetRef.current = -k * SEGMENT_ANGLE;
    commitSection(mod(k, SEGMENT_COUNT));
  };

  // Dimensions: the wheel is a full circle whose lower part is clipped by the viewport bottom edge
  const wheelDiameter = isMobile ? 320 : 540;
  const radius = wheelDiameter / 2;
  const innerRadius = radius * 0.44;
  const rimRadius = radius * 0.78;
  const visibleHeight = wheelDiameter * config.wheelVisibleFraction;

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-[5]"
      style={{
        width: `${wheelDiameter}px`,
        height: `${visibleHeight}px`,
        overflow: 'visible',
      }}
    >
      {/* Subtle indicator dot at the top apex */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mb-1" />
        <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
          ACTIVE
        </span>
      </div>

      {/* Circular hit area, anchored by its top edge so everything below the viewport is clipped */}
      <div
        ref={wheelRef}
        data-no-drift-scroll="true"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute left-0 top-0 pointer-events-auto touch-none"
        style={{
          width: `${wheelDiameter}px`,
          height: `${wheelDiameter}px`,
          borderRadius: '50%',
        }}
      >
        <svg
          viewBox={`0 0 ${wheelDiameter} ${wheelDiameter}`}
          className="w-full h-full"
          style={{
            transform: `rotate(${displayAngle * (180 / Math.PI)}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Wheel Background Disc */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - 2}
            fill="#FAF9F6"
            stroke="#D8D6CE"
            strokeWidth="1"
          />

          {/* Hollow Center Circle */}
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="#F5F4F1"
            stroke="#D8D6CE"
            strokeWidth="1"
          />

          {/* Subtle Concentric Guide Ring */}
          <circle
            cx={radius}
            cy={radius}
            r={rimRadius + 22}
            fill="none"
            stroke="#E3E1D9"
            strokeWidth="0.75"
            strokeDasharray="3 3"
          />

          {/* Radial Divider Lines */}
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
            const angle = i * SEGMENT_ANGLE - Math.PI / 2 + SEGMENT_ANGLE / 2;
            const x1 = radius + innerRadius * Math.cos(angle);
            const y1 = radius + innerRadius * Math.sin(angle);
            const x2 = radius + (radius - 4) * Math.cos(angle);
            const y2 = radius + (radius - 4) * Math.sin(angle);

            return (
              <line
                key={`div-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D8D6CE"
                strokeWidth="1"
              />
            );
          })}

          {/* Segment Labels Along the Rim */}
          {SECTIONS.map((section, idx) => {
            const segmentBaseAngle = idx * SEGMENT_ANGLE - Math.PI / 2;
            const x = radius + rimRadius * Math.cos(segmentBaseAngle);
            const y = radius + rimRadius * Math.sin(segmentBaseAngle);

            // Angular distance of this label from the top apex
            const currentWorldAngle = mod(displayAngle + idx * SEGMENT_ANGLE, 2 * Math.PI);
            const distFromTop = Math.min(currentWorldAngle, 2 * Math.PI - currentWorldAngle);
            const isCurrentlyActive = distFromTop < SEGMENT_ANGLE * 0.45;
            const isPulsing = pulsingIndex === idx;

            // Rotate text to follow the rim
            const textAngleDeg = (segmentBaseAngle * 180) / Math.PI + 90;

            return (
              <g
                key={section}
                transform={`translate(${x}, ${y}) rotate(${textAngleDeg})`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Ignore the click that ends a drag
                  if (movedRef.current) return;
                  if (idx === sectionIndexForAngle(targetRef.current)) {
                    latest.current.onOpenSectionDetail(section);
                  } else {
                    goToSection(idx);
                  }
                }}
                className="transition-transform duration-150"
                style={{
                  transformOrigin: '0 0',
                }}
              >
                {/* Click target hitbox */}
                <rect x={-60} y={-20} width={120} height={40} fill="transparent" />

                {/* Section Label Text */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono tracking-[0.2em] font-medium transition-all duration-200"
                  style={{
                    fontSize: isCurrentlyActive ? (isMobile ? '11px' : '12.5px') : (isMobile ? '9.5px' : '10.5px'),
                    fill: isCurrentlyActive ? '#1A1A1A' : '#737373',
                    opacity: isCurrentlyActive ? 1.0 : 0.38,
                    transform: isPulsing ? 'scale(1.18)' : 'scale(1.0)',
                    fontWeight: isCurrentlyActive ? 600 : 400,
                  }}
                >
                  {section}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
