/**
 * ============================================================================
 * DRIFT FEEL SETTINGS
 * ============================================================================
 * Every number that controls how the home page moves. Open the site with
 * ?tune at the end of the URL (or run it locally) to get live sliders, then
 * hit "Copy settings" and paste the values back in here.
 *
 * How the space is laid out: each wheel section is a "room" (a depth band).
 * Work is closest, Now is deepest. Turning the wheel flies the camera to that
 * room; scrolling through the space turns the wheel to match.
 */
export const DRIFT_CONFIG = {
  // --- CAMERA & SCROLL ---
  cameraFov: 46,
  scrollSensitivity: 0.014, // How far one scroll tick travels
  scrollDamping: 3.6, // Higher = camera catches up to scroll faster
  focusDistance: 16, // How far in front of a room the camera parks

  // --- ROOMS (depth bands) ---
  bandSpacing: 16, // Distance between rooms
  bandDepth: 8, // How deep each room is
  spreadX: 8.6, // Half-width of the field (scaled down on narrow screens)
  spreadY: 3.7, // Half-height of the field

  // --- PARALLAX ---
  parallaxX: 1.8,
  parallaxY: 1.1,
  parallaxDamping: 2.6,

  // --- IDLE FLOAT ---
  idleSpeed: 0.9,
  idleAmpY: 0.26,
  idleAmpX: 0.12,
  idleTilt: 0.04,

  // --- CARDS ---
  cardBaseWidth: 2.75,
  cardSizeJitter: 0.28, // 0.28 = sizes vary ±28%
  tiltSubtleMax: 6, // degrees, most cards
  tiltStrongMax: 13, // degrees, about 1 in 4 cards
  tiltVariance: 1.0,
  hoverScale: 1.08,
  inactiveOpacity: 0.5, // Cards outside the active room
  hoverDimOpacity: 0.32, // Other cards while one is hovered

  // --- INTRO ---
  introHoldSec: 0.9, // Empty cream screen with just the tagline
  introFadeSec: 1.4,
  introStaggerSec: 0.9,

  // --- WHEEL ---
  wheelSensitivity: 0.0028, // Higher = a smaller flick steps one section
  wheelSnapStrength: 0.08, // Spring tightness when settling
  wheelInertiaDamping: 0.93, // How far a drag-and-release fling carries
  wheelStepCooldownMs: 380, // Stops trackpad momentum from skipping sections
  wheelVisibleFraction: 0.4, // How much of the wheel peeks above the bottom edge
};

export type DriftConfig = typeof DRIFT_CONFIG;
