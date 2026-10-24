/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sliders, RotateCcw, Eye, ChevronDown, ChevronUp, Sparkles, Copy, Check } from 'lucide-react';
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
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySettings = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2400);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-9 md:p-12 overflow-hidden select-none">
      {/* ==================================================================== */}
      {/* TOP HEADER SECTION */}
      {/* ==================================================================== */}
      <header className="relative w-full flex items-start justify-between">
        {/* TOP LEFT: Small, slightly rotated playful tagline (remains prominent on intro) */}
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
      {/* CENTER HINT / TOUCH CUE */}
      {/* ==================================================================== */}
      <div className="flex flex-col items-center justify-center pointer-events-none my-auto opacity-35 hover:opacity-75 transition-opacity">
        <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-neutral-500 text-center">
          {isTouchDevice
            ? 'Drag scene • Rotate bottom wheel to switch sections'
            : 'Scroll to travel • Rotate bottom wheel to switch sections'}
        </p>
      </div>

      {/* ==================================================================== */}
      {/* CLICK FEEDBACK BADGE */}
      {/* ==================================================================== */}
      {lastClickedTitle && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto bg-neutral-900/90 text-[#F5F4F1] px-4 py-2 rounded-sm text-xs font-mono tracking-wide shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="opacity-60 mr-2">console.log:</span>
          &ldquo;{lastClickedTitle}&rdquo;
        </div>
      )}

      {/* ==================================================================== */}
      {/* BOTTOM FOOTER SECTION */}
      {/* ==================================================================== */}
      <footer className="relative w-full flex flex-col gap-3 pointer-events-none">
        {/* COLLAPSIBLE FEEL TUNER DOCK */}
        <div className="w-full flex justify-center mb-1">
          <div
            className="pointer-events-auto flex flex-col items-center"
            data-no-drift-scroll="true"
          >
            {/* Tuner Toggle Button */}
            <button
              onClick={() => setIsTunerOpen(!isTunerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-700 text-[11px] font-medium tracking-wide transition-all cursor-pointer border border-neutral-300/60 shadow-xs"
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
              <div
                className="mt-2 p-4 w-[94vw] max-w-[680px] max-h-[65vh] overflow-y-auto bg-[#FAF9F6]/95 border border-neutral-300/80 rounded-lg shadow-xl text-neutral-800 text-xs backdrop-blur-none"
                data-no-drift-scroll="true"
              >
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="font-medium tracking-wide uppercase text-[11px]">
                      Live Visual & Wheel Tuner
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySettings}
                      className="px-2.5 py-1 rounded text-[10px] uppercase font-mono tracking-wider bg-neutral-900 text-[#F5F4F1] hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Copy config as JSON to clipboard"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied JSON!' : 'Copy Settings'}</span>
                    </button>
                    <button
                      onClick={onToggleReducedMotion}
                      className="px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {isReducedMotion ? '3D Drift' : '2D Grid'}
                    </button>
                    <button
                      onClick={onResetConfig}
                      className="px-2 py-1 rounded text-[10px] uppercase font-mono tracking-wider text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3.5">
                  {/* Card Spread */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Card Spread</span>
                      <span className="font-semibold">{config.cardSpreadMultiplier.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.05"
                      value={config.cardSpreadMultiplier}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          cardSpreadMultiplier: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Depth Range */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Depth Range</span>
                      <span className="font-semibold">{config.depthRangeMultiplier.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.7"
                      step="0.05"
                      value={config.depthRangeMultiplier}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          depthRangeMultiplier: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Tilt Variance */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Tilt Variance</span>
                      <span className="font-semibold">{config.tiltVarianceMultiplier.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.0"
                      step="0.1"
                      value={config.tiltVarianceMultiplier}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          tiltVarianceMultiplier: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Wheel Sensitivity */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Wheel Sensitivity</span>
                      <span className="font-semibold">{(config.wheelSensitivity * 1000).toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.001"
                      max="0.008"
                      step="0.0005"
                      value={config.wheelSensitivity}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          wheelSensitivity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                  </div>

                  {/* Wheel Snap Strength */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-neutral-600">Wheel Snap</span>
                      <span className="font-semibold">{config.wheelSnapStrength.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.03"
                      max="0.22"
                      step="0.01"
                      value={config.wheelSnapStrength}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          wheelSnapStrength: parseFloat(e.target.value),
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
                      min="0.3"
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

                  {/* Scroll Speed */}
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
