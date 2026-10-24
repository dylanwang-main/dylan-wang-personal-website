/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { DetailModals } from './components/DetailModals';
import { HUDOverlay } from './components/HUDOverlay';
import { PhotoDriftCanvas } from './components/PhotoDriftCanvas';
import { ReducedMotionGrid } from './components/ReducedMotionGrid';
import { SectionWheel } from './components/SectionWheel';
import { DRIFT_CONFIG, PhotoCardItem, SECTIONS, SectionName } from './config';

export default function App() {
  // Tunable feel configuration state initialized with default values from config.ts
  const [activeConfig, setActiveConfig] = useState<typeof DRIFT_CONFIG>(DRIFT_CONFIG);

  // Active section selection (controlled by bottom wheel, arrow keys, or grid tabs)
  const [activeSection, setActiveSection] = useState<SectionName>(SECTIONS[0]);

  // Modals state
  const [openedSection, setOpenedSection] = useState<SectionName | null>(null);
  const [openedCard, setOpenedCard] = useState<PhotoCardItem | null>(null);

  // Hovered card for custom cursor & hover caption
  const [hoveredCard, setHoveredCard] = useState<PhotoCardItem | null>(null);

  // Accessible reduced-motion detection
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Touch device detection
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  // Last clicked title notification
  const [lastClickedTitle, setLastClickedTitle] = useState<string | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    // Listen to prefers-reduced-motion OS changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
        window.removeEventListener('resize', checkViewport);
      };
    }

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Card click handler: logs to console, shows toast, and opens card detail overlay
  const handleCardClick = (card: PhotoCardItem) => {
    setLastClickedTitle(card.title);
    setOpenedCard(card);
    setTimeout(() => {
      setLastClickedTitle((curr) => (curr === card.title ? null : curr));
    }, 3200);
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
      {/* CUSTOM CURSOR & HOVER CAPTION */}
      <CustomCursor hoveredCard={hoveredCard} isTouchDevice={isTouchDevice} />

      {/* 3D DRIFT FIELD OR ACCESSIBLE 2D GRID */}
      {isReducedMotion ? (
        <ReducedMotionGrid
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onOpenCardDetail={handleCardClick}
        />
      ) : (
        <PhotoDriftCanvas
          activeSection={activeSection}
          onHoveredCardChange={setHoveredCard}
          onSelectCardDetail={handleCardClick}
          isTouchDevice={isTouchDevice}
          activeConfig={activeConfig}
        />
      )}

      {/* BOTTOM SECTION WHEEL (Large thin circular wheel, ~60% visible at bottom) */}
      {!isReducedMotion && (
        <SectionWheel
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onOpenSectionDetail={(section) => setOpenedSection(section)}
          config={activeConfig}
          isMobile={isMobileScreen}
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

      {/* FULL-SCREEN OVERLAYS FOR SECTION ARCHIVE & CARD DETAIL */}
      <DetailModals
        selectedSection={openedSection}
        onCloseSection={() => setOpenedSection(null)}
        selectedCard={openedCard}
        onCloseCard={() => setOpenedCard(null)}
      />
    </main>
  );
}
