/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DRIFT_CONFIG, PhotoCardItem } from '../config';
import {
  CardSpatialData,
  createAnimatedVideoCanvasTexture,
  createWarmPlaceholderTexture,
} from '../utils/textureLoader';

interface PhotoCard3DProps {
  cardData: CardSpatialData;
  activeSection: string;
  anyHovered: boolean;
  hoveredCardId: string | null;
  onHoverChange: (card: PhotoCardItem | null) => void;
  onClickCard: (card: PhotoCardItem) => void;
  introElapsedTime: number;
  config: typeof DRIFT_CONFIG;
}

// Scratchpad variables outside render loop for ZERO Garbage Collection
const _targetPos = new THREE.Vector3();
const _targetRot = new THREE.Euler();
const _targetScale = new THREE.Vector3();

export function PhotoCard3D({
  cardData,
  activeSection,
  anyHovered,
  hoveredCardId,
  onHoverChange,
  onClickCard,
  introElapsedTime,
  config,
}: PhotoCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const {
    item,
    anchorX,
    anchorY,
    anchorZ,
    baseRotX,
    baseRotY,
    baseRotZ,
    phaseOffset,
    staggerDelay,
    width,
    height,
  } = cardData;

  const isHovered = hoveredCardId === item.id;
  const isCardInSection = item.section === activeSection;

  // Video texture generator if type === 'video'
  const videoAnim = useMemo(() => {
    if (item.type === 'video') {
      return createAnimatedVideoCanvasTexture(item.fallbackColor);
    }
    return null;
  }, [item.type, item.fallbackColor]);

  // Initial instant warm fallback texture
  const placeholderTexture = useMemo(() => {
    if (videoAnim) return videoAnim.texture;
    return createWarmPlaceholderTexture(item.fallbackColor, item.title, item.type);
  }, [item.fallbackColor, item.title, item.type, videoAnim]);

  const [activeTexture, setActiveTexture] = useState<THREE.Texture>(placeholderTexture);

  // Lazy-load actual image texture with graceful fallback
  useEffect(() => {
    let isCancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      item.image,
      (loadedTex) => {
        if (!isCancelled) {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTex.generateMipmaps = true;
          loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
          loadedTex.magFilter = THREE.LinearFilter;
          loadedTex.needsUpdate = true;
          setActiveTexture(loadedTex);
        }
      },
      undefined,
      (err) => {
        console.warn(`[Drift] Fallback texture active for ${item.title}:`, err);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [item.image, item.title]);

  const [clickPulse, setClickPulse] = useState(0);

  // Frame loop: breathing drift, section focus z-offset, hover straightening, scaling, and dimming
  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Video canvas texture update
    if (videoAnim) {
      videoAnim.update(time);
    }

    // 2. Intro sequence:
    // Screen remains empty for `taglineOnlyDurationSec` (1s).
    // Then cards fade in with `staggerDelay` over `cardsFadeInDurationSec` (1.5s).
    const effectiveIntroTime = Math.max(0, introElapsedTime - config.taglineOnlyDurationSec - staggerDelay);
    const introProgress = Math.min(1.0, effectiveIntroTime / config.cardsFadeInDurationSec);
    // Cubic ease-out
    const easedIntro = 1 - Math.pow(1 - introProgress, 3);
    const introZPushback = (1 - easedIntro) * -8.0;

    // 3. Section focus behavior:
    // If card matches active section: eases toward camera (+focusAdvanceZ)
    // If not: dims and drifts back (+unfocusedRetreatZ)
    let sectionZOffset = 0;
    if (isCardInSection) {
      sectionZOffset = config.sectionFocusAdvanceZ;
    } else {
      sectionZOffset = config.sectionUnfocusedRetreatZ;
    }

    // 4. Idle harmonic breathing float (increased default so scene visibly breathes)
    const floatY = Math.sin(time * config.idleFloatSpeed + phaseOffset) * config.idleFloatAmplitudeY;
    const floatX = Math.cos(time * config.idleFloatSpeed * 0.65 + phaseOffset) * config.idleFloatAmplitudeX;
    const idleTiltZ = Math.sin(time * config.idleFloatSpeed * 0.45 + phaseOffset) * config.idleFloatRotationTilt;
    const idleTiltX = Math.cos(time * config.idleFloatSpeed * 0.55 + phaseOffset) * (config.idleFloatRotationTilt * 0.5);

    // Target coordinates
    _targetPos.set(
      anchorX + floatX,
      anchorY + floatY,
      anchorZ + sectionZOffset + introZPushback
    );

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, _targetPos.x, 8, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, _targetPos.y, 8, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, _targetPos.z, 7, delta);

    // 5. Rotation:
    // When hovered, card straightens to face the viewer (tilts lerp toward 0).
    // Otherwise, subtle or strong tilt + idle wobble.
    if (isHovered) {
      _targetRot.set(0, 0, 0);
    } else {
      _targetRot.set(baseRotX + idleTiltX, baseRotY, baseRotZ + idleTiltZ);
    }

    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      _targetRot.x,
      config.hoverLerpFactor * 90,
      delta
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      _targetRot.y,
      config.hoverLerpFactor * 90,
      delta
    );
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      _targetRot.z,
      config.hoverLerpFactor * 90,
      delta
    );

    // 6. Scale:
    // Hover scale 1.08x, active section slight boost 1.04x
    let targetBaseScale = 1.0;
    if (isHovered) {
      targetBaseScale = config.hoverScale;
    } else if (isCardInSection) {
      targetBaseScale = 1.04;
    }
    const currentScale = targetBaseScale + clickPulse;
    _targetScale.set(currentScale, currentScale, 1.0);

    meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, _targetScale.x, 10, delta);
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, _targetScale.y, 10, delta);

    if (clickPulse > 0.001) {
      setClickPulse((prev) => Math.max(0, prev - delta * 0.8));
    }

    // 7. Opacity and Dimming:
    // - On intro: fades in from 0 based on easedIntro
    // - Section dimming: non-section cards dim to config.dimmedOpacity (0.35)
    // - Hover dimming: when another card is hovered, non-hovered cards dim
    let targetOpacity = config.normalOpacity;
    if (isHovered) {
      targetOpacity = 1.0;
    } else if (anyHovered) {
      targetOpacity = config.dimmedOpacity * 0.8;
    } else if (!isCardInSection) {
      targetOpacity = config.dimmedOpacity;
    }

    const finalOpacity = targetOpacity * easedIntro;

    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      finalOpacity,
      7,
      delta
    );
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHoverChange(item);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hoveredCardId === item.id) {
      onHoverChange(null);
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClickPulse(0.06);
    console.log(`[Photo Drift Card Clicked]: "${item.title}" (${item.type})`);
    onClickCard(item);
  };

  return (
    <mesh
      ref={meshRef}
      position={[anchorX, anchorY, anchorZ - 8.0]}
      rotation={[baseRotX, baseRotY, baseRotZ]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={activeTexture}
        transparent={true}
        opacity={0.0}
        toneMapped={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
