/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CardType = 'photo' | 'video';

export interface PhotoCardItem {
  id: string;
  image: string;
  fallbackColor: string; // Warm solid fallback if offline or loading
  title: string;
  caption: string; // Placeholder caption
  type: CardType;
  section: string; // One of the 6 sections
  aspectRatio: number; // width / height (e.g. 0.75 for 3:4 portrait)
}

export const SECTIONS = [
  '[SECTION 1]',
  '[SECTION 2]',
  '[SECTION 3]',
  '[SECTION 4]',
  '[SECTION 5]',
  '[SECTION 6]',
] as const;

export type SectionName = (typeof SECTIONS)[number];

export const SECTION_DESCRIPTIONS: Record<string, string> = {
  '[SECTION 1]':
    '[SECTION DESCRIPTION] An exploration of light, architectural form, and fleeting ambient moments captured across varied environments.',
  '[SECTION 2]':
    '[SECTION DESCRIPTION] Visual studies focused on stillness, earth tones, tactile materials, and spatial balance.',
  '[SECTION 3]':
    '[SECTION DESCRIPTION] Motion vignettes, short continuous recordings, and atmospheric video documentation.',
  '[SECTION 4]':
    '[SECTION DESCRIPTION] Curated series in natural geometries, forest shadows, and organic textures.',
  '[SECTION 5]':
    '[SECTION DESCRIPTION] Photographic journals, travel impressions, and quiet coastal documentary stills.',
  '[SECTION 6]':
    '[SECTION DESCRIPTION] Personal archive, ongoing prototype experiments, and engineering reflections.',
};

/**
 * ============================================================================
 * TUNABLE DRIFT CONFIGURATION
 * ============================================================================
 * Adjust all visual and tactile feel parameters here.
 */
export const DRIFT_CONFIG = {
  // --- CAMERA & SCROLL ---
  cameraFov: 46,
  initialCameraZ: 14,
  scrollSensitivity: 0.014, // How fast wheel / touch swipe moves the camera
  scrollLerpFactor: 0.055, // Easing smoothness for scroll (lower = more silky/floaty)
  cameraMinZ: -48, // Maximum forward penetration into the field
  cameraMaxZ: 20, // Maximum backward retreat

  // --- PARALLAX ---
  mouseParallaxStrengthX: 2.2, // Horizontal camera swing opposite to cursor/touch
  mouseParallaxStrengthY: 1.4, // Vertical camera swing opposite to cursor/touch
  mouseParallaxLerp: 0.045, // Parallax smoothing factor

  // --- IDLE FLOAT & BREATHE ---
  // Default increased so scene visibly breathes when nothing is happening
  idleFloatSpeed: 1.05, // Speed of idle harmonic oscillation
  idleFloatAmplitudeY: 0.30, // Height of idle bobbing
  idleFloatAmplitudeX: 0.14, // Subtle horizontal sway
  idleFloatRotationTilt: 0.045, // Subtle idle rotational wobble (in radians)

  // --- CARD TILTS ---
  // Most cards: subtle tilt (2 to 6 deg), ~1 in 4 gets stronger tilt (8 to 14 deg)
  tiltSubtleDegMin: 2.0,
  tiltSubtleDegMax: 6.0,
  tiltStrongDegMin: 8.0,
  tiltStrongDegMax: 14.0,
  tiltVarianceMultiplier: 1.0, // Tuner slider for overall tilt variance

  // --- HOVER BEHAVIOR ---
  hoverScale: 1.08, // Scale multiplier when hovered
  hoverLerpFactor: 0.09, // Speed of straightening and scaling on hover
  dimmedOpacity: 0.35, // Opacity of non-active / non-hovered cards
  normalOpacity: 0.98, // Normal resting opacity of cards

  // --- INTRO TIMING (Polish: start empty with tagline for ~1s, then fade in) ---
  taglineOnlyDurationSec: 1.0, // Empty cream screen showing only tagline
  cardsFadeInDurationSec: 1.5, // Cards fade in duration after initial delay
  introStaggerMaxSec: 0.8, // Stagger spread between cards

  // --- WORLD SPREAD & DEPTH (Poisson-disc style distributed) ---
  cardSpreadMultiplier: 1.0, // Tuner slider for horizontal/vertical spread
  depthRangeMultiplier: 1.0, // Tuner slider for depth span
  cardBaseWidth: 3.3, // Base world unit width of cards
  sectionFocusAdvanceZ: 4.0, // Distance active section cards ease toward camera
  sectionUnfocusedRetreatZ: -4.5, // Distance non-section cards retreat

  // --- BOTTOM SECTION WHEEL TUNING ---
  wheelSensitivity: 0.0028, // Higher = a smaller scroll flick is enough to step one section
  wheelSnapStrength: 0.08, // Spring tightness when the wheel settles on a section
  wheelInertiaDamping: 0.93, // How far a drag-and-release fling carries before settling
  wheelStepCooldownMs: 380, // Minimum time between scroll steps (stops trackpad momentum skipping sections)
  wheelVisibleFraction: 0.4, // How much of the wheel's height shows above the bottom edge (rest is clipped)
};

/**
 * ============================================================================
 * 14 PLACEHOLDER CARDS
 * ============================================================================
 * Each card tagged with one of the 6 sections, with title, caption, and type.
 */
export const PHOTO_CARDS: PhotoCardItem[] = [
  {
    id: 'card-1',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E6D3B3',
    title: 'Morning Dune Shadows, Erg Chebbi',
    caption: '[CARD CAPTION] Wind-carved crests under low-angle sunrise in the eastern Sahara.',
    type: 'photo',
    section: '[SECTION 1]',
    aspectRatio: 0.75,
  },
  {
    id: 'card-2',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D8C7A5',
    title: 'Golden Hour Tide Pool Study',
    caption: '[CARD CAPTION] Salt-film reflections and wet basalt along the Mendocino coast.',
    type: 'photo',
    section: '[SECTION 2]',
    aspectRatio: 0.8,
  },
  {
    id: 'card-3',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E3CBB3',
    title: 'Sunlight Through Fig Leaves (16mm)',
    caption: '[CARD CAPTION] Looping ambient 16mm motion study in an Andalusian courtyard.',
    type: 'video',
    section: '[SECTION 3]',
    aspectRatio: 0.72,
  },
  {
    id: 'card-4',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#DFBF99',
    title: 'Terracotta Balcony at Noon',
    caption: '[CARD CAPTION] Rhythmic shadows cast by cedar balustrades in midday sun.',
    type: 'photo',
    section: '[SECTION 1]',
    aspectRatio: 0.78,
  },
  {
    id: 'card-5',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#EAD8C0',
    title: 'Coastal Pine Forest Mist',
    caption: '[CARD CAPTION] Morning condensation hanging between sea cliffs and old growth.',
    type: 'photo',
    section: '[SECTION 4]',
    aspectRatio: 0.75,
  },
  {
    id: 'card-6',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#CBB292',
    title: 'Winter Birch Reflections',
    caption: '[CARD CAPTION] Subtle water ripple documentation on frozen lake margin.',
    type: 'video',
    section: '[SECTION 3]',
    aspectRatio: 0.7,
  },
  {
    id: 'card-7',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D6C0A4',
    title: 'Campfire Embers & Alpine Ridge',
    caption: '[CARD CAPTION] Long-exposure night study at timberline in the North Cascades.',
    type: 'photo',
    section: '[SECTION 5]',
    aspectRatio: 0.82,
  },
  {
    id: 'card-8',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E8D5BC',
    title: 'Archway in Oaxaca, Late Afternoon',
    caption: '[CARD CAPTION] Lime-washed adobe surfaces reflecting warm golden bounce light.',
    type: 'photo',
    section: '[SECTION 2]',
    aspectRatio: 0.75,
  },
  {
    id: 'card-9',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#DEC5A8',
    title: 'Old Volvo along Highway 101',
    caption: '[CARD CAPTION] Continuous travel camera footage crossing the Big Sur headlands.',
    type: 'video',
    section: '[SECTION 6]',
    aspectRatio: 0.76,
  },
  {
    id: 'card-10',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D3BA9E',
    title: 'Still Life with Quince & Linen',
    caption: '[CARD CAPTION] Studio observation of unbleached flax and seasonal fruit.',
    type: 'photo',
    section: '[SECTION 2]',
    aspectRatio: 0.8,
  },
  {
    id: 'card-11',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E2CEB7',
    title: 'Autumn Canopy over Kyoto Path',
    caption: '[CARD CAPTION] Dappled scarlet maples along the stone drainage path of Nanzen-ji.',
    type: 'photo',
    section: '[SECTION 4]',
    aspectRatio: 0.74,
  },
  {
    id: 'card-12',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D9C2A7',
    title: 'Pasture Dawn in the Val d’Orcia',
    caption: '[CARD CAPTION] Rolling clay hills emerging from morning thermal valley fog.',
    type: 'photo',
    section: '[SECTION 5]',
    aspectRatio: 0.78,
  },
  {
    id: 'card-13',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#E5D1B8',
    title: 'Cypress Tree Geometry, Andalusia',
    caption: '[CARD CAPTION] High vertical silhouettes contrasting horizontal wheat terraces.',
    type: 'photo',
    section: '[SECTION 6]',
    aspectRatio: 0.72,
  },
  {
    id: 'card-14',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop',
    fallbackColor: '#D1B898',
    title: 'Sunbeams in Ancient Redwood Grove',
    caption: '[CARD CAPTION] Volumetric shafts of light breaking through canopy fog.',
    type: 'photo',
    section: '[SECTION 1]',
    aspectRatio: 0.75,
  },
];
