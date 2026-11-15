/**
 * CONTENT: videos and photos.
 * Each piece gets a caption in this order: place · date · what was happening · credit.
 * To use a real clip: export a short muted loop (5 to 8 s, 720p, mp4) into
 * /public/media and set cover.src + cover.kind = 'video' + cover.poster.
 * Link to the original post instead of embedding Instagram (embeds are slow and noisy).
 */
import { ContentItem } from './types';

export const CONTENT: ContentItem[] = [
  {
    slug: 'japan-summer-2026',
    title: 'Japan, summer 2026',
    kind: 'series',
    platform: 'multi',
    when: 'Summer 2026',
    theme: 'Travel, but making it about the people',
    summary: 'A group trip to Japan and a hard drive full of footage I am still cutting down.',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a torii gate at dusk',
      motif: 'torii',
      inks: ['rust', 'ochre'],
      aspect: 0.8,
      animated: true,
      caption: 'Japan · summer 2026 · group trip · shot by me',
    },
    links: [{ label: 'Watch on Instagram', href: 'https://instagram.com/dylanwang.main' }],
    body: [
      {
        type: 'p',
        text: 'This summer I went to Japan with a group of friends. I shot a lot. Probably too much. I am slowly turning it into short pieces.',
      },
      {
        type: 'p',
        draft: true,
        text: 'Fill in: the one moment from the trip you keep coming back to, and the clip that has it.',
      },
      {
        type: 'media',
        media: [
          { alt: 'Placeholder: street at night', motif: 'arch', inks: ['ink', 'ochre'], aspect: 0.8, caption: 'Fill in: place · date' },
          { alt: 'Placeholder: train window', motif: 'waves', inks: ['sky', 'ink'], aspect: 0.8, animated: true, caption: 'Fill in: place · date' },
          { alt: 'Placeholder: shrine', motif: 'torii', inks: ['moss', 'rust'], aspect: 0.8, caption: 'Fill in: place · date' },
        ],
      },
    ],
  },
  {
    slug: 'yosemite',
    title: 'Yosemite with two friends',
    kind: 'series',
    platform: 'instagram',
    when: 'Summer 2026',
    theme: 'Slow, quiet, outside',
    summary: 'A hiking trip with two friends. Less talking to camera, more letting the place talk.',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: layered granite ridges',
      motif: 'mountains',
      inks: ['moss', 'sky'],
      aspect: 0.75,
      caption: 'Yosemite · summer 2026 · hiking trip · shot by me',
    },
    links: [{ label: 'Watch on Instagram', href: 'https://instagram.com/dylanwang.main' }],
    body: [
      {
        type: 'p',
        text: 'A few days hiking in Yosemite with two friends. I wanted this one to feel the way the trip felt: slow, a little tired, very happy.',
      },
      { type: 'p', draft: true, text: 'Fill in: which trail, which day, and the shot you almost did not take.' },
    ],
  },
  {
    slug: 'hook-tests',
    title: 'Same video, different first second',
    kind: 'reel',
    platform: 'instagram',
    when: '2026 · ongoing',
    theme: 'Learning in public',
    summary: 'I test a different hook on almost every reel and keep track of which ones hold people.',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a bar chart of retention',
      motif: 'bars',
      inks: ['rust', 'ink'],
      aspect: 0.8,
      animated: true,
      caption: 'Instagram · 2026 · hook test log',
    },
    links: [{ label: 'See the reels', href: 'https://instagram.com/dylanwang.main' }],
    body: [
      {
        type: 'p',
        text: "The first second decides almost everything, so I treat it like an experiment. Different opening line, different first frame, same idea underneath. Then I log what happened.",
      },
      {
        type: 'p',
        text: 'The data side of this lives in the Lab, where I write up what I am finding. Short version so far: getting people to watch is one problem, getting them to tap my profile after is a different one.',
      },
      { type: 'note', text: 'See the write-up: Lab · Hook tracker' },
    ],
  },
  {
    slug: 'eating-san-diego',
    title: 'Eating my way around San Diego',
    kind: 'reel',
    platform: 'multi',
    when: 'Nov 2026 · ongoing',
    theme: 'Getting to know a new city',
    summary: 'Restaurant visits through TryNearby, about once a week, posted to Instagram and TikTok.',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a plate from above',
      motif: 'plate',
      inks: ['ochre', 'rust'],
      aspect: 0.8,
      caption: 'San Diego · Nov 2026 · first TryNearby visit',
    },
    links: [
      { label: 'Instagram', href: 'https://instagram.com/dylanwang.main' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@dylanwang_main' },
    ],
    body: [
      {
        type: 'p',
        text: "I signed up as a creator with TryNearby. Restaurants host me, I post about the visit. I'm keeping it to about one a week so it stays fun and doesn't eat my whole quarter.",
      },
      {
        type: 'p',
        text: "I don't have a car, so every place on this list is somewhere I got to by bus or trolley. That's half the fun.",
      },
      { type: 'list', draft: true, items: ['Fill in: restaurant · neighborhood · what to order'] },
    ],
  },
  {
    slug: 'ugc',
    title: 'UGC, on pause',
    kind: 'ugc',
    platform: 'multi',
    when: 'Paused since fall 2026',
    theme: 'Making products feel lived-in',
    summary: "Content I made for brands. I'm not taking UGC work right now, but the work is still here.",
    inDrift: true,
    draft: true,
    cover: {
      alt: 'Placeholder art: a product on a table',
      motif: 'cup',
      inks: ['sky', 'ochre'],
      aspect: 0.8,
      caption: 'UGC sample · brand · 48mm talking head',
    },
    body: [
      {
        type: 'p',
        text: "UGC taught me that a follower count matters less than the quality of the video. A brand mostly wants a clip that feels like a real person actually uses the thing. I'm not doing UGC right now while I focus on school and my own content.",
      },
      { type: 'h', text: 'Pieces' },
      {
        type: 'list',
        draft: true,
        items: [
          'Fill in: brand · what you did (concept, shoot, edit) · one honest result or lesson.',
          'Fill in: brand · what you did · result or lesson.',
        ],
      },
    ],
  },
  {
    slug: 'how-i-shoot',
    title: 'How I shoot',
    kind: 'bts',
    platform: 'multi',
    when: 'Always changing',
    theme: 'Showing the work behind the work',
    summary: 'Blackmagic Camera, Apple Log, two focal lengths, and DaVinci Resolve. The whole setup on one page.',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a camera viewfinder recording',
      motif: 'viewfinder',
      inks: ['ink', 'rust'],
      aspect: 0.8,
      animated: true,
      caption: 'Behind the scenes · my setup',
    },
    body: [
      {
        type: 'p',
        text: 'I keep the setup simple so I actually use it. Everything gets recorded in the Blackmagic Camera app in ProRes 422 LT, Apple Log, 4K. Then it all gets cut and graded in DaVinci Resolve Studio.',
      },
      { type: 'h', text: 'Two focal lengths' },
      {
        type: 'list',
        items: [
          '24mm for b-roll. Wide enough to show where I am.',
          '48mm for talking to camera and UGC. Closer, calmer, more flattering.',
        ],
      },
      { type: 'h', text: 'Ideas' },
      {
        type: 'p',
        text: 'Every idea goes into a Notion database with one checkbox: done or not done. That is the whole system. Anything fancier and I stop using it.',
      },
    ],
  },
];

export const contentBySlug = (slug: string) => CONTENT.find((c) => c.slug === slug);

export const CONTENT_KIND_LABEL: Record<ContentItem['kind'], string> = {
  series: 'Series',
  reel: 'Reels',
  ugc: 'UGC',
  photo: 'Photos',
  bts: 'Behind the scenes',
};
