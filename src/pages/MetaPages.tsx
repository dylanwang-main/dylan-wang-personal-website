/** Colophon, changelog, and the 404 page. */
import { Eyebrow } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { CHANGELOG } from '../content/changelog';
import { site } from '../content/site';
import type { ArtMotif, Ink } from '../content/types';
import { INK } from '../lib/art';
import { formatDate, usePageMeta } from '../lib/hooks';
import { Link } from '../router';

const SWATCHES = [
  { name: 'Paper', hex: '#F5F4F1' },
  { name: 'Paper 2', hex: '#EEEBE4' },
  { name: 'Ink', hex: '#1A1A1A' },
  { name: 'Rust', hex: INK.rust },
  { name: 'Moss', hex: INK.moss },
  { name: 'Ochre', hex: INK.ochre },
  { name: 'Sky', hex: INK.sky },
];

const STACK = [
  ['Framework', 'React 19 + Vite'],
  ['3D', 'three.js through React Three Fiber'],
  ['Styling', 'Tailwind CSS'],
  ['Motion', 'Motion (formerly Framer Motion)'],
  ['Type', 'Instrument Serif, Geist, Geist Mono'],
  ['Prototype', 'Google AI Studio'],
  ['Built with', 'Claude'],
  ['Footage', 'Blackmagic Camera app, DaVinci Resolve Studio'],
];

const INSPIRED = [
  { name: 'meech213.com', why: 'The cream, the tilted floating cards, the corner tagline.', href: 'https://www.meech213.com/' },
  { name: 'zenjivz.com', why: 'A friend’s site. The numbered personal archive started here.', href: 'https://www.zenjivz.com/' },
  { name: 'jzhao.xyz', why: 'Sections as rooms in a house.', href: 'https://jzhao.xyz/' },
  { name: 'maggieappleton.com', why: 'Growth stages for unfinished things.', href: 'https://maggieappleton.com/garden' },
  { name: 'sive.rs/now', why: 'The now page.', href: 'https://sive.rs/now2' },
  { name: 'wattenberger.com', why: 'Leading with the question instead of the résumé bullet.', href: 'https://wattenberger.com/' },
  { name: 'stephango.com', why: 'Having a colophon at all.', href: 'https://stephango.com/' },
];

const MOTIFS: { motif: ArtMotif; inks: [Ink, Ink] }[] = [
  { motif: 'torii', inks: ['rust', 'ink'] },
  { motif: 'court', inks: ['moss', 'ochre'] },
  { motif: 'bars', inks: ['rust', 'ink'] },
  { motif: 'mountains', inks: ['moss', 'sky'] },
  { motif: 'cup', inks: ['ochre', 'ink'] },
  { motif: 'record', inks: ['ink', 'sky'] },
];

export function ColophonPage() {
  usePageMeta('Colophon', 'How this site is made.');
  return (
    <>
      <PageHeading title="Colophon" intro={<p className="m-0">How this site is made, and who it borrows from.</p>} />
      <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-10">
        <section>
          <Eyebrow>Stack</Eyebrow>
          <dl className="m-0 mt-4 border-t border-line">
            {STACK.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-3 text-[15px]">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{k}</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <Eyebrow>Palette</Eyebrow>
          <p className="mt-3 max-w-xl text-[15px] text-ink-2">
            Cream instead of white, so it feels like paper. Four print inks for the placeholder art.
          </p>
          <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-7">
            {SWATCHES.map((s) => (
              <li key={s.hex}>
                <div className="aspect-square rounded-[3px] border border-line" style={{ background: s.hex }} />
                <p className="m-0 mt-2 text-[13px]">{s.name}</p>
                <p className="m-0 font-mono text-[10.5px] uppercase text-ink-3">{s.hex}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Eyebrow>Type</Eyebrow>
          <div className="mt-4 grid gap-6 border-t border-line pt-6 md:grid-cols-3">
            <div>
              <p className="m-0 font-serif text-[56px] leading-none">Aa</p>
              <p className="m-0 mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">Instrument Serif · headings</p>
            </div>
            <div>
              <p className="m-0 font-sans text-[56px] leading-none">Aa</p>
              <p className="m-0 mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">Geist · body</p>
            </div>
            <div>
              <p className="m-0 font-mono text-[56px] leading-none">Aa</p>
              <p className="m-0 mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">Geist Mono · labels</p>
            </div>
          </div>
        </section>

        <section>
          <Eyebrow>The prints</Eyebrow>
          <p className="mt-3 max-w-xl text-[15px] text-ink-2">
            Until the real photos go in, every card is a small two-ink print drawn about its topic. They are generated in
            the browser, so they cost nothing to load.
          </p>
          <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-4 p-0 sm:grid-cols-6">
            {MOTIFS.map((m, i) => (
              <li key={m.motif} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                <MediaView media={{ alt: `Print: ${m.motif}`, motif: m.motif, inks: m.inks, aspect: 0.8, animated: true }} res={260} frame={i + 1} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Eyebrow>Borrowed from</Eyebrow>
          <ul className="m-0 mt-4 list-none border-t border-line p-0">
            {INSPIRED.map((s) => (
              <li key={s.name} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <a className="link-dw text-[15px] font-medium" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.name} ↗
                </a>
                <span className="text-[15px] text-ink-2">{s.why}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{site.credit}.</p>
      </div>
    </>
  );
}

export function ChangelogPage() {
  usePageMeta('Changelog', 'Every meaningful change to this site.');
  return (
    <>
      <PageHeading title="Changelog" intro={<p className="m-0">Every meaningful change to this site, newest first.</p>} />
      <ol className="mx-auto m-0 max-w-6xl list-none px-5 sm:px-10">
        {CHANGELOG.map((c) => (
          <li key={c.version} className="grid gap-4 border-t border-line py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
            <div>
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{formatDate(c.date)}</p>
              <p className="m-0 mt-1 font-serif text-[40px] leading-none">v{c.version}</p>
            </div>
            <div>
              <h2 className="m-0 font-serif text-[30px] font-normal leading-tight">{c.title}</h2>
              <ul className="m-0 mt-4 list-none space-y-2 p-0">
                {c.notes.map((n) => (
                  <li key={n} className="grid grid-cols-[1.2rem_1fr] text-[16px] leading-relaxed text-ink-2">
                    <span className="text-ink-3">+</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

export function NotFound() {
  usePageMeta('Not found');
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-5 py-20 sm:px-10 md:flex-row md:items-center">
      <div className="w-[220px] animate-[dw-float_6s_ease-in-out_infinite]">
        <MediaView media={{ alt: 'A lone card drifting', motif: 'waves', inks: ['sky', 'ink'], aspect: 0.8, animated: true }} res={400} label="No. 404" />
      </div>
      <div>
        <Eyebrow>404</Eyebrow>
        <h1 className="m-0 mt-2 font-serif text-[64px] font-normal leading-none tracking-tight sm:text-[96px]">
          This one drifted off.
        </h1>
        <p className="mt-4 max-w-md text-[17px] text-ink-2">
          The page you were looking for isn't here. It might have moved, or I might have deleted it during a 2am redesign.
        </p>
        <div className="mt-6 flex gap-5 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Link to="/" className="link-dw">
            Back to the drift
          </Link>
          <Link to="/archive" className="link-dw">
            Browse the archive
          </Link>
        </div>
      </div>
    </div>
  );
}
