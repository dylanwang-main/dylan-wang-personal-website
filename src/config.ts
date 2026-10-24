/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhotoCardItem {
  id: string;
  image: string;
  fallbackColor: string; // Warm solid fallback if offline or loading
  title: string;
  type: 'photo' | 'video';
  aspectRatio: number; // width / height (e.g. 0.75 for 3:4 portrait)
}

/**
 * ============================================================================
 * TUNABLE DRIFT CONFIGURATION
 * ============================================================================
 * Adjust all visual and tactile feel parameters here.
 */
export const DRIFT_CONFIG = {
  // --- CAMERA & SCROLL ---
  cameraFov: 48,
  initialCameraZ: 14,
  scrollSensitivity: 0.014, // How fast wheel / touch swipe moves the camera
  scrollLerpFactor: 0.055, // Easing smoothness for scroll (lower = more silky/floaty, higher = more responsive)
  cameraMinZ: -42, // Maximum forward penetration into the field
  cameraMaxZ: 20, // Maximum backward retreat

  // --- PARALLAX ---
  mouseParallaxStrengthX: 2.2, // Horizontal camera swing opposite to cursor/touch
  mouseParallaxStrengthY: 1.4, // Vertical camera swing opposite to cursor/touch
  mouseParallaxLerp: 0.045, // Parallax smoothing factor

  // --- IDLE FLOAT ---
  idleFloatSpeed: 0.85, // Overall speed of idle harmonic bobbing
  idleFloatAmplitudeY: 0.16, // Height of idle bobbing
  idleFloatAmplitudeX: 0.08, // Subtle horizontal sway
  idleFloatRotationTilt: 0.02, // Subtle idle rotational breathing (in radians)

  // --- CARD TILTS ---
  // Cards float with a slight random tilt (3 to 12 degrees on Z, small on X and Y)
  tiltRangeZDegMin: 3.5, // Minimum random roll (degrees)
  tiltRangeZDegMax: 11.5, // Maximum random roll (degrees)
  tiltRangeXYDegMax: 4.0, // Maximum pitch/yaw (degrees)

  // --- HOVER BEHAVIOR ---
  hoverScale: 1.08, // Scale multiplier when hovered
  hoverLerpFactor: 0.09, // Speed of straightening and scaling on hover
  dimmedOpacity: 0.38, // Opacity of non-hovered cards when one card is hovered
  normalOpacity: 0.98, // Normal resting opacity of cards

  // --- INITIAL INTRO FADE ---
  introDurationSec: 1.5, // Time over which cards float and fade in on first load
  introPushbackDistance: 6.0, // Cards start slightly deeper and drift forward into rest position

  // --- WORLD SPREAD ---
  cardSpreadX: 18, // Horizontal breadth of the card distribution
  cardSpreadY: 13, // Vertical spread of the card distribution
  fieldDepthZ: 48, // Total depth of the card field (from Z=6 to Z=-42)
  cardBaseWidth: 3.2, // Base world unit width of cards
};

/**
 * ============================================================================
 * 14 PLACEHOLDER CARDS
 * ============================================================================
 * Replace any image URL, title, or type below.
 * Solid warm-toned fallback colors are provided for instant warm visual feel.
 */
export const PHOTO_CARDS: PhotoCardItem[] = [
  {
    id: 'card-1',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E6D3B3',
    title: 'Morning Dune Shadows, Erg Chebbi',
    type: 'photo',
    aspectRatio: 0.75, // 3:4 portrait
  },
  {
    id: 'card-2',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D8C7A5',
    title: 'Golden Hour Tide Pool Study',
    type: 'photo',
    aspectRatio: 0.8,
  },
  {
    id: 'card-3',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E3CBB3',
    title: 'Sunlight Through Fig Leaves (16mm)',
    type: 'video',
    aspectRatio: 0.72,
  },
  {
    id: 'card-4',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#DFBF99',
    title: 'Terracotta Balcony at Noon',
    type: 'photo',
    aspectRatio: 0.78,
  },
  {
    id: 'card-5',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#EAD8C0',
    title: 'Coastal Pine Forest mist',
    type: 'photo',
    aspectRatio: 0.75,
  },
  {
    id: 'card-6',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#CBB292',
    title: 'Winter Birch Reflections',
    type: 'video',
    aspectRatio: 0.7,
  },
  {
    id: 'card-7',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D6C0A4',
    title: 'Campfire Embers & Alpine Ridge',
    type: 'photo',
    aspectRatio: 0.82,
  },
  {
    id: 'card-8',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E8D5BC',
    title: 'Archway in Oaxaca, Late Afternoon',
    type: 'photo',
    aspectRatio: 0.75,
  },
  {
    id: 'card-9',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#DEC5A8',
    title: 'Old Volvo along Highway 101',
    type: 'video',
    aspectRatio: 0.76,
  },
  {
    id: 'card-10',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D3BA9E',
    title: 'Still Life with Quince & Linen',
    type: 'photo',
    aspectRatio: 0.8,
  },
  {
    id: 'card-11',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E2CEB7',
    title: 'Autumn Canopy over Kyoto Path',
    type: 'photo',
    aspectRatio: 0.74,
  },
  {
    id: 'card-12',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D9C2A7',
    title: 'Pasture Dawn in the Val d’Orcia',
    type: 'photo',
    aspectRatio: 0.78,
  },
  {
    id: 'card-13',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E5D1B8',
    title: 'Cypress Tree Geometry, Andalusia',
    type: 'video',
    aspectRatio: 0.72,
  },
  {
    id: 'card-14',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D1B898',
    title: 'Sunbeams in Ancient Redwood Grove',
    type: 'photo',
    aspectRatio: 0.75,
  },
];
