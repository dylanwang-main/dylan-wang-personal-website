import { Blocks } from '../components/Blocks';
import { Draft, Eyebrow } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { ABOUT } from '../content/about';
import { NOW } from '../content/now';
import { site } from '../content/site';
import { usePageMeta } from '../lib/hooks';
import { Link } from '../router';

export function AboutPage() {
  usePageMeta('About', site.oneLiner);
  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 sm:px-10 sm:pt-20 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:gap-16">
        <div>
          <Eyebrow>05 · the front door</Eyebrow>
          <h1 className="mb-0 mt-3 font-serif text-[64px] font-normal leading-[0.95] tracking-[-0.02em] sm:text-[112px]">
            {ABOUT.headline}
          </h1>
          <div className="prose-dw mt-8 max-w-xl text-[18px] text-ink-2 sm:text-[20px]">
            {ABOUT.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="md:pt-10">
          <div style={{ transform: 'rotate(2deg)' }} className="shadow-[0_24px_50px_-30px_rgba(40,30,20,0.6)]">
            <MediaView
              media={{
                alt: 'Placeholder for a portrait of Dylan',
                motif: 'viewfinder',
                inks: ['ink', 'ochre'],
                aspect: 0.8,
                animated: true,
              }}
              res={600}
              label="Your portrait goes here · /public/media"
            />
          </div>
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
            {site.location} · {NOW.currently}
          </p>
        </div>
      </div>

      <section aria-labelledby="chapters" className="mx-auto mt-24 max-w-6xl px-5 sm:px-10">
        <h2 id="chapters" className="sr-only-dw">
          The story so far
        </h2>
        <ol className="m-0 list-none p-0">
          {ABOUT.chapters.map((c, i) => (
            <li key={c.title} className="grid gap-4 border-t border-line py-10 md:grid-cols-[4rem_minmax(0,14rem)_minmax(0,1fr)] md:gap-10">
              <span className="font-mono text-[11px] tracking-[0.12em] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="m-0 font-serif text-[36px] font-normal leading-none tracking-tight">{c.title}</h3>
                <p className="m-0 mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{c.when}</p>
              </div>
              <div className="max-w-2xl">
                <Blocks blocks={c.body} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="principles" className="mx-auto mt-16 max-w-6xl px-5 sm:px-10">
        <Eyebrow>Things I try to remember</Eyebrow>
        <h2 id="principles" className="m-0 mt-2 font-serif text-[44px] font-normal leading-none tracking-tight sm:text-[56px]">
          House rules
        </h2>
        <ul className="m-0 mt-8 grid list-none gap-px overflow-hidden rounded-[3px] border border-line bg-line p-0 sm:grid-cols-2">
          {ABOUT.principles.map((p, i) => (
            <li key={p.title} className="bg-paper p-6">
              <p className="m-0 font-mono text-[10.5px] tracking-[0.12em] text-ink-3">{String(i + 1).padStart(2, '0')}</p>
              <p className="m-0 mt-3 font-serif text-[28px] leading-tight">
                <Draft on={ABOUT.principlesDraft}>{p.title}</Draft>
              </p>
              <p className="m-0 mt-2 text-[15px] text-ink-2">
                <Draft on={ABOUT.principlesDraft}>{p.text}</Draft>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hello" className="mx-auto mt-20 max-w-6xl px-5 sm:px-10">
        <div className="grid gap-8 rounded-[3px] bg-ink px-6 py-10 text-paper sm:px-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 id="hello" className="m-0 font-serif text-[40px] font-normal leading-none tracking-tight sm:text-[52px]">
              Working on something?
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-paper/80">{ABOUT.helpLine}</p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
            {site.email && (
              <a href={`mailto:${site.email}`} className="hover:opacity-70">
                {site.email} ↗
              </a>
            )}
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                {s.label} · {s.handle} ↗
              </a>
            ))}
          </div>
        </div>
        <p className="mt-6 text-[14px] text-ink-3">
          Curious what I am up to this month? That is on the <Link to="/now" className="link-dw">now page</Link>.
        </p>
      </section>
    </>
  );
}
