/**
 * NOW: what I'd tell a friend I hadn't seen in a year (Derek Sivers' /now idea).
 * Update this every month or so and change `updated`. Once the site is live,
 * add it to nownownow.com.
 */
import { NowEntry } from './types';

export const NOW = {
  updated: '2026-11-15',
  location: 'San Diego',
  /** The quiet one-liner in the home page footer */
  currently: 'editing reels, learning San Diego by trolley',
  entries: [
    {
      label: 'School',
      text: 'First year at UC San Diego, studying data science. Getting used to quarters, which go by very fast.',
    },
    {
      label: 'Making',
      text: 'Reels for Instagram. I try a different hook on almost every one and write down what happened.',
    },
    {
      label: 'Eating',
      text: 'Started doing restaurant visits through TryNearby. About one a week, so it stays fun.',
    },
    {
      label: 'Building',
      text: 'This website. You are looking at version 0.1.',
    },
    {
      label: 'Helping',
      text: 'Keeping the N10 Dance Studios website up to date: the schedule, the homepage video, the small stuff.',
    },
    {
      label: 'Getting around',
      text: 'No car, so it is buses and the trolley. I know more about San Diego transit than I expected to.',
    },
    {
      label: 'Applying',
      text: 'To student data science project teams. Fingers crossed.',
      draft: true,
    },
    {
      label: 'Thinking about',
      text: 'Fill in: a question you keep turning over this month.',
      draft: true,
    },
  ] satisfies NowEntry[],
  notDoing: [
    'UGC work, for now. Focusing on school and my own stuff.',
    'Posting every day. Fewer, better.',
  ],
};
