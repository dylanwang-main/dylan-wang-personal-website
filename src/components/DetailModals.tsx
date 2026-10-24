/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { PhotoCardItem, SECTION_DESCRIPTIONS, SectionName } from '../config';

interface DetailModalsProps {
  selectedSection: SectionName | null;
  onCloseSection: () => void;
  selectedCard: PhotoCardItem | null;
  onCloseCard: () => void;
}

export function DetailModals({
  selectedSection,
  onCloseSection,
  selectedCard,
  onCloseCard,
}: DetailModalsProps) {
  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCard) onCloseCard();
        if (selectedSection) onCloseSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCard, selectedSection, onCloseCard, onCloseSection]);

  return (
    <>
      {/* ================================================================== */}
      {/* SECTION VIEW OVERLAY */}
      {/* ================================================================== */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#F5F4F1]/98 backdrop-blur-none animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full text-neutral-900 flex flex-col items-start select-text">
            {/* Top Close Button */}
            <button
              onClick={onCloseSection}
              className="absolute -top-12 right-0 sm:top-0 p-2 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Close section view"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Section Tag */}
            <div className="mb-4">
              <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-400">
                CURATED SECTION ARCHIVE
              </span>
            </div>

            {/* Section Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-950 mb-8">
              {selectedSection}
            </h2>

            {/* Placeholder Description */}
            <div className="space-y-5 text-neutral-700 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              <p>
                {SECTION_DESCRIPTIONS[selectedSection] ||
                  '[SECTION DESCRIPTION] Curated works, architectural stillness, and photographic documentation.'}
              </p>
              <p className="text-neutral-500 text-xs sm:text-sm">
                [SECTION DESCRIPTION CONTINUED] This section compiles observations across medium format still photography, architectural proportions, and continuous ambient recordings. Select any image in the field to inspect individual plate details.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 pt-6 border-t border-neutral-300 w-full flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>PRESS [ESC] OR CLICK OUTSIDE TO RETURN</span>
              <button
                onClick={onCloseSection}
                className="underline underline-offset-4 text-neutral-900 hover:text-neutral-600 cursor-pointer"
              >
                CLOSE [×]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* CARD DETAIL OVERLAY */}
      {/* ================================================================== */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-[#F5F4F1]/98 backdrop-blur-none animate-in fade-in duration-300">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 select-text">
            {/* Close Button */}
            <button
              onClick={onCloseCard}
              className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer z-10"
              aria-label="Close card detail"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Image Preview Container */}
            <div
              className="w-full md:w-3/5 overflow-hidden flex-shrink-0 relative group"
              style={{
                backgroundColor: selectedCard.fallbackColor,
                aspectRatio: `${selectedCard.aspectRatio}`,
              }}
            >
              <img
                src={selectedCard.image}
                alt={selectedCard.title}
                className="w-full h-full object-cover select-none"
              />
              {selectedCard.type === 'video' && (
                <div className="absolute bottom-4 left-4 bg-neutral-950/80 text-white px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-current" />
                  <span>16mm Video Loop</span>
                </div>
              )}
            </div>

            {/* Metadata & Captions */}
            <div className="w-full md:w-2/5 flex flex-col justify-between py-2 text-neutral-900">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                    {selectedCard.section}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500">
                    {selectedCard.type}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-950 mb-4">
                  {selectedCard.title}
                </h3>

                <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {selectedCard.caption}
                </p>

                <p className="text-neutral-400 text-xs leading-relaxed font-mono">
                  [CARD CAPTION METADATA] Archival pigment print • Natural gelatin emulsion • Format 4:5
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>PRESS ESC TO CLOSE</span>
                <button
                  onClick={onCloseCard}
                  className="underline underline-offset-4 text-neutral-900 hover:text-neutral-600 cursor-pointer"
                >
                  RETURN [×]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
