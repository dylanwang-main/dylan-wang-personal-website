/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DRIFT_CONFIG, PHOTO_CARDS } from '../config';
import { computeCardAnchors } from '../utils/textureLoader';
import { PhotoCard3D } from './PhotoCard3D';

interface PhotoDriftCanvasProps {
  onCardClickNotice: (title: string) => void;
  isTouchDevice: boolean;
  activeConfig: typeof DRIFT_CONFIG;
}

// Internal scene controller that manages camera position, scroll kinematics, and parallax
function DriftCameraController({
  activeConfig,
  isTouchDevice,
  onHoveredCardChange,
  hoveredCardId,
  onClickCard,
  introElapsedTime,
}: {
  activeConfig: typeof DRIFT_CONFIG;
  isTouchDevice: boolean;
  onHoveredCardChange: (id: string | null) => void;
  hoveredCardId: string | null;
  onClickCard: (title: string) => void;
  introElapsedTime: number;
}) {
  const { camera, gl } = useThree();

  // Target camera positions
  const targetZRef = useRef<number>(activeConfig.initialCameraZ);
  const targetParallaxXRef = useRef<number>(0);
  const targetParallaxYRef = useRef<number>(0);

  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingTouchRef = useRef<boolean>(false);

  // Spatial data for all 14 cards
  const cardsData = useMemo(() => computeCardAnchors(PHOTO_CARDS), []);

  useEffect(() => {
    const domElement = gl.domElement;

    // Desktop Mouse Parallax Listener
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      // Normalized coordinates: -1 to +1
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Parallax shifts camera opposite cursor
      targetParallaxXRef.current = -normX * activeConfig.mouseParallaxStrengthX;
      targetParallaxYRef.current = -normY * activeConfig.mouseParallaxStrengthY;
    };

    // Wheel Scroll Listener: moves camera through depth smoothly
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Delta normalization
      const deltaZ = e.deltaY * activeConfig.scrollSensitivity;
      targetZRef.current = THREE.MathUtils.clamp(
        targetZRef.current - deltaZ,
        activeConfig.cameraMinZ,
        activeConfig.cameraMaxZ
      );
    };

    // Touch Event Listeners for Mobile: touch drag to move scene + swipe to scroll depth
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingTouchRef.current = true;
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingTouchRef.current || e.touches.length === 0) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      // Drag to pan parallax
      targetParallaxXRef.current += deltaX * 0.012;
      targetParallaxXRef.current = THREE.MathUtils.clamp(
        targetParallaxXRef.current,
        -activeConfig.mouseParallaxStrengthX * 1.5,
        activeConfig.mouseParallaxStrengthX * 1.5
      );

      // Vertical drag scrolls camera forward / backward through the field
      const depthDelta = deltaY * activeConfig.scrollSensitivity * 1.8;
      targetZRef.current = THREE.MathUtils.clamp(
        targetZRef.current + depthDelta,
        activeConfig.cameraMinZ,
        activeConfig.cameraMaxZ
      );
    };

    const handleTouchEnd = () => {
      isDraggingTouchRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    domElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl.domElement, isTouchDevice, activeConfig]);

  // Per-frame camera easing and drift kinematics
  useFrame((_, delta) => {
    // Silky exponential damping on Z position
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZRef.current,
      activeConfig.scrollLerpFactor * 70,
      delta
    );

    // Silky damping on X & Y parallax
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetParallaxXRef.current,
      activeConfig.mouseParallaxLerp * 70,
      delta
    );

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetParallaxYRef.current,
      activeConfig.mouseParallaxLerp * 70,
      delta
    );

    // Gently aim camera toward center of the field
    camera.lookAt(
      targetParallaxXRef.current * 0.25,
      targetParallaxYRef.current * 0.25,
      camera.position.z - 10
    );
  });

  return (
    <group>
      {cardsData.map((cardData) => (
        <PhotoCard3D
          key={cardData.item.id}
          cardData={cardData}
          anyHovered={hoveredCardId !== null}
          hoveredCardId={hoveredCardId}
          onHoverChange={onHoveredCardChange}
          onClickCard={onClickCard}
          elapsedIntroTime={introElapsedTime}
        />
      ))}
    </group>
  );
}

export function PhotoDriftCanvas({
  onCardClickNotice,
  isTouchDevice,
  activeConfig,
}: PhotoDriftCanvasProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [introElapsed, setIntroElapsed] = useState(0);

  // 1.5s intro timer progress
  useEffect(() => {
    let animId: number;
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setIntroElapsed(elapsed);
      if (elapsed < activeConfig.introDurationSec + 0.5) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeConfig.introDurationSec]);

  return (
    <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{
          position: [0, 0, activeConfig.initialCameraZ],
          fov: activeConfig.cameraFov,
          near: 0.1,
          far: 120,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0xf5f4f1, 1);
          // Match horizon fog seamlessly to warm off-white background [#F5F4F1]
          scene.fog = new THREE.Fog(0xf5f4f1, 35, 75);
        }}
      >
        <ambientLight intensity={1.0} />
        <DriftCameraController
          activeConfig={activeConfig}
          isTouchDevice={isTouchDevice}
          hoveredCardId={hoveredCardId}
          onHoveredCardChange={setHoveredCardId}
          onClickCard={onCardClickNotice}
          introElapsedTime={introElapsed}
        />
      </Canvas>
    </div>
  );
}
