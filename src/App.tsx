/**
 * Routes. The home page (3D drift) is lazy-loaded; everything else is plain pages.
 */
import { AnimatePresence, motion } from 'motion/react';
import { Suspense, lazy } from 'react';
import { Cursor } from './components/Cursor';
import { IndexMenu } from './components/IndexMenu';
import { PageShell } from './components/PageShell';
import { AboutPage } from './pages/AboutPage';
import { ArchivePage } from './pages/ArchivePage';
import { ContentDetail, ContentPage } from './pages/ContentPages';
import { LabPage } from './pages/LabPage';
import { ChangelogPage, ColophonPage, NotFound } from './pages/MetaPages';
import { NowPage } from './pages/NowPage';
import { WorkDetail, WorkPage } from './pages/WorkPages';
import { matchPath, navigate, usePath } from './router';
import { useEffect } from 'react';

const DriftHome = lazy(() => import('./drift/DriftHome'));

function Page({ path }: { path: string }) {
  let m: Record<string, string> | null;
  if (path === '/work') return <WorkPage />;
  if ((m = matchPath('/work/:slug', path))) return <WorkDetail slug={m.slug} />;
  if (path === '/content') return <ContentPage />;
  if ((m = matchPath('/content/:slug', path))) return <ContentDetail slug={m.slug} />;
  if (path === '/lab') return <LabPage />;
  if (path === '/archive') return <ArchivePage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/now') return <NowPage />;
  if (path === '/colophon') return <ColophonPage />;
  if (path === '/changelog') return <ChangelogPage />;
  return <NotFound />;
}

/** Old or alternate URLs that should land somewhere useful */
const REDIRECTS: Record<string, string> = {
  '/uses': '/archive#gear',
  '/projects': '/work',
  '/videos': '/content',
  '/contact': '/about#hello',
};

function Splash() {
  return <div className="fixed inset-0 bg-paper" />;
}

export default function App() {
  const path = usePath();

  useEffect(() => {
    if (REDIRECTS[path]) navigate(REDIRECTS[path], { replace: true });
  }, [path]);

  // Scroll to #hash targets on first load
  useEffect(() => {
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
  }, []);

  return (
    <>
      <Cursor />
      <IndexMenu />
      <div className="paper-grain" aria-hidden="true" />
      {path === '/' ? (
        <Suspense fallback={<Splash />}>
          <DriftHome />
        </Suspense>
      ) : (
        <PageShell>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Page path={path} />
            </motion.div>
          </AnimatePresence>
        </PageShell>
      )}
    </>
  );
}
