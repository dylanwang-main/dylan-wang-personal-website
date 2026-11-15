/**
 * The home page. Loaded lazily so the three.js bundle only downloads here.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SECTIONS } from '../content/site';
import type { SectionId } from '../content/types';
import { useIsNarrow, useIsTouch, usePageMeta, useReducedMotion } from '../lib/hooks';
import { navigate } from '../router';
import { buildDriftCards } from './cards';
import { DRIFT_CONFIG } from './config';
import { FeelTuner } from './FeelTuner';
import { HomeHUD } from './HomeHUD';
import PhotoDriftCanvas from './PhotoDriftCanvas';
import { ReducedMotionGrid } from './ReducedMotionGrid';
import { SectionWheel } from './SectionWheel';

const showTuner = () =>
  import.meta.env.DEV || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('tune'));

export default function DriftHome() {
  usePageMeta(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const narrow = useIsNarrow();
  const cards = useMemo(() => buildDriftCards(), []);
  const [config, setConfig] = useState(DRIFT_CONFIG);
  // Remember which room you were in, so "back" from a page lands you there again
  const [active, setActive] = useState<SectionId>(() => {
    try {
      const saved = sessionStorage.getItem('dw-room') as SectionId | null;
      if (saved && SECTIONS.some((s) => s.id === saved)) return saved;
    } catch {
      /* storage unavailable */
    }
    return SECTIONS[0].id;
  });
  const [initialRoom] = useState(active);
  useEffect(() => {
    try {
      sessionStorage.setItem('dw-room', active);
    } catch {
      /* storage unavailable */
    }
  }, [active]);
  const [glideKey, setGlideKey] = useState(0);
  const [hint, setHint] = useState(true);

  // Fixed full-screen page while the drift is showing
  useEffect(() => {
    if (reduced) return;
    document.documentElement.classList.add('is-drift');
    return () => document.documentElement.classList.remove('is-drift');
  }, [reduced]);

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 7000);
    return () => window.clearTimeout(t);
  }, []);

  const onInteract = useCallback(() => setHint(false), []);

  const onWheelSelect = useCallback((s: SectionId) => {
    setActive(s);
    setGlideKey((k) => k + 1);
    setHint(false);
  }, []);

  const onOpen = useCallback((s: SectionId) => {
    navigate(SECTIONS.find((x) => x.id === s)!.path);
  }, []);

  if (reduced) {
    return (
      <div className="relative min-h-screen">
        <HomeHUD showHint={false} isTouch={isTouch} />
        <ReducedMotionGrid cards={cards} />
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-paper">
      <PhotoDriftCanvas
        cards={cards}
        activeSection={active}
        initialSection={initialRoom}
        onTravelSection={setActive}
        glideKey={glideKey}
        config={config}
        isTouch={isTouch}
        onInteract={onInteract}
      />
      <HomeHUD showHint={hint} isTouch={isTouch} />
      <SectionWheel activeSection={active} onSelectSection={onWheelSelect} onOpenSection={onOpen} config={config} isMobile={narrow} />
      {showTuner() && <FeelTuner config={config} onChange={setConfig} />}
    </div>
  );
}
