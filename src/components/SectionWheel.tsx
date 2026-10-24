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

const SEGMENT_COUNT = 6;
const SEGMENT_ANGLE = (2 * Math.PI) / SEGMENT_COUNT; // 60 degrees in radians

export function SectionWheel({
  activeSection,
  onSelectSection,
  onOpenSectionDetail,
  config,
  isMobile,
}: SectionWheelProps) {
  // Current wheel rotation in radians
  const angleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartAngleRef = useRef<number>(0);
  const dragAngleOffsetRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);
  const lastDragAngleRef = useRef<number>(0);

  // Active index at the top
  const activeIndex = SECTIONS.indexOf(activeSection);
  const [displayAngle, setDisplayAngle] = useState(0);
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);

  // Wheel container element for geometry calculation
  const wheelRef = useRef<HTMLDivElement>(null);

  // Helper to normalize angle to [0, 2π)
  const normalize = (rad: number) => {
    const twoPi = Math.PI * 2;
    return ((rad % twoPi) + twoPi) % twoPi;
  };

  // Determine current top section index from rotation angle
  const getTopIndex = useCallback((rad: number): number => {
    // Top position corresponds to -rad
    const norm = normalize(-rad);
    // Each segment covers [index * angle - angle/2, index * angle + angle/2]
    const index = Math.round(norm / SEGMENT_ANGLE) % SEGMENT_COUNT;
    return index;
  }, []);

  // Soft snap to a specific section index
  const snapToSection = useCallback((index: number) => {
    const target = -index * SEGMENT_ANGLE;
    // Find closest representation to current angle to prevent full 360 spins
    const current = angleRef.current;
    const diff = ((((target - current) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    const resolvedTarget = current + diff;
    velocityRef.current = diff * 0.15;
    angleRef.current = current;
  }, []);

  // Synchronize when activeSection prop changes from external source
  useEffect(() => {
    const targetIdx = SECTIONS.indexOf(activeSection);
    if (getTopIndex(angleRef.current) !== targetIdx) {
      snapToSection(targetIdx);
    }
  }, [activeSection, getTopIndex, snapToSection]);

  // Inertia and Soft Snap Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTopIndex = activeIndex;

    const tick = () => {
      if (!isDraggingRef.current) {
        // Apply inertia decay
        velocityRef.current *= config.wheelInertiaDamping;

        // When velocity slows, apply soft snap to nearest segment
        if (Math.abs(velocityRef.current) < 0.003) {
          const nearestIndex = getTopIndex(angleRef.current);
          const target = -nearestIndex * SEGMENT_ANGLE;
          const current = angleRef.current;
          const diff = ((((target - current) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

          // Soft spring pull
          velocityRef.current += diff * config.wheelSnapStrength;
          velocityRef.current *= 0.82; // Damping
        }

        angleRef.current += velocityRef.current;

        // Detect segment tick passing top
        const currentTopIndex = getTopIndex(angleRef.current);
        if (currentTopIndex !== lastTopIndex) {
          lastTopIndex = currentTopIndex;
          onSelectSection(SECTIONS[currentTopIndex]);
          setPulsingIndex(currentTopIndex);
          setTimeout(() => setPulsingIndex((curr) => (curr === currentTopIndex ? null : curr)), 280);
        }
      }

      setDisplayAngle(angleRef.current);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [config.wheelInertiaDamping, config.wheelSnapStrength, getTopIndex, onSelectSection, activeIndex]);

  // Arrow Key Navigation (Left / Right) & Enter to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (activeIndex + 1) % SEGMENT_COUNT;
        onSelectSection(SECTIONS[nextIdx]);
        snapToSection(nextIdx);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (activeIndex - 1 + SEGMENT_COUNT) % SEGMENT_COUNT;
        onSelectSection(SECTIONS[prevIdx]);
        snapToSection(prevIdx);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onOpenSectionDetail(activeSection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activeSection, onSelectSection, snapToSection, onOpenSectionDetail]);

  // Mouse Wheel over wheel: rotates wheel ONLY, stops camera drift
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    // Delta in radians
    const delta = e.deltaY * config.wheelSensitivity;
    velocityRef.current += delta;
  };

  // Pointer Drag interactions (Desktop drag & Mobile touch)
  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    const curAngle = getPointerAngle(e.clientX, e.clientY);
    dragStartAngleRef.current = curAngle;
    dragAngleOffsetRef.current = angleRef.current;
    lastDragTimeRef.current = performance.now();
    lastDragAngleRef.current = curAngle;
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    const curAngle = getPointerAngle(e.clientX, e.clientY);
    const diff = curAngle - dragStartAngleRef.current;
    angleRef.current = dragAngleOffsetRef.current + diff;

    // Track drag velocity for inertia on release
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTimeRef.current);
    const dAngle = curAngle - lastDragAngleRef.current;
    velocityRef.current = (dAngle / dt) * 16;
    lastDragTimeRef.current = now;
    lastDragAngleRef.current = curAngle;

    // Tick detection while dragging
    const currentTop = getTopIndex(angleRef.current);
    if (currentTop !== activeIndex) {
      onSelectSection(SECTIONS[currentTop]);
      setPulsingIndex(currentTop);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was lost
    }
  };

  // Dimensions
  const wheelDiameter = isMobile ? 320 : 540;
  const radius = wheelDiameter / 2;
  const innerRadius = radius * 0.44;
  const rimRadius = radius * 0.78;

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-auto select-none touch-none z-20 flex flex-col items-center"
      style={{
        width: `${wheelDiameter}px`,
        height: `${wheelDiameter * 0.58}px`, // ~60% visible above viewport bottom
        overflow: 'visible',
      }}
      onWheel={handleWheel}
    >
      {/* Subtle indicator dot at the top center apex */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mb-1" />
        <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
          ACTIVE
        </span>
      </div>

      {/* SVG ROTATING WHEEL */}
      <div
        ref={wheelRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="cursor-grab active:cursor-grabbing w-full h-full relative"
        style={{
          width: `${wheelDiameter}px`,
          height: `${wheelDiameter}px`,
          marginTop: `-${wheelDiameter * 0.42}px`,
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

          {/* 6 Radial Divider Lines */}
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

          {/* 6 Segment Labels Along the Rim */}
          {SECTIONS.map((section, idx) => {
            // Label angle around circle (top is -90 deg / -π/2)
            const segmentBaseAngle = idx * SEGMENT_ANGLE - Math.PI / 2;
            const x = radius + rimRadius * Math.cos(segmentBaseAngle);
            const y = radius + rimRadius * Math.sin(segmentBaseAngle);

            // Compute current apparent angular distance to top apex
            const currentWorldAngle = normalize(displayAngle + idx * SEGMENT_ANGLE);
            // Distance from top (0 or 2π)
            const distFromTop = Math.min(currentWorldAngle, 2 * Math.PI - currentWorldAngle);
            const isCurrentlyActive = distFromTop < SEGMENT_ANGLE * 0.45;
            const isPulsing = pulsingIndex === idx;

            // Rotation for text to follow the rim orientation
            const textAngleDeg = (segmentBaseAngle * 180) / Math.PI + 90;

            return (
              <g
                key={section}
                transform={`translate(${x}, ${y}) rotate(${textAngleDeg})`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrentlyActive) {
                    onOpenSectionDetail(section);
                  } else {
                    snapToSection(idx);
                  }
                }}
                className="cursor-pointer transition-transform duration-150"
                style={{
                  transformOrigin: '0 0',
                }}
              >
                {/* Click target hitbox */}
                <rect
                  x={-60}
                  y={-20}
                  width={120}
                  height={40}
                  fill="transparent"
                />

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
