/**
 * CHANGELOG: one line per meaningful change. Newest first.
 * It doubles as proof the site is alive.
 */
import { ChangelogEntry } from './types';

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-15',
    version: '0.1',
    title: 'Every section gets a real page',
    notes: [
      'Work, Content, Lab, Archive, About, and Now pages, plus this changelog and a colophon.',
      'The wheel now opens sections, and every floating card opens its own page.',
      'Placeholder art that is drawn about each topic, until the real photos go in.',
      'Index menu (press / or ⌘K), paper grain, and a reduced-motion version of the home page.',
    ],
  },
  {
    date: '2026-10-24',
    version: '0.0.2',
    title: 'The wheel learns to count',
    notes: [
      'Moved the wheel to the bottom edge, clipped like the reference site.',
      'One scroll now moves exactly one section. Trackpad momentum no longer skips ahead.',
      'One cursor instead of two.',
    ],
  },
  {
    date: '2026-10-24',
    version: '0.0.1',
    title: 'First prototype',
    notes: [
      'Floating 3D photo drift on a cream background, prototyped in Google AI Studio.',
      'A feel tuner with sliders for spread, depth, tilt, and drift speed.',
    ],
  },
];
