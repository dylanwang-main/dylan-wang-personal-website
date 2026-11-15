/**
 * LAB: in-progress stuff, with honest growth stages.
 *   seedling  = just an idea or a first sketch
 *   growing   = actively working on it
 *   evergreen = done enough that I use it every day
 *   paused    = parked, maybe coming back
 * Update `updated` and add a line to `notes` whenever something moves.
 */
import { LabItem } from './types';

export const LAB: LabItem[] = [
  {
    slug: 'this-website',
    title: 'This website',
    stage: 'growing',
    started: '2026-10-24',
    updated: '2026-11-15',
    summary: 'A personal site that feels like a room, not a résumé. Floating photos, a wheel for a menu, and too many small details.',
    tags: ['React', 'Three.js', 'Design'],
    inDrift: true,
    cover: {
      alt: 'Placeholder art: tilted cards floating in space',
      motif: 'grid',
      inks: ['ink', 'rust'],
      aspect: 0.8,
      animated: true,
      caption: 'This site · v0.1 · Nov 2026',
    },
    notes: [
      'Started from two sites I love: a friend’s personal archive and a photographer’s floating gallery.',
      'Prototyped the 3D drift in Google AI Studio, then rebuilt it properly in React Three Fiber.',
      'The bottom wheel took three tries. One scroll now moves exactly one section.',
      'v0.1: every section has a real page. Next: real photos instead of the printed placeholders.',
    ],
    next: 'Swap the placeholder art for real photos and clips.',
    links: [{ label: 'Changelog', href: '/changelog' }, { label: 'Colophon', href: '/colophon' }],
  },
  {
    slug: 'hook-tracker',
    title: 'Hook tracker',
    stage: 'growing',
    started: '2026',
    updated: '2026-11',
    summary: 'Logging every reel’s hook and how it did, to find out what actually holds people. My first data project about my own life.',
    tags: ['Data', 'Instagram', 'Analytics'],
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a retention bar chart',
      motif: 'bars',
      inks: ['moss', 'ink'],
      aspect: 0.8,
      caption: 'Hook tracker · reel retention, roughly',
    },
    notes: [
      'Each reel gets a row: the hook, the topic, and how it performed.',
      'Biggest finding so far: views were not my problem. Profile visits were. People watched and then left.',
      'So now I track two things separately: did the hook hold, and did anyone come back for more.',
    ],
    next: 'Turn the log into a chart I can actually show here.',
  },
  {
    slug: 'huddle',
    title: 'Huddle',
    stage: 'seedling',
    started: '2026',
    updated: '2026',
    summary: 'An iOS app for coordinating group hangouts, because the group chat is where plans go to die.',
    tags: ['SwiftUI', 'iOS', 'App idea'],
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a notebook sketch',
      motif: 'notebook',
      inks: ['sky', 'ink'],
      aspect: 0.8,
      caption: 'Huddle · first sketches',
    },
    notes: [
      'The idea: one place to pick a time and a spot with friends, without fifty messages.',
      'Planned in SwiftUI. Also a good excuse to make content about building it.',
    ],
    next: 'Sketch the three main screens.',
  },
  {
    slug: 'ideas-bank',
    title: 'Content ideas bank',
    stage: 'evergreen',
    started: '2026',
    updated: '2026',
    summary: 'Every video idea I have, in one Notion database with exactly one checkbox.',
    tags: ['Notion', 'Systems'],
    cover: {
      alt: 'Placeholder art: a checklist',
      motif: 'notebook',
      inks: ['ochre', 'ink'],
      aspect: 0.8,
      caption: 'Notion · ideas bank',
    },
    notes: [
      'Done or not done. I tried fancier setups with stages and tags, and I stopped opening them.',
      'Ideas get written down the second I have them, even if they are bad.',
    ],
  },
  {
    slug: 'three-spaces',
    title: 'Three spaces',
    stage: 'growing',
    started: '2026',
    updated: '2026',
    summary: 'Running my life in ClickUp with three spaces: Academics, Business, Personal.',
    tags: ['ClickUp', 'Systems'],
    cover: {
      alt: 'Placeholder art: three stacked blocks',
      motif: 'grid',
      inks: ['moss', 'ochre'],
      aspect: 0.8,
      caption: 'ClickUp · three spaces',
    },
    notes: [
      'Academics for classes, Business for content and client work, Personal for everything else.',
      'Rule I am testing: if it does not fit one of the three, I probably should not be doing it.',
    ],
  },
  {
    slug: 'student-data-teams',
    title: 'Joining a student data team',
    stage: 'seedling',
    started: '2026-09',
    updated: '2026-10',
    summary: 'Applied to a few UCSD data science project teams this fall to get hands-on work in.',
    tags: ['UCSD', 'Data science'],
    draft: true,
    cover: {
      alt: 'Placeholder art: a scatter of data points',
      motif: 'bars',
      inks: ['sky', 'rust'],
      aspect: 0.8,
      caption: 'UCSD · fall 2026',
    },
    notes: [
      'Applied to DS3 projects (SpeakUp, a speech feedback tool, and ParkSmart) and to DataWorks for growth and strategy work.',
      'Fill in: how it went, and what you are working on now.',
    ],
  },
];

export const STAGE_LABEL: Record<LabItem['stage'], string> = {
  seedling: 'Seedling',
  growing: 'Growing',
  evergreen: 'Evergreen',
  paused: 'Paused',
};

export const STAGE_GLYPH: Record<LabItem['stage'], string> = {
  seedling: '·',
  growing: '∴',
  evergreen: '✳',
  paused: '‖',
};
