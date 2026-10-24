/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PHOTO_CARDS } from '../config';

interface ReducedMotionGridProps {
  onCardClickNotice: (title: string) => void;
}

export function ReducedMotionGrid({ onCardClickNotice }: ReducedMotionGridProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-6 pt-24 pb-28 sm:px-12 md:px-20 max-w-7xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
          Accessibility Mode • Reduced Motion Active
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {PHOTO_CARDS.map((card) => (
          <div
            key={card.id}
            className="group cursor-pointer select-none"
            onClick={() => {
              console.log(`[Reduced Motion Card Clicked]: "${card.title}" (${card.type})`);
              onCardClickNotice(card.title);
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
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  // Fallback visually to solid warm color if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between text-neutral-800">
              <span className="text-[12px] tracking-tight font-normal truncate max-w-[80%]">
                {card.title}
              </span>
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono">
                {card.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
