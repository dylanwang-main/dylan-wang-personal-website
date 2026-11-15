/**
 * ARCHIVE: a numbered list of things I use, used to use, or want to try.
 *   using   = in rotation right now
 *   retired = loved it, moved on (honesty makes the list believable)
 *   want    = haven't tried yet (an "antilibrary")
 *
 * Items marked draft: true are prompts. Replace them with your real picks.
 * Numbers are assigned automatically in the order below, so reorder freely.
 */
import { ArchiveCategory } from './types';

export const ARCHIVE: ArchiveCategory[] = [
  {
    slug: 'gear',
    title: 'Gear',
    blurb: 'What I shoot and edit with. Kept small on purpose.',
    motif: 'viewfinder',
    inks: ['ink', 'rust'],
    items: [
      { name: 'Blackmagic Camera app', oneLiner: 'Records everything. ProRes 422 LT, Apple Log, 4K.', status: 'using' },
      { name: 'DaVinci Resolve Studio', oneLiner: 'Where every video gets cut and graded.', status: 'using' },
      { name: '24mm', oneLiner: 'Default for b-roll. Wide enough to show where I am.', status: 'using' },
      { name: '48mm', oneLiner: 'Talking head and UGC. Closer and calmer.', status: 'using' },
      { name: 'Fill in: your mic', oneLiner: 'What you record voice with, and why.', status: 'using', draft: true },
      { name: 'Fill in: the gear you want next', oneLiner: 'The thing on your wishlist.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'tools',
    title: 'Tools',
    blurb: 'Software that holds my life together.',
    motif: 'notebook',
    inks: ['sky', 'ink'],
    items: [
      { name: 'Notion', oneLiner: 'Content ideas bank. One checkbox: done or not.', status: 'using' },
      { name: 'ClickUp', oneLiner: 'Three spaces: Academics, Business, Personal.', status: 'using' },
      { name: 'Claude', oneLiner: 'Planning, writing prompts, and building this site with me.', status: 'using' },
      { name: 'Google AI Studio', oneLiner: 'Where the 3D drift on the home page was first prototyped.', status: 'retired' },
      { name: 'WordPress + Elementor', oneLiner: 'What the N10 Dance Studios site runs on.', status: 'using' },
    ],
  },
  {
    slug: 'places',
    title: 'Places',
    blurb: 'Where I have been lately, and how I got there.',
    motif: 'trolley',
    inks: ['rust', 'sky'],
    items: [
      { name: 'Japan', oneLiner: 'Group trip, summer 2026. Still editing the footage.', status: 'retired', since: '2026' },
      { name: 'Yosemite', oneLiner: 'Hiking with two friends, summer 2026.', status: 'retired', since: '2026' },
      { name: 'UC San Diego', oneLiner: 'Where I spend most days now.', status: 'using', since: '2026' },
      { name: 'The bus and the trolley', oneLiner: 'No car. Learning San Diego one route at a time.', status: 'using' },
      { name: 'Fill in: a place you want to go next', oneLiner: 'And what you would film there.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'coffee',
    title: 'Coffee',
    blurb: 'Write recipes, not adjectives. Grams, water, roaster.',
    motif: 'cup',
    inks: ['ochre', 'ink'],
    items: [
      { name: 'Fill in: your daily order', oneLiner: 'Exactly what you get, down to the milk.', status: 'using', draft: true },
      { name: 'Fill in: a cafe near campus', oneLiner: 'Where you go to edit.', status: 'using', draft: true },
      { name: 'Fill in: a roaster to try', oneLiner: 'Someone told you about it.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'clothing',
    title: 'Clothing',
    blurb: 'What I actually wear most weeks.',
    motif: 'arch',
    inks: ['moss', 'ink'],
    items: [
      { name: 'Fill in: the piece you wear the most', oneLiner: 'Why it never leaves the rotation.', status: 'using', draft: true },
      { name: 'Fill in: a brand you keep coming back to', oneLiner: 'One sentence on why.', status: 'using', draft: true },
      { name: 'Fill in: something you are saving up for', oneLiner: 'The next one.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'fragrance',
    title: 'Fragrance',
    blurb: 'Notes, seasons, and the one that gets compliments.',
    motif: 'sun',
    inks: ['ochre', 'rust'],
    items: [
      { name: 'Fill in: your signature', oneLiner: 'When you wear it, and what it smells like to you.', status: 'using', draft: true },
      { name: 'Fill in: a retired favorite', oneLiner: 'Why you stopped.', status: 'retired', draft: true },
      { name: 'Fill in: a want', oneLiner: 'The one you keep testing at the store.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'watching',
    title: 'Watching',
    blurb: 'Films and shows I think about after.',
    motif: 'record',
    inks: ['ink', 'sky'],
    items: [
      { name: 'Fill in: a movie you rewatch', oneLiner: 'What you notice every time.', status: 'using', draft: true },
      { name: 'Fill in: a creator whose editing you study', oneLiner: 'What you steal from them.', status: 'using', draft: true },
      { name: 'Fill in: on the list', oneLiner: 'Haven’t watched it yet.', status: 'want', draft: true },
    ],
  },
  {
    slug: 'listening',
    title: 'Listening',
    blurb: 'Albums, artists, and what I edit to.',
    motif: 'record',
    inks: ['rust', 'ink'],
    items: [
      { name: 'Fill in: editing album', oneLiner: 'What plays while you cut.', status: 'using', draft: true },
      { name: 'Fill in: an artist you found this year', oneLiner: 'Where you heard them first.', status: 'using', draft: true },
    ],
  },
  {
    slug: 'reading',
    title: 'Reading',
    blurb: 'Books, newsletters, and Substacks.',
    motif: 'notebook',
    inks: ['moss', 'rust'],
    items: [
      { name: 'Fill in: a book that changed how you work', oneLiner: 'The one idea you kept.', status: 'retired', draft: true },
      { name: 'Fill in: a newsletter you actually open', oneLiner: 'Why it earns the open.', status: 'using', draft: true },
      { name: 'Fill in: to read', oneLiner: 'Sitting on the desk.', status: 'want', draft: true },
    ],
  },
];

export interface NumberedArchiveItem {
  n: number;
  code: string;
  category: ArchiveCategory;
  item: ArchiveCategory['items'][number];
}

/** Flattens the archive into one numbered list (001, 002, ...). */
export function numberedArchive(): NumberedArchiveItem[] {
  let n = 0;
  return ARCHIVE.flatMap((category) =>
    category.items.map((item) => {
      n += 1;
      return { n, code: String(n).padStart(3, '0'), category, item };
    })
  );
}

export const archiveBySlug = (slug: string) => ARCHIVE.find((c) => c.slug === slug);

export const STATUS_LABEL = { using: 'Using', retired: 'Retired', want: 'Want' } as const;
