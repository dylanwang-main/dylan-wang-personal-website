/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DRIFT_CONFIG } from '../config';
import { CardSpatialData, createWarmPlaceholderTexture } from '../utils/textureLoader';

interface PhotoCard3DProps {
  cardData: CardSpatialData;
  anyHovered: boolean;
  hoveredCardId: string | null;
  onHoverChange: (id: string | null) => void;
  onClickCard: (title: string) => void;
  elapsedIntroTime: number; // For the initial 1.5s fade-in animation
}

// Module-level scratchpad variables to ensure ZERO Garbage Collection in useFrame loop
const _targetPos = new THREE.Vector3();
const _targetRot = new THREE.Euler();
const _targetScale = new THREE.Vector3();

export function PhotoCard3D({
  cardData,
  anyHovered,
  hoveredCardId,
  onHoverChange,
  onClickCard,
  elapsedIntroTime,
}: PhotoCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { item, anchorX, anchorY, anchorZ, baseRotX, baseRotY, baseRotZ, phaseOffset, width, height } = cardData;

  const isHovered = hoveredCardId === item.id;
  const isDimmed = anyHovered && !isHovered;

  // Initial instant warm fallback texture
  const placeholderTexture = useMemo(() => {
    return createWarmPlaceholderTexture(item.fallbackColor, item.title, item.type);
  }, [item.fallbackColor, item.title, item.type]);

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
        // Keep warm solid placeholder if image network error happens
        console.warn(`[Drift] Fallback used for ${item.title}:`, err);
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [item.image, item.title]);

  // Click animation state
  const [clickPulse, setClickPulse] = useState(0);

  // Frame update: idle float, hover straightening, scaling, dimming, and intro progression
  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Initial 1.5s Intro Transition (fade & float in from background)
    const introProgress = Math.min(1.0, elapsedIntroTime / DRIFT_CONFIG.introDurationSec);
    // Smooth ease-out cubic
    const easedIntro = 1 - Math.pow(1 - introProgress, 3);
    const introZOffset = (1 - easedIntro) * -DRIFT_CONFIG.introPushbackDistance;

    // 2. Idle Harmonic Float
    const floatY = Math.sin(time * DRIFT_CONFIG.idleFloatSpeed + phaseOffset) * DRIFT_CONFIG.idleFloatAmplitudeY;
    const floatX = Math.cos(time * DRIFT_CONFIG.idleFloatSpeed * 0.7 + phaseOffset) * DRIFT_CONFIG.idleFloatAmplitudeX;
    const idleTiltZ = Math.sin(time * DRIFT_CONFIG.idleFloatSpeed * 0.5 + phaseOffset) * DRIFT_CONFIG.idleFloatRotationTilt;
    const idleTiltX = Math.cos(time * DRIFT_CONFIG.idleFloatSpeed * 0.6 + phaseOffset) * (DRIFT_CONFIG.idleFloatRotationTilt * 0.5);

    // 3. Position Calculation
    _targetPos.set(
      anchorX + floatX,
      anchorY + floatY,
      anchorZ + introZOffset
    );

    // Damped interpolation to target position
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, _targetPos.x, 8, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, _targetPos.y, 8, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, _targetPos.z, 8, delta);

    // 4. Hover Straightening Behavior:
    // When hovered, card straightens to face the viewer (tilts lerp toward 0).
    // When not hovered, it stays at its slight random tilt (3-12 deg on Z, small on X/Y) + subtle idle drift.
    if (isHovered) {
      _targetRot.set(0, 0, 0); // Perfectly straight facing viewer
    } else {
      _targetRot.set(baseRotX + idleTiltX, baseRotY, baseRotZ + idleTiltZ);
    }

    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      _targetRot.x,
      DRIFT_CONFIG.hoverLerpFactor * 100,
      delta
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      _targetRot.y,
      DRIFT_CONFIG.hoverLerpFactor * 100,
      delta
    );
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      _targetRot.z,
      DRIFT_CONFIG.hoverLerpFactor * 100,
      delta
    );

    // 5. Hover Scale Behavior (~1.08x) + Click Feedback
    const baseScale = isHovered ? DRIFT_CONFIG.hoverScale : 1.0;
    const currentScaleTarget = baseScale + clickPulse;
    _targetScale.set(currentScaleTarget, currentScaleTarget, 1.0);

    meshRef.current.scale.x = THREE.MathUtils.damp(
      meshRef.current.scale.x,
      _targetScale.x,
      DRIFT_CONFIG.hoverLerpFactor * 100,
      delta
    );
    meshRef.current.scale.y = THREE.MathUtils.damp(
      meshRef.current.scale.y,
      _targetScale.y,
      DRIFT_CONFIG.hoverLerpFactor * 100,
      delta
    );

    // Decay click pulse
    if (clickPulse > 0.001) {
      setClickPulse((prev) => Math.max(0, prev - delta * 0.8));
    }

    // 6. Opacity & Dimming Behavior:
    // On load: fades in from 0 to 1 over 1.5s
    // On hover: non-hovered cards dim smoothly to dimmedOpacity (0.38)
    const maxTargetOpacity = isDimmed ? DRIFT_CONFIG.dimmedOpacity : DRIFT_CONFIG.normalOpacity;
    const finalTargetOpacity = maxTargetOpacity * easedIntro;

    materialRef.current.opacity = THREE.MathUtils.damp(
      materialRef.current.opacity,
      finalTargetOpacity,
      7,
      delta
    );
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHoverChange(item.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    if (hoveredCardId === item.id) {
      onHoverChange(null);
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Tactile micro-expansion
    setClickPulse(0.06);
    // Explicit prompt requirement: "Click: for now, just log the card title to the console."
    console.log(`[Photo Drift Card Clicked]: "${item.title}" (${item.type})`);
    onClickCard(item.title);
  };

  return (
    <mesh
      ref={meshRef}
      position={[anchorX, anchorY, anchorZ - DRIFT_CONFIG.introPushbackDistance]}
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
