/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sliders, RotateCcw, Eye, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { DRIFT_CONFIG } from '../config';

interface HUDOverlayProps {
  lastClickedTitle: string | null;
  config: typeof DRIFT_CONFIG;
  onChangeConfig: (newConfig: typeof DRIFT_CONFIG) => void;
  onResetConfig: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isTouchDevice: boolean;
}

export function HUDOverlay({
  lastClickedTitle,
  config,
  onChangeConfig,
  onResetConfig,
  isReducedMotion,
  onToggleReducedMotion,
  isTouchDevice,
}: HUDOverlayProps) {
  const [isTunerOpen, setIsTunerOpen] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-9 md:p-12 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* TOP HEADER SECTION */}
      {/* ==================================================================== */}
      <header className="relative w-full flex items-start justify-between">
        {/* TOP LEFT: Small, slightly rotated playful tagline */}
        <div className="flex-1 max-w-[200px] sm:max-w-[260px]">
          <p
            className="pointer-events-auto inline-block text-[11px] sm:text-[12px] font-normal tracking-tight text-neutral-800 leading-snug cursor-default origin-top-left transition-transform duration-300 hover:rotate-0"
            style={{ transform: 'rotate(-2.5deg)' }}
          >
            [SHORT PLAYFUL TAGLINE]
          </p>
        </div>

        {/* TOP CENTER: Placeholder wordmark reading [MY NAME] */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 text-center">
          <h1 className="pointer-events-auto text-[14px] sm:text-[16px] md:text-[17px] font-medium tracking-[0.22em] uppercase text-neutral-900 cursor-default hover:tracking-[0.26em] transition-all duration-300">
            [MY NAME]
          </h1>
        </div>

        {/* TOP RIGHT: Small uppercase text links stacked vertically */}
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          {['[LINK 1]', '[LINK 2]', '[LINK 3]', '[LINK 4]'].map((linkName, idx) => (
            <a
              key={idx}
              href={`#${linkName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              onClick={(e) => {
                e.preventDefault();
                console.log(`[Nav Click]: ${linkName}`);
              }}
              className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-neutral-800 hover:text-neutral-500 transition-colors py-0.5"
            >
              {linkName}
            </a>
          ))}
        </div>
      </header>

      {/* ==================================================================== */}
      {/* CENTER HINT / TOUCH CUE (Fades out gently) */}
      {/* ==================================================================== */}
      <div className="flex flex-col items-center justify-center pointer-events-none my-auto opacity-40 hover:opacity-80 transition-opacity">
        <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-neutral-500 text-center">
          {isTouchDevice ? 'Drag to tilt • Swipe up/down to explore drift' : 'Scroll to travel • Move cursor for parallax'}
        </p>
      </div>

      {/* ==================================================================== */}
      {/* CLICK FEEDBACK BADGE (Notice when a card is clicked) */}
      {/* ==================================================================== */}
      {lastClickedTitle && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto bg-neutral-900/90 text-[#F5F4F1] px-4 py-2 rounded-sm text-xs font-mono tracking-wide shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="opacity-60 mr-2">console.log:</span>
          &ldquo;{lastClickedTitle}&rdquo;
        </div>
      )}

      {/* ==================================================================== */}
      {/* BOTTOM FOOTER SECTION */}
      {/* ==================================================================== */}
      <footer className="relative w-full flex flex-col gap-3">
        {/* COLLAPSIBLE FEEL TUNER DOCK (Bottom center dock) */}
        <div className="w-full flex justify-center">
          <div className="pointer-events-auto flex flex-col items-center">
            {/* Tuner Toggle Button */}
            <button
              onClick={() => setIsTunerOpen(!isTunerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-700 text-[11px] font-medium tracking-wide transition-all backdrop-blur-none cursor-pointer border border-neutral-300/60"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Feel Tuner</span>
              {isTunerOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Tuner Panel */}
            {isTunerOpen && (
              <div className="mt-2 p-4 w-[92vw] max-w-[560px] bg-[#FAF9F6]/95 border border-neutral-300/80 rounded-lg shadow-lg text-neutral-800 text-xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="font-medium tracking-wide uppercase text-[11px]">
                      Live Visual & Tactile Tuner
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onToggleReducedMotion}
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {isReducedMotion ? 'View 3D Drift' : 'Test 2D Grid'}
                    </button>
                    <button
                      onClick={onResetConfig}
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {/* Scroll Sensitivity */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Scroll Speed</span>
                      <span className="font-semibold">{config.scrollSensitivity.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.005"
                      max="0.04"
                      step="0.001"
                      value={config.scrollSensitivity}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          scrollSensitivity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Scroll Lerp Smoothness */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Scroll Easing</span>
                      <span className="font-semibold">{config.scrollLerpFactor.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.02"
                      max="0.15"
                      step="0.005"
                      value={config.scrollLerpFactor}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          scrollLerpFactor: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Parallax Strength */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Parallax Strength</span>
                      <span className="font-semibold">{config.mouseParallaxStrengthX.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={config.mouseParallaxStrengthX}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          mouseParallaxStrengthX: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Idle Float Speed */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Idle Drift Speed</span>
                      <span className="font-semibold">{config.idleFloatSpeed.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.5"
                      step="0.05"
                      value={config.idleFloatSpeed}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          idleFloatSpeed: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Hover Scale */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Hover Scale</span>
                      <span className="font-semibold">{config.hoverScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.02"
                      max="1.25"
                      step="0.01"
                      value={config.hoverScale}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          hoverScale: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Dimmed Opacity */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Hover Dimming</span>
                      <span className="font-semibold">{(1 - config.dimmedOpacity).toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.02"
                      value={config.dimmedOpacity}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          dimmedOpacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CORNERS */}
        <div className="w-full flex items-end justify-between text-[10px] sm:text-[11px] tracking-wider text-neutral-800 font-normal">
          {/* Bottom Left: Small copyright text */}
          <div className="pointer-events-auto cursor-default">
            <span>© {new Date().getFullYear()} [MY NAME]</span>
          </div>

          {/* Bottom Right: [credit line] */}
          <div className="pointer-events-auto cursor-default">
            <span>[credit line]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
