/**
 * The 3D scene. Cards sit in depth bands ("rooms"), one per section.
 * - Scroll / swipe travels through the rooms, and the wheel follows along.
 * - Turning the wheel flies the camera to that room.
 * - The mouse adds gentle parallax.
 * Rendering pauses whenever the tab is hidden.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { SECTIONS } from '../content/site';
import type { SectionId } from '../content/types';
import { setCursorOverride } from '../lib/cursor';
import { navigate } from '../router';
import { DriftCard, PlacedCard, bandCenter, layoutCards } from './cards';
import type { DriftConfig } from './config';
import { PhotoCard3D } from './PhotoCard3D';

interface Props {
  cards: DriftCard[];
  activeSection: SectionId;
  /** Room the camera starts in */
  initialSection: SectionId;
  /** Called when scrolling moves the camera into a different room */
  onTravelSection: (s: SectionId) => void;
  /** Bumps whenever the wheel (not scrolling) picks a section, to trigger a camera glide */
  glideKey: number;
  config: DriftConfig;
  isTouch: boolean;
  onInteract: () => void;
}

const sectionIndex = (id: SectionId) => SECTIONS.findIndex((s) => s.id === id);

function Scene({ cards, activeSection, initialSection, onTravelSection, glideKey, config, isTouch, onInteract }: Props) {
  const { camera, gl, size } = useThree();
  const aspectBucket = Math.round((size.width / Math.max(1, size.height)) * 4) / 4;
  const placed = useMemo(() => layoutCards(cards, config, aspectBucket), [cards, config, aspectBucket]);

  const camMax = bandCenter(0, config) + config.focusDistance + 4;
  const camMin = bandCenter(SECTIONS.length - 1, config) + config.focusDistance - 4;

  const targetZ = useRef(bandCenter(sectionIndex(initialSection), config) + config.focusDistance);
  const parallax = useRef({ x: 0, y: 0 });
  const lastReported = useRef<SectionId>(activeSection);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const introStart = useRef<number | null>(null);
  const [introT, setIntroT] = useState(0);

  // Which room is the camera parked in?
  const roomForZ = (z: number): SectionId => {
    const raw = -(z - config.focusDistance) / config.bandSpacing;
    const i = Math.max(0, Math.min(SECTIONS.length - 1, Math.round(raw)));
    return SECTIONS[i].id;
  };

  // Wheel picked a section: glide there
  useEffect(() => {
    if (glideKey === 0) return;
    const i = sectionIndex(activeSection);
    targetZ.current = bandCenter(i, config) + config.focusDistance;
    lastReported.current = activeSection;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glideKey]);

  useEffect(() => {
    const el = gl.domElement;
    const report = () => {
      const room = roomForZ(targetZ.current);
      if (room !== lastReported.current) {
        lastReported.current = room;
        onTravelSection(room);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      parallax.current.x = -((e.clientX / window.innerWidth) * 2 - 1) * config.parallaxX;
      parallax.current.y = ((e.clientY / window.innerHeight) * 2 - 1) * config.parallaxY;
    };

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-no-drift-scroll="true"]')) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
      const d = Math.max(-120, Math.min(120, e.deltaY * unit));
      targetZ.current = THREE.MathUtils.clamp(targetZ.current - d * config.scrollSensitivity, camMin, camMax);
      report();
      onInteract();
    };

    let lastY: number | null = null;
    let lastX: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? null;
      lastX = e.touches[0]?.clientX ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lastY === null || lastX === null || !e.touches[0]) return;
      e.preventDefault();
      const dy = e.touches[0].clientY - lastY;
      const dx = e.touches[0].clientX - lastX;
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
      targetZ.current = THREE.MathUtils.clamp(targetZ.current + dy * config.scrollSensitivity * 2.2, camMin, camMax);
      parallax.current.x = THREE.MathUtils.clamp(parallax.current.x - dx * 0.01, -config.parallaxX * 1.4, config.parallaxX * 1.4);
      report();
      onInteract();
    };
    const onTouchEnd = () => {
      lastY = lastX = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl.domElement, config, camMin, camMax]);

  useFrame((state, delta) => {
    if (introStart.current === null) introStart.current = state.clock.getElapsedTime();
    const it = state.clock.getElapsedTime() - introStart.current;
    if (it < config.introHoldSec + config.introFadeSec + config.introStaggerSec + 0.5) setIntroT(it);
    else if (introT < 99) setIntroT(99);

    // Slow automatic drift on touch screens, where there's no mouse parallax
    if (isTouch) parallax.current.y = Math.sin(state.clock.getElapsedTime() * 0.25) * config.parallaxY * 0.4;

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ.current, config.scrollDamping, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallax.current.x, config.parallaxDamping, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, parallax.current.y, config.parallaxDamping, delta);
    camera.lookAt(parallax.current.x * 0.2, parallax.current.y * 0.2, camera.position.z - 10);
  });

  const onHover = (p: PlacedCard | null) => {
    setHoveredId(p?.card.id ?? null);
    if (!p) return setCursorOverride(null);
    const s = SECTIONS.find((x) => x.id === p.card.section)!;
    setCursorOverride({ mode: 'view', label: 'Open', caption: `${s.numeral} ${s.label} · ${p.card.title}` });
  };

  useEffect(() => () => setCursorOverride(null), []);

  return (
    <group>
      {placed.map((p) => (
        <PhotoCard3D
          key={p.card.id}
          placed={p}
          active={p.card.section === activeSection}
          hoveredId={hoveredId}
          introT={introT}
          config={config}
          onHover={onHover}
          onOpen={(pc) => {
            setCursorOverride(null);
            navigate(pc.card.href);
          }}
        />
      ))}
    </group>
  );
}

export default function PhotoDriftCanvas(props: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div className="absolute inset-0 touch-none" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{
          position: [0, 0, bandCenter(sectionIndex(props.initialSection), props.config) + props.config.focusDistance],
          fov: props.config.cameraFov, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0xf5f4f1, 1);
          scene.fog = new THREE.Fog(0xf5f4f1, 26, 64);
        }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
