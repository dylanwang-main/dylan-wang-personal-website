import { Draft, Eyebrow } from '../components/bits';
import { MediaView } from '../components/MediaView';
import { PageHeading } from '../components/PageShell';
import { NOW } from '../content/now';
import { sectionById } from '../content/site';
import { formatDate, usePageMeta } from '../lib/hooks';

export function NowPage() {
  const s = sectionById('now');
  usePageMeta('Now', `What Dylan is doing now. Updated ${formatDate(NOW.updated)}.`);
  const days = Math.max(0, Math.round((Date.now() - new Date(NOW.updated + 'T12:00:00').getTime()) / 86400000));

  return (
    <>
      <PageHeading
        section="now"
        title="Now"
        intro={<p className="m-0">{s.blurb}</p>}
        aside={
          <div className="w-[130px] shrink-0" style={{ transform: 'rotate(4deg)' }}>
            <MediaView media={{ alt: 'Placeholder art: a trolley', motif: 'trolley', inks: ['rust', 'sky'], aspect: 0.8, animated: true }} res={260} />
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-10">
        <p className="m-0 border-y border-line py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
          Updated {formatDate(NOW.updated)} · {NOW.location}
          <span className="text-ink-3"> · {days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`}</span>
        </p>

        <dl className="m-0 mt-2">
          {NOW.entries.map((e) => (
            <div key={e.label} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
              <dt className="font-serif text-[28px] leading-tight">{e.label}</dt>
              <dd className="m-0 max-w-2xl text-[17px] leading-relaxed text-ink sm:text-[18px]">
                <Draft on={e.draft}>{e.text}</Draft>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Not doing right now</Eyebrow>
            <ul className="m-0 mt-4 list-none space-y-2 p-0">
              {NOW.notDoing.map((n) => (
                <li key={n} className="text-[16px] text-ink-2 line-through decoration-ink-3/60 decoration-1">
                  <span className="no-underline">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[14px] leading-relaxed text-ink-3">
            <Eyebrow>What is this?</Eyebrow>
            <p className="mt-4">
              A now page says what you are focused on at this point in your life. The idea comes from Derek Sivers, and
              there's a directory of them at{' '}
              <a className="link-dw" href="https://nownownow.com" target="_blank" rel="noopener noreferrer">
                nownownow.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
