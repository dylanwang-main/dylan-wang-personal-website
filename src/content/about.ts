/**
 * ABOUT: the origin story. First person, short sentences, specific nouns.
 * Avoid: "passionate", "results-driven", "leveraging". Name people and places.
 */
import { Block } from './types';

export const ABOUT = {
  headline: 'Hi, I’m Dylan.',
  intro: [
    "I make short videos, I study data science at UC San Diego, and I'm slowly figuring out how those two things fit together.",
    'This site is the version of me that does not fit on a résumé. The half-built projects, the trips, the list of stuff I am into, and what I am doing right now.',
  ],
  chapters: [
    {
      title: 'Tennis',
      when: 'High school',
      body: [
        {
          type: 'p',
          text: 'I captained my JV tennis team. Then I coached players and mentored students. That is where I figured out I like helping people get better at things, and that explaining something well is its own skill.',
        },
      ] as Block[],
    },
    {
      title: 'The agency',
      when: 'Before this',
      body: [
        {
          type: 'p',
          text: 'I worked at a marketing agency, making content for brands. I learned the craft fast. Then I left to make content full time for myself.',
        },
        {
          type: 'p',
          draft: true,
          text: 'Fill in: the moment you knew you wanted to leave.',
        },
      ] as Block[],
    },
    {
      title: 'Now',
      when: '2026',
      body: [
        {
          type: 'p',
          text: 'I moved to San Diego for UCSD. I take the bus everywhere, I test hooks on my reels like they are science experiments, and I keep a dance studio’s website running on the side.',
        },
      ] as Block[],
    },
    {
      title: 'Later',
      when: 'Someday',
      body: [
        {
          type: 'p',
          text: 'Long term, I want to help people and brands tell better stories, and use data to know which ones are working. For now I am practicing on myself.',
        },
      ] as Block[],
    },
  ],
  principles: [
    { title: 'Specific beats impressive', text: 'One real detail is worth three adjectives.' },
    { title: 'Ship the first draft', text: 'You can’t fix a thing that doesn’t exist yet.' },
    { title: 'Track it, then trust it', text: 'Gut first, data second, and let them argue.' },
    { title: 'Fewer, better', text: 'Applies to posts, tools, and plans.' },
  ],
  principlesDraft: true,
  /** Quiet groundwork for future consulting. Not a sales page. */
  helpLine:
    'Every so often I help small businesses and creators with short-form content and simple websites. If that sounds useful, say hi.',
};
