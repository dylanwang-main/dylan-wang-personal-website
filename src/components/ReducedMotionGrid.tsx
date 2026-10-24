/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PHOTO_CARDS, PhotoCardItem, SECTIONS, SectionName } from '../config';

interface ReducedMotionGridProps {
  activeSection: SectionName;
  onSelectSection: (sec: SectionName) => void;
  onOpenCardDetail: (card: PhotoCardItem) => void;
}

export function ReducedMotionGrid({
  activeSection,
  onSelectSection,
  onOpenCardDetail,
}: ReducedMotionGridProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-6 pt-24 pb-36 sm:px-12 md:px-20 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-300 pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
            Accessibility Mode • Reduced Motion Active
          </p>
          <h2 className="text-xl font-light text-neutral-900 mt-1">
            Section: {activeSection}
          </h2>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => onSelectSection(sec)}
              className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer border ${
                activeSection === sec
                  ? 'bg-neutral-900 text-[#F5F4F1] border-neutral-900'
                  : 'bg-transparent text-neutral-600 border-neutral-300 hover:border-neutral-500'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {PHOTO_CARDS.map((card) => {
          const isSelectedSection = card.section === activeSection;

          return (
            <div
              key={card.id}
              className={`group cursor-pointer select-none transition-opacity duration-300 ${
                isSelectedSection ? 'opacity-100 ring-1 ring-neutral-400 p-1' : 'opacity-40 hover:opacity-85'
              }`}
              onClick={() => {
                console.log(`[Reduced Motion Card Clicked]: "${card.title}" (${card.type})`);
                onOpenCardDetail(card);
              }}
            >
              <div
                className="w-full overflow-hidden"
                style={{
                  aspectRatio: `${card.aspectRatio}`,
                  backgroundColor: card.fallbackColor,
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between text-neutral-800">
                <span className="text-[12px] tracking-tight font-normal truncate max-w-[75%]">
                  {card.title}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono">
                  {card.section}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
