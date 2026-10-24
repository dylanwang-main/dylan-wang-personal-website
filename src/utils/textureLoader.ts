/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { DRIFT_CONFIG, PhotoCardItem } from '../config';

export interface CardSpatialData {
  item: PhotoCardItem;
  // Resting position
  anchorX: number;
  anchorY: number;
  anchorZ: number;
  // Base random tilts (radians)
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  // Phase offset for idle float
  phaseOffset: number;
  width: number;
  height: number;
}

/**
 * Procedurally generates an instant solid warm canvas texture.
 * Guaranteed to display instantly with zero network delay or blank frames.
 */
export function createWarmPlaceholderTexture(hexColor: string, title: string, type: 'photo' | 'video'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Fill warm base
  ctx.fillStyle = hexColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle interior warm gradient for tactile depth
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle minimalist type indicator in center
  ctx.fillStyle = 'rgba(26, 26, 26, 0.35)';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(type === 'video' ? '▶ VIDEO' : 'PHOTO', canvas.width / 2, canvas.height / 2 - 14);

  ctx.font = '400 18px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(26, 26, 26, 0.28)';
  const displayTitle = title.length > 28 ? title.slice(0, 26) + '...' : title;
  ctx.fillText(displayTitle, canvas.width / 2, canvas.height / 2 + 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Computes organic, balanced 3D spatial anchors for the 14 cards so they form
 * a natural, exploratory drift through depth without overlapping collisions.
 */
export function computeCardAnchors(cards: PhotoCardItem[]): CardSpatialData[] {
  // Pre-calculated organic anchor offsets (spread across field)
  // X: -7 to +7, Y: -4 to +4, Z: -2 to -38
  const baseAnchors = [
    { x: -3.8, y: 1.4, z: 2.0 },
    { x: 3.4, y: -1.2, z: 0.5 },
    { x: -1.2, y: -2.2, z: -3.0 },
    { x: 2.6, y: 2.0, z: -5.5 },
    { x: -4.5, y: -0.8, z: -8.0 },
    { x: 0.5, y: 1.6, z: -11.0 },
    { x: 4.2, y: -1.8, z: -14.0 },
    { x: -3.2, y: 2.2, z: -17.5 },
    { x: 1.8, y: -2.4, z: -20.5 },
    { x: -1.6, y: -0.4, z: -23.5 },
    { x: 3.9, y: 1.5, z: -27.0 },
    { x: -4.0, y: -2.0, z: -30.5 },
    { x: 0.8, y: 2.4, z: -34.0 },
    { x: -2.2, y: 1.0, z: -37.5 },
  ];

  return cards.map((item, index) => {
    const anchor = baseAnchors[index % baseAnchors.length];
    
    // Deterministic pseudo-random variation based on index
    const seed = (index * 9301 + 49297) % 233280;
    const rnd1 = seed / 233280;
    const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
    const rnd3 = ((seed * 12345 + 6789) % 233280) / 233280;

    // Tilt calculations
    // About 3 to 12 degrees on rotation Z
    const zDegMagnitude = DRIFT_CONFIG.tiltRangeZDegMin + rnd1 * (DRIFT_CONFIG.tiltRangeZDegMax - DRIFT_CONFIG.tiltRangeZDegMin);
    const zSign = index % 2 === 0 ? 1 : -1;
    const baseRotZ = (zDegMagnitude * zSign * Math.PI) / 180;

    // Small tilt on X and Y (about 1 to 4 degrees)
    const xyMaxRad = (DRIFT_CONFIG.tiltRangeXYDegMax * Math.PI) / 180;
    const baseRotX = (rnd2 * 2 - 1) * xyMaxRad;
    const baseRotY = (rnd3 * 2 - 1) * xyMaxRad;

    // Dimensions based on aspect ratio
    const width = DRIFT_CONFIG.cardBaseWidth;
    const height = width / item.aspectRatio;

    return {
      item,
      anchorX: anchor.x,
      anchorY: anchor.y,
      anchorZ: anchor.z,
      baseRotX,
      baseRotY,
      baseRotZ,
      phaseOffset: index * 1.45 + rnd1 * 2.0,
      width,
      height,
    };
  });
}
