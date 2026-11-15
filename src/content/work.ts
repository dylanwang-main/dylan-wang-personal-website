/**
 * WORK: things I did for other people.
 * Write each one as a short story: the question, what I did, what surprised me.
 * The polished, metric-heavy versions belong on the recruiter portfolio, not here.
 */
import { WorkItem } from './types';

export const WORK: WorkItem[] = [
  {
    slug: 'n10-dance-studios',
    title: 'N10 Dance Studios',
    hook: "What does a small studio need from its website? Mostly that the schedule is right and the homepage feels like the room.",
    role: 'Website updates and upkeep',
    when: '2026 · ongoing',
    tags: ['WordPress', 'Elementor', 'Video', 'Client work'],
    status: 'ongoing',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a dancer mid-turn',
      motif: 'dancer',
      inks: ['rust', 'ink'],
      aspect: 0.8,
      animated: true,
      caption: 'N10 Dance Studios · 2026 · homepage background video',
    },
    links: [{ label: 'n10dancestudios.com', href: 'https://n10dancestudios.com' }],
    body: [
      {
        type: 'p',
        text: "I keep the N10 Dance Studios website up to date. It's a WordPress site built in Elementor and hosted on GoDaddy. Most of the work is small and constant: swapping the homepage background video, updating the class schedule, and turning feedback from the studio into changes the same week.",
      },
      { type: 'h', text: 'What the job actually is' },
      {
        type: 'list',
        items: [
          'Homepage background video: picking the clip, compressing it so the page still loads fast, and making sure it looks right on phones.',
          "Class schedule: the page people check most, so it's the one that can never be wrong.",
          'Change requests: a message comes in, I make the change, I send a screenshot back.',
        ],
      },
      { type: 'h', text: 'What I learned' },
      {
        type: 'p',
        draft: true,
        text: "Write this in your own words. A starting point: the most valuable thing on a small business site is usually the most boring thing on it. Nobody remembers the animation. Everybody remembers showing up for a class that wasn't on the schedule.",
      },
      {
        type: 'media',
        media: [
          { alt: 'Placeholder: schedule page', motif: 'grid', inks: ['ink', 'ochre'], aspect: 1.5, caption: 'Class schedule page · before and after' },
          { alt: 'Placeholder: homepage video', motif: 'dancer', inks: ['moss', 'rust'], aspect: 1.5, animated: true, caption: 'Homepage background loop' },
        ],
      },
    ],
  },
  {
    slug: 'agency-years',
    title: 'The agency years',
    hook: "What happens when you make content all day for brands that aren't yours? You learn the craft fast, and you start wanting your own.",
    role: 'Marketing agency',
    when: 'Dates: fill in',
    tags: ['Marketing', 'Short-form video', 'Client work'],
    status: 'shipped',
    inDrift: true,
    draft: true,
    cover: {
      alt: 'Placeholder art: a camera viewfinder',
      motif: 'viewfinder',
      inks: ['ink', 'rust'],
      aspect: 0.8,
      caption: 'Agency work · client shoots',
    },
    body: [
      {
        type: 'p',
        text: 'I used to work at a marketing agency. Then I left to make content full time for myself.',
      },
      { type: 'h', text: 'What I did there' },
      {
        type: 'list',
        draft: true,
        items: [
          'Fill in: the kinds of clients you worked with (no names needed).',
          'Fill in: your actual role day to day. Shooting? Editing? Strategy? All of it?',
          'Fill in: one piece of work you are still proud of, and why.',
        ],
      },
      { type: 'h', text: 'Why I left' },
      {
        type: 'p',
        draft: true,
        text: "Say it plainly. Something like: I was getting better at making other people's brands feel human, and I wanted to find out if I could do it for my own.",
      },
    ],
  },
  {
    slug: 'client-funnel-sites',
    title: 'Sites that catch the click',
    hook: 'If someone likes a reel, where do they go next? I build the page that answers that.',
    role: 'Design and build',
    when: '2026',
    tags: ['Web', 'Conversion', 'Creator business'],
    status: 'ongoing',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a browser window',
      motif: 'browser',
      inks: ['sky', 'ink'],
      aspect: 0.8,
      caption: 'Landing pages · 2026',
    },
    body: [
      {
        type: 'p',
        text: "Views don't pay anything on their own. The step after the view does: the profile visit, the link tap, the page that makes someone message you. I've been building simple websites that do that one job for my own content work.",
      },
      {
        type: 'p',
        text: "My own Instagram numbers taught me where the leak is. People watched, but not enough of them went from the reel to the profile. That's the gap these pages are trying to close.",
      },
      { type: 'h', text: "What's on them" },
      {
        type: 'list',
        draft: true,
        items: [
          'Fill in: what each site is for and who lands on it.',
          'Fill in: what you tried that worked, and what you cut.',
        ],
      },
    ],
  },
  {
    slug: 'coaching',
    title: 'Captain, coach, mentor',
    hook: 'Captaining JV tennis taught me more about people than about tennis.',
    role: 'JV team captain · tennis coach · student mentor',
    when: 'High school and after',
    tags: ['Tennis', 'Coaching', 'Teaching'],
    status: 'shipped',
    inDrift: true,
    cover: {
      alt: 'Placeholder art: a tennis court from above',
      motif: 'court',
      inks: ['moss', 'ochre'],
      aspect: 0.8,
      caption: 'JV tennis · the year I was captain',
    },
    body: [
      {
        type: 'p',
        text: "I was captain of my JV tennis team. After that I coached players and mentored students. It's the most consistent thread in everything I do: I like helping someone get a little better at a thing, and I like figuring out how to explain it so it actually lands.",
      },
      { type: 'quote', text: 'Fill in: one thing you say to every player you coach.', cite: 'me, probably' },
      { type: 'h', text: 'What carries over' },
      {
        type: 'list',
        items: [
          'Coaching is mostly noticing. Same with editing.',
          'Short feedback, given right away, beats a long talk after.',
          'Everyone has a different first thing they need to hear.',
        ],
        draft: true,
      },
    ],
  },
];

export const workBySlug = (slug: string) => WORK.find((w) => w.slug === slug);
