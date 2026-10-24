/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { PhotoCardItem } from '../config';

interface CustomCursorProps {
  hoveredCard: PhotoCardItem | null;
  isTouchDevice: boolean;
}

export function CustomCursor({ hoveredCard, isTouchDevice }: CustomCursorProps) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  // Hide the system cursor everywhere (see index.css) only while this custom cursor is active,
  // so touch and hybrid devices never end up with no cursor at all.
  useEffect(() => {
    if (isTouchDevice) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    return () => root.classList.remove('has-custom-cursor');
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const isCardHovered = Boolean(hoveredCard);

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Central Cursor Dot / Ring */}
      <div
        className="flex items-center justify-center transition-all duration-200"
        style={{
          width: isCardHovered ? '40px' : '8px',
          height: isCardHovered ? '40px' : '8px',
          backgroundColor: isCardHovered ? 'rgba(26, 26, 26, 0.9)' : '#1A1A1A',
          borderRadius: '9999px',
          boxShadow: isCardHovered ? '0 2px 10px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        {isCardHovered && (
          <span className="text-[9px] font-mono tracking-widest text-[#F5F4F1] uppercase">
            VIEW
          </span>
        )}
      </div>

      {/* Floating Hover Caption Near Cursor */}
      {hoveredCard && (
        <div
          className="absolute left-6 top-6 whitespace-nowrap bg-[#FAF9F6]/95 border border-neutral-300 px-2.5 py-1 text-[10px] font-mono tracking-wider text-neutral-800 uppercase shadow-sm pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="opacity-50 mr-1.5">{hoveredCard.section}</span>
          <span>{hoveredCard.title}</span>
        </div>
      )}
    </div>
  );
}
