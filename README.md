# dylan-wang-personal-website

The personal one. Not the résumé. A floating 3D drift of cards on cream paper, a wheel at the bottom edge for a menu, and pages for Work, Content, Lab, Archive, About, and Now.

## Run it

```bash
bun install      # or npm install
bun run dev      # http://localhost:3000
bun run build    # type-checks, then builds to dist/
bun run preview  # serves the production build on :4173
```

## Edit your stuff

Everything personal lives in `src/content/`. You should almost never need to touch components.

| File | What's in it |
| --- | --- |
| `site.ts` | Name, taglines (one shows per visit), socials, email, the six wheel sections, draft markers on/off |
| `work.ts` | Work entries. Each starts with a question (`hook`), then a story in blocks |
| `content.ts` | Videos and photos. Caption formula: place · date · what was happening · credit |
| `lab.ts` | In-progress projects with growth stages: seedling, growing, evergreen, paused |
| `archive.ts` | The numbered shelf. Status: using, retired, want. Numbers are assigned automatically |
| `now.ts` | The /now page and the "currently" line on the home page. Update monthly |
| `about.ts` | Origin story, chapters, house rules, the quiet "working on something?" line |
| `changelog.ts` | One entry per meaningful change |

### Draft markers

Anything marked `draft: true` (and every "Fill in:" prompt) shows a dotted rust underline and a small **draft** tag. That's the list of copy to rewrite in your own words. Set `showDraftMarkers: false` in `site.ts` before launch.

### Real photos and clips

Every card shows a generated two-ink print about its topic until you give it a real file. Drop files in `public/media/` and set `src` on the media object. See `public/media/README.md`.

### Add something to the drift

Set `inDrift: true` on a Work, Content, or Lab entry. It shows up in that section's room automatically. Archive, About, and Now cards are listed in `src/drift/cards.ts`.

## How the home page works

- Each wheel section is a **room**, a depth band in 3D space. Work is closest, Now is deepest.
- Turning the wheel flies the camera to that room. Scrolling through the space turns the wheel to match.
- One scroll gesture over the wheel = one section (trackpad momentum is swallowed).
- Click or press Enter on the active section to open its page. Click any card to open its page.
- `/` or `⌘K` opens the Index, the full menu (also the main nav on phones).
- Reduced motion (OS setting, or `?motion=reduce`) shows a calm, still grid instead.
- Tune the feel with `?tune` in the URL (always on in dev). Copy the JSON into `src/drift/config.ts`.

## Deploy (Vercel)

Import the repo in Vercel. `vercel.json` already handles the SPA routing and caching. When you have a real domain, update `site.url` in `src/content/site.ts`, `public/robots.txt`, and `public/sitemap.xml`.

## Stack

React 19, Vite, React Three Fiber, Tailwind CSS, Motion. Fonts: Instrument Serif, Geist, Geist Mono. The 3D code is lazy-loaded, so inner pages never download three.js.
