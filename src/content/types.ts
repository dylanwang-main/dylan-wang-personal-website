/**
 * Shared content types. Every page and the 3D drift read from these.
 */

/** Built-in placeholder art motifs (see lib/art.ts). Each one is drawn about its topic. */
export type ArtMotif =
  | 'sun'
  | 'mountains'
  | 'torii'
  | 'court'
  | 'bars'
  | 'viewfinder'
  | 'browser'
  | 'waves'
  | 'cup'
  | 'arch'
  | 'grid'
  | 'trolley'
  | 'plate'
  | 'notebook'
  | 'record'
  | 'dancer';

export type Ink = 'rust' | 'moss' | 'ochre' | 'sky' | 'ink';

/**
 * A picture or clip. Leave `src` empty to show generated placeholder art.
 * Drop real files in /public/media and point `src` at them, e.g. "/media/japan-01.webp".
 */
export interface Media {
  src?: string;
  /** Poster frame for videos (also used as the 3D texture) */
  poster?: string;
  kind?: 'image' | 'video';
  alt: string;
  /** width / height. 0.8 = portrait 4:5, 1.78 = landscape 16:9 */
  aspect?: number;
  motif: ArtMotif;
  inks?: [Ink, Ink];
  /** Animate the placeholder art like a looping clip */
  animated?: boolean;
  /** Caption formula: place · date · what was happening · credit */
  caption?: string;
}

export interface LinkOut {
  label: string;
  href: string;
}

/** A block in a long-form entry */
export type Block =
  | { type: 'p'; text: string; draft?: boolean }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[]; draft?: boolean }
  | { type: 'media'; media: Media[] }
  | { type: 'note'; text: string };

export type SectionId = 'work' | 'content' | 'lab' | 'archive' | 'about' | 'now';

export interface WorkItem {
  slug: string;
  title: string;
  /** The curiosity-led hook (Wattenberger style), not a résumé bullet */
  hook: string;
  role: string;
  when: string;
  tags: string[];
  cover: Media;
  status?: 'ongoing' | 'shipped' | 'paused';
  links?: LinkOut[];
  body: Block[];
  draft?: boolean;
  /** Show in the 3D drift on the home page */
  inDrift?: boolean;
}

export interface ContentItem {
  slug: string;
  title: string;
  kind: 'series' | 'reel' | 'ugc' | 'photo' | 'bts';
  platform: 'instagram' | 'tiktok' | 'youtube' | 'multi';
  when: string;
  summary: string;
  cover: Media;
  /** What it shows about me, used to group pieces instead of view counts */
  theme: string;
  links?: LinkOut[];
  body: Block[];
  draft?: boolean;
  inDrift?: boolean;
}

/** Maggie Appleton style growth stages */
export type Stage = 'seedling' | 'growing' | 'evergreen' | 'paused';

export interface LabItem {
  slug: string;
  title: string;
  stage: Stage;
  started: string;
  updated: string;
  summary: string;
  tags: string[];
  cover: Media;
  notes: string[];
  next?: string;
  links?: LinkOut[];
  draft?: boolean;
  inDrift?: boolean;
}

export type ArchiveStatus = 'using' | 'retired' | 'want';

export interface ArchiveItem {
  name: string;
  oneLiner: string;
  status: ArchiveStatus;
  since?: string;
  link?: string;
  /** true = an example prompt to replace with your own pick */
  draft?: boolean;
}

export interface ArchiveCategory {
  slug: string;
  title: string;
  blurb: string;
  motif: ArtMotif;
  inks: [Ink, Ink];
  items: ArchiveItem[];
}

export interface NowEntry {
  label: string;
  text: string;
  draft?: boolean;
}

export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  notes: string[];
}
