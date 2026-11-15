/**
 * Builds the floating cards from the content files, and lays them out in 3D.
 * Anything with inDrift: true shows up automatically.
 */
import { ARCHIVE } from '../content/archive';
import { CONTENT } from '../content/content';
import { LAB } from '../content/lab';
import { SECTIONS } from '../content/site';
import type { Media, SectionId } from '../content/types';
import { WORK } from '../content/work';
import { mulberry32 } from '../lib/art';
import type { DriftConfig } from './config';

export interface DriftCard {
  id: string;
  title: string;
  section: SectionId;
  href: string;
  media: Media;
  frame: number;
}

const ARCHIVE_IN_DRIFT = ['gear', 'places', 'coffee', 'listening'];

export function buildDriftCards(): DriftCard[] {
  const cards: Omit<DriftCard, 'frame'>[] = [
    ...WORK.filter((w) => w.inDrift).map((w) => ({
      id: `work-${w.slug}`,
      title: w.title,
      section: 'work' as const,
      href: `/work/${w.slug}`,
      media: w.cover,
    })),
    ...CONTENT.filter((c) => c.inDrift).map((c) => ({
      id: `content-${c.slug}`,
      title: c.title,
      section: 'content' as const,
      href: `/content/${c.slug}`,
      media: c.cover,
    })),
    ...LAB.filter((l) => l.inDrift).map((l) => ({
      id: `lab-${l.slug}`,
      title: l.title,
      section: 'lab' as const,
      href: `/lab#${l.slug}`,
      media: l.cover,
    })),
    ...ARCHIVE.filter((a) => ARCHIVE_IN_DRIFT.includes(a.slug)).map((a) => ({
      id: `archive-${a.slug}`,
      title: a.title,
      section: 'archive' as const,
      href: `/archive#${a.slug}`,
      media: { alt: `Archive: ${a.title}`, motif: a.motif, inks: a.inks, aspect: 0.8, caption: `Archive · ${a.title}` } as Media,
    })),
    {
      id: 'about-tennis',
      title: 'Captain, coach, mentor',
      section: 'about',
      href: '/about',
      media: { alt: 'About: tennis', motif: 'court', inks: ['rust', 'ochre'], aspect: 0.8, caption: 'About · where it started' },
    },
    {
      id: 'about-door',
      title: 'Hi, I’m Dylan',
      section: 'about',
      href: '/about',
      media: { alt: 'About: the front door', motif: 'arch', inks: ['moss', 'ink'], aspect: 0.78, caption: 'About · the front door' },
    },
    {
      id: 'now-trolley',
      title: 'Learning San Diego by trolley',
      section: 'now',
      href: '/now',
      media: { alt: 'Now: trolley', motif: 'trolley', inks: ['rust', 'sky'], aspect: 0.8, animated: true, caption: 'Now · getting around' },
    },
    {
      id: 'now-sun',
      title: 'What I’m doing now',
      section: 'now',
      href: '/now',
      media: { alt: 'Now: sunset', motif: 'sun', inks: ['ochre', 'rust'], aspect: 0.8, animated: true, caption: 'Now · San Diego' },
    },
  ];
  return cards.map((c, i) => ({ ...c, frame: i + 1 }));
}

export interface PlacedCard {
  card: DriftCard;
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  width: number;
  height: number;
  phase: number;
  stagger: number;
}

export const bandCenter = (sectionIndex: number, cfg: DriftConfig) => -sectionIndex * cfg.bandSpacing;

/**
 * Places each card inside its section's depth band. Within a band, positions
 * are picked with best-candidate sampling so cards spread out instead of piling
 * up, and the bottom-center (where the wheel sits) is avoided.
 */
export function layoutCards(cards: DriftCard[], cfg: DriftConfig, viewportAspect: number): PlacedCard[] {
  const rnd = mulberry32(20261115);
  const narrow = viewportAspect < 1;
  const sx = narrow ? Math.max(2.4, cfg.spreadX * viewportAspect * 0.55) : cfg.spreadX * Math.min(1.15, viewportAspect / 1.75);
  const sy = narrow ? cfg.spreadY * 1.35 : cfg.spreadY;
  const sizeScale = narrow ? 0.62 : 1;
  const placed: PlacedCard[] = [];

  SECTIONS.forEach((section, si) => {
    const group = cards.filter((c) => c.section === section.id);
    const center = bandCenter(si, cfg);
    const inBand: { x: number; y: number; z: number }[] = [];

    group.forEach((card, gi) => {
      let best = { x: 0, y: 0, score: -Infinity };
      for (let k = 0; k < 40; k++) {
        const x = (rnd() * 2 - 1) * sx;
        const y = (rnd() * 2 - 1) * sy;
        let minD = Infinity;
        for (const p of inBand) minD = Math.min(minD, Math.hypot((x - p.x) / sx, (y - p.y) / sy));
        if (!inBand.length) minD = 1 - Math.hypot(x / sx, y / sy) * 0.3;
        let score = minD;
        // keep clear of the wheel (bottom center) and the very middle on the first card
        if (y < -sy * 0.45 && Math.abs(x) < sx * 0.45) score -= 0.8;
        if (Math.abs(x) < sx * 0.2 && Math.abs(y) < sy * 0.25) score -= 0.25;
        // and the bottom corners, where the footer text lives
        if (y < -sy * 0.55 && Math.abs(x) > sx * 0.7) score -= 0.6;
        // and the top band, where the name and links sit
        if (y > sy * 0.8) score -= 0.4;
        if (score > best.score) best = { x, y, score };
      }
      const z = center + cfg.bandDepth / 2 - (gi / Math.max(1, group.length - 1 || 1)) * cfg.bandDepth + (rnd() - 0.5) * 1.5;
      inBand.push({ x: best.x, y: best.y, z });

      const strong = rnd() < 0.25;
      const deg = (strong ? 8 + rnd() * (cfg.tiltStrongMax - 8) : 2 + rnd() * (cfg.tiltSubtleMax - 2)) * (rnd() < 0.5 ? -1 : 1);
      const xy = (3.5 * Math.PI) / 180;
      const width = cfg.cardBaseWidth * sizeScale * (1 + (rnd() * 2 - 1) * cfg.cardSizeJitter);
      const aspect = card.media.aspect ?? 0.8;

      placed.push({
        card,
        x: best.x,
        y: best.y,
        z,
        rotZ: ((deg * Math.PI) / 180) * cfg.tiltVariance,
        rotX: (rnd() * 2 - 1) * xy * cfg.tiltVariance,
        rotY: (rnd() * 2 - 1) * xy * cfg.tiltVariance,
        width,
        height: width / aspect,
        phase: rnd() * Math.PI * 2,
        stagger: 0,
      });
    });
  });

  // Intro: nearest cards appear first
  const zs = placed.map((p) => p.z);
  const zMax = Math.max(...zs);
  const zMin = Math.min(...zs);
  placed.forEach((p) => {
    p.stagger = ((zMax - p.z) / Math.max(1, zMax - zMin)) * cfg.introStaggerSec;
  });
  return placed;
}
