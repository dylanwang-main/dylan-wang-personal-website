/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { HUDOverlay } from './components/HUDOverlay';
import { PhotoDriftCanvas } from './components/PhotoDriftCanvas';
import { ReducedMotionGrid } from './components/ReducedMotionGrid';
import { DRIFT_CONFIG } from './config';

export default function App() {
  // Tunable feel configuration state initialized with default values from config.ts
  const [activeConfig, setActiveConfig] = useState<typeof DRIFT_CONFIG>(DRIFT_CONFIG);

  // Accessible reduced-motion detection
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Touch device detection (for touch drag parallax instead of mouse parallax)
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Notification for clicked card title (as requested: "Click: for now, just log the card title to the console.")
  const [lastClickedTitle, setLastClickedTitle] = useState<string | null>(null);

  useEffect(() => {
    // Detect touch capability
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    // Listen to prefers-reduced-motion OS changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Card click handler: logs to console and shows brief visual toast
  const handleCardClick = (title: string) => {
    setLastClickedTitle(title);
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => {
      setLastClickedTitle((curr) => (curr === title ? null : curr));
    }, 3000);
  };

  const handleResetConfig = () => {
    setActiveConfig(DRIFT_CONFIG);
  };

  const handleToggleReducedMotion = () => {
    setIsReducedMotion((prev) => !prev);
  };

  return (
    <main
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ backgroundColor: '#F5F4F1' }}
    >
      {/* 3D DRIFT FIELD OR ACCESSIBLE 2D GRID */}
      {isReducedMotion ? (
        <ReducedMotionGrid onCardClickNotice={handleCardClick} />
      ) : (
        <PhotoDriftCanvas
          onCardClickNotice={handleCardClick}
          isTouchDevice={isTouchDevice}
          activeConfig={activeConfig}
        />
      )}

      {/* MINIMALIST TYPOGRAPHIC HUD OVERLAY */}
      <HUDOverlay
        lastClickedTitle={lastClickedTitle}
        config={activeConfig}
        onChangeConfig={setActiveConfig}
        onResetConfig={handleResetConfig}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        isTouchDevice={isTouchDevice}
      />
    </main>
  );
}
