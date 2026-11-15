/**
 * ============================================================================
 * SITE SETTINGS. Start here.
 * ============================================================================
 * Everything personal lives in /src/content. Edit the text, swap media, ship.
 *
 * Draft markers: anything with `draft: true` gets a dotted rust underline and a
 * small "draft" tag while `showDraftMarkers` is true. That's your to-do list
 * of copy to rewrite in your own words. Flip it to false before launch.
 */
import { SectionId } from './types';

export const site = {
  name: 'Dylan Wang',
  shortName: 'dylan',
  /** Shown in the bottom-left corner and the footer */
  location: 'San Diego, CA',
  /** One of these shows in the top-left corner on each visit. Rotate them seasonally. */
  taglines: [
    "figuring it out\nin public",
    'still on the\nfirst draft',
    'shot on a phone,\nedited for too long',
    'made between\nclasses',
  ],
  /** Plain-language one-liner used on About and in search results */
  oneLiner:
    "I make short videos, study data science at UC San Diego, and keep a running list of things I'm into.",
  /** Leave empty to hide email everywhere. Instagram DMs work as the default contact. */
  email: '',
  socials: [
    { label: 'Instagram', handle: '@dylanwang.main', href: 'https://instagram.com/dylanwang.main' },
    { label: 'TikTok', handle: '@dylanwang_main', href: 'https://www.tiktok.com/@dylanwang_main' },
    { label: 'YouTube', handle: '@dylanwang_main', href: 'https://www.youtube.com/@dylanwang_main' },
  ],
  /** Set when the site has its real domain (used for sitemap and social cards) */
  url: 'https://dylan-wang-personal-website.vercel.app',
  showDraftMarkers: true,
  credit: 'Designed and built by Dylan, with a lot of help from Claude',
};

export interface SectionDef {
  id: SectionId;
  numeral: string;
  label: string;
  path: string;
  /** Room metaphor (Jacky Zhao style): where this lives in the house */
  room: string;
  blurb: string;
}

/** The six stops on the home wheel, in order. */
export const SECTIONS: SectionDef[] = [
  {
    id: 'work',
    numeral: '01',
    label: 'Work',
    path: '/work',
    room: 'the desk',
    blurb: 'Things I did for other people, and what I learned doing them.',
  },
  {
    id: 'content',
    numeral: '02',
    label: 'Content',
    path: '/content',
    room: 'the camera bag',
    blurb: 'Videos and photos, grouped by what they say about me, not by views.',
  },
  {
    id: 'lab',
    numeral: '03',
    label: 'Lab',
    path: '/lab',
    room: 'the workbench',
    blurb: 'Half-built projects and experiments. Some will ship. Some will not.',
  },
  {
    id: 'archive',
    numeral: '04',
    label: 'Archive',
    path: '/archive',
    room: 'the shelf',
    blurb: 'A numbered list of things I use, used to use, or want to try.',
  },
  {
    id: 'about',
    numeral: '05',
    label: 'About',
    path: '/about',
    room: 'the front door',
    blurb: 'Where I came from, what I care about, how to reach me.',
  },
  {
    id: 'now',
    numeral: '06',
    label: 'Now',
    path: '/now',
    room: 'the fridge note',
    blurb: "What I'd tell a friend I hadn't seen in a year.",
  },
];

export const sectionById = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;
