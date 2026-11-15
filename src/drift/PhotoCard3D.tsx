/**
 * One floating card. Uses the real image or video when the media has a src,
 * otherwise the generated print (animated prints redraw ~20 times a second,
 * and only while the card is near the camera).
 */
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { drawArt, makeArtCanvas } from '../lib/art';
import type { PlacedCard } from './cards';
import type { DriftConfig } from './config';

interface Props {
  placed: PlacedCard;
  active: boolean;
  hoveredId: string | null;
  introT: number;
  config: DriftConfig;
  onHover: (p: PlacedCard | null) => void;
  onOpen: (p: PlacedCard) => void;
}

const TEX_WIDTH = 384;

function useCardTexture(placed: PlacedCard) {
  const { media, frame } = placed.card;
  const art = useMemo(() => {
    const canvas = makeArtCanvas(media, TEX_WIDTH, { frame, label: media.caption, t: 1.2 });
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas, tex };
  }, [media, frame]);

  const [real, setReal] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!media.src) return;
    let cancelled = false;
    let video: HTMLVideoElement | null = null;
    if (media.kind === 'video') {
      video = document.createElement('video');
      video.src = media.src;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(() => {});
      const vt = new THREE.VideoTexture(video);
      vt.colorSpace = THREE.SRGBColorSpace;
      setReal(vt);
    } else {
      new THREE.TextureLoader().load(media.src, (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        setReal(t);
      });
    }
    return () => {
      cancelled = true;
      video?.pause();
    };
  }, [media.src, media.kind]);

  useEffect(() => () => art.tex.dispose(), [art]);

  return { art, real };
}

const _pos = new THREE.Vector3();

export function PhotoCard3D({ placed, active, hoveredId, introT, config, onHover, onOpen }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const { art, real } = useCardTexture(placed);
  const lastDraw = useRef(0);
  const isHovered = hoveredId === placed.card.id;
  const anyHovered = hoveredId !== null;
  const animated = !!placed.card.media.animated && !placed.card.media.src;

  useFrame((state, delta) => {
    const m = mesh.current;
    const material = mat.current;
    if (!m || !material) return;
    const t = state.clock.getElapsedTime();
    const camZ = state.camera.position.z;
    const near = Math.abs(camZ - placed.z) < 34;

    if (animated && near && t - lastDraw.current > 0.05) {
      lastDraw.current = t;
      drawArt(art.canvas, placed.card.media, { frame: placed.card.frame, label: placed.card.media.caption, t });
      art.tex.needsUpdate = true;
    }

    // Intro: hold, then ease in from behind
    const k = Math.min(1, Math.max(0, introT - config.introHoldSec - placed.stagger) / config.introFadeSec);
    const eased = 1 - Math.pow(1 - k, 3);

    const fy = Math.sin(t * config.idleSpeed + placed.phase) * config.idleAmpY;
    const fx = Math.cos(t * config.idleSpeed * 0.65 + placed.phase) * config.idleAmpX;
    const wob = Math.sin(t * config.idleSpeed * 0.45 + placed.phase) * config.idleTilt;

    _pos.set(placed.x + fx, placed.y + fy, placed.z + (active ? 1.2 : -0.6) - (1 - eased) * 7);
    m.position.x = THREE.MathUtils.damp(m.position.x, _pos.x, 7, delta);
    m.position.y = THREE.MathUtils.damp(m.position.y, _pos.y, 7, delta);
    m.position.z = THREE.MathUtils.damp(m.position.z, _pos.z, 5, delta);

    const rx = isHovered ? 0 : placed.rotX + wob * 0.5;
    const ry = isHovered ? 0 : placed.rotY;
    const rz = isHovered ? 0 : placed.rotZ + wob;
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, rx, 8, delta);
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, ry, 8, delta);
    m.rotation.z = THREE.MathUtils.damp(m.rotation.z, rz, 8, delta);

    const s = isHovered ? config.hoverScale : active ? 1.03 : 1;
    m.scale.x = THREE.MathUtils.damp(m.scale.x, s, 10, delta);
    m.scale.y = THREE.MathUtils.damp(m.scale.y, s, 10, delta);

    let o = 1;
    if (isHovered) o = 1;
    else if (anyHovered) o = config.hoverDimOpacity;
    else if (!active) o = config.inactiveOpacity;
    material.opacity = THREE.MathUtils.damp(material.opacity, o * eased, 6, delta);
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(placed);
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isHovered) onHover(null);
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Ignore taps on cards that are still invisible during the intro
    if ((mat.current?.opacity ?? 0) < 0.15) return;
    onOpen(placed);
  };

  return (
    <mesh
      ref={mesh}
      position={[placed.x, placed.y, placed.z - 7]}
      rotation={[placed.rotX, placed.rotY, placed.rotZ]}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      <planeGeometry args={[placed.width, placed.height]} />
      <meshBasicMaterial ref={mat} map={real ?? art.tex} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
