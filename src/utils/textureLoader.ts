/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { DRIFT_CONFIG, PhotoCardItem } from '../config';

export interface CardSpatialData {
  item: PhotoCardItem;
  // Resting anchor coordinates
  anchorX: number;
  anchorY: number;
  anchorZ: number;
  // Base random tilts (radians)
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  // Dynamic motion properties
  phaseOffset: number;
  staggerDelay: number; // Staggered delay for intro fade-in
  width: number;
  height: number;
  isStrongTilt: boolean;
  isNearCard: boolean;
}

/**
 * Procedurally generates an instant solid warm canvas texture.
 * Guaranteed to display immediately with zero network lag or blank frames.
 */
export function createWarmPlaceholderTexture(
  hexColor: string,
  title: string,
  type: 'photo' | 'video'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Fill base color
  ctx.fillStyle = hexColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle interior warm gradient for tactile paper depth
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle minimalist type indicator in center
  ctx.fillStyle = 'rgba(26, 26, 26, 0.4)';
  ctx.font = '500 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(type === 'video' ? '▶ VIDEO' : 'PHOTO', canvas.width / 2, canvas.height / 2 - 14);

  ctx.font = '400 16px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(26, 26, 26, 0.3)';
  const displayTitle = title.length > 28 ? title.slice(0, 26) + '...' : title;
  ctx.fillText(displayTitle, canvas.width / 2, canvas.height / 2 + 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates an animated video canvas texture for video-type cards.
 * Provides a warm, film-like animated light-and-shadow loop.
 */
export function createAnimatedVideoCanvasTexture(fallbackColor: string): {
  texture: THREE.CanvasTexture;
  update: (time: number) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const update = (time: number) => {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Warm animated light rays moving across the surface
    const offset1 = Math.sin(time * 0.8) * 0.5 + 0.5;
    const offset2 = Math.cos(time * 0.5) * 0.5 + 0.5;

    const grad = ctx.createLinearGradient(
      canvas.width * (0.2 + offset1 * 0.6),
      0,
      canvas.width * (0.8 - offset2 * 0.6),
      canvas.height
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    grad.addColorStop(0.5, 'rgba(235, 215, 185, 0.15)');
    grad.addColorStop(1, 'rgba(40, 30, 20, 0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle shifting caustic / grain bars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    const barY = ((time * 40) % canvas.height);
    ctx.fillRect(0, barY, canvas.width, 24);

    // Minimal "▶ 16mm LOOP" tag
    ctx.fillStyle = 'rgba(26, 26, 26, 0.35)';
    ctx.font = '500 18px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('REC • 16mm', canvas.width - 24, canvas.height - 24);

    texture.needsUpdate = true;
  };

  return { texture, update };
}

/**
 * Computes Poisson-disc style 3D spatial anchors for the 14 cards:
 * - Wide distribution across full viewport width and deep Z range.
 * - Minimum distance constraint to avoid overlapping piles at rest.
 * - Depth weighting: a few large near cards (Z around +4 to +6), mid cards, and small far cards (down to -45).
 * - Tilts: 3 out of 4 get subtle tilts (2-6 deg), 1 out of 4 gets stronger tilts (8-14 deg).
 */
export function computeCardAnchors(
  cards: PhotoCardItem[],
  config: typeof DRIFT_CONFIG
): CardSpatialData[] {
  // Predefined Poisson-disc candidate distribution across deep space
  // Engineered with strict minimum projected separation
  const rawSlots = [
    // --- 3 LARGE NEAR CARDS (Z: +2 to +6) ---
    // May drift partly off screen edges as camera moves
    { x: -7.5, y: -0.8, z: 5.5, isNear: true, isStrong: false },
    { x: 8.2, y: 1.2, z: 4.8, isNear: true, isStrong: true }, // strong tilt
    { x: 1.8, y: -4.5, z: 3.5, isNear: true, isStrong: false },

    // --- 5 MID CARDS (Z: -6 to -18) ---
    { x: -5.2, y: 3.8, z: -6.5, isNear: false, isStrong: false },
    { x: 5.6, y: -2.8, z: -10.0, isNear: false, isStrong: false },
    { x: -1.4, y: 2.2, z: -13.5, isNear: false, isStrong: true }, // strong tilt
    { x: 8.0, y: 3.2, z: -16.5, isNear: false, isStrong: false },
    { x: -8.4, y: -3.5, z: -18.5, isNear: false, isStrong: false },

    // --- 6 DEEP FAR CARDS (Z: -23 to -46) ---
    { x: 3.2, y: 4.6, z: -23.0, isNear: false, isStrong: false },
    { x: -4.8, y: -2.2, z: -27.5, isNear: false, isStrong: true }, // strong tilt
    { x: 6.8, y: -4.0, z: -32.0, isNear: false, isStrong: false },
    { x: -2.0, y: 3.5, z: -36.5, isNear: false, isStrong: false },
    { x: 5.0, y: 1.0, z: -41.0, isNear: false, isStrong: true }, // strong tilt
    { x: -7.0, y: 1.8, z: -45.5, isNear: false, isStrong: false },
  ];

  return cards.map((item, index) => {
    const slot = rawSlots[index % rawSlots.length];

    // Seeded determinism
    const seed = (index * 9301 + 49297) % 233280;
    const rnd1 = seed / 233280;
    const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
    const rnd3 = ((seed * 12345 + 6789) % 233280) / 233280;

    // Apply cardSpreadMultiplier & depthRangeMultiplier
    const anchorX = slot.x * config.cardSpreadMultiplier;
    const anchorY = slot.y * config.cardSpreadMultiplier;
    const anchorZ = slot.z * config.depthRangeMultiplier;

    // 1 in 4 gets stronger tilt (8 to 14 deg), others subtle (2 to 6 deg)
    const isStrongTilt = slot.isStrong;
    const degMin = isStrongTilt ? config.tiltStrongDegMin : config.tiltSubtleDegMin;
    const degMax = isStrongTilt ? config.tiltStrongDegMax : config.tiltSubtleDegMax;
    const degRange = degMin + rnd1 * (degMax - degMin);
    const zSign = index % 2 === 0 ? 1 : -1;
    const baseRotZ = ((degRange * zSign * Math.PI) / 180) * config.tiltVarianceMultiplier;

    // Small tilts on X and Y (1 to 3.5 degrees)
    const xyRadMax = (3.5 * Math.PI) / 180 * config.tiltVarianceMultiplier;
    const baseRotX = (rnd2 * 2 - 1) * xyRadMax;
    const baseRotY = (rnd3 * 2 - 1) * xyRadMax;

    // Staggered intro delay (spread over 0 to 0.8s)
    const staggerDelay = (index / cards.length) * config.introStaggerMaxSec;

    const width = config.cardBaseWidth;
    const height = width / item.aspectRatio;

    return {
      item,
      anchorX,
      anchorY,
      anchorZ,
      baseRotX,
      baseRotY,
      baseRotZ,
      phaseOffset: index * 1.55 + rnd1 * 3.0,
      staggerDelay,
      width,
      height,
      isStrongTilt,
      isNearCard: slot.isNear,
    };
  });
}
