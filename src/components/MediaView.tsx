/**
 * Shows a Media item: a real image or looping clip when `src` is set,
 * otherwise the generated print (animated if the media says so).
 */
import { useEffect, useRef } from 'react';
import type { Media } from '../content/types';
import { drawArt } from '../lib/art';
import { useInView, useReducedMotion } from '../lib/hooks';

interface Props {
  media: Media;
  /** Drawing resolution for generated art */
  res?: number;
  frame?: number;
  label?: string;
  className?: string;
  /** Show the caption under the image */
  showCaption?: boolean;
  /** Override the aspect ratio */
  aspect?: number;
  rounded?: boolean;
}

export function ArtCanvas({
  media,
  res = 480,
  frame,
  label,
  aspect,
}: {
  media: Media;
  res?: number;
  frame?: number;
  label?: string;
  aspect?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const a = aspect ?? media.aspect ?? 0.8;
  const m = aspect ? { ...media, aspect } : media;

  // Static frame on mount and whenever inputs change
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = res;
    c.height = Math.round(res / a);
    drawArt(c, m, { frame, label, t: 1.2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.alt, media.motif, media.inks?.join(), res, a, frame, label]);

  // Loop animated prints at ~24fps while on screen
  useEffect(() => {
    if (!media.animated || reduced || !inView) return;
    const c = ref.current;
    if (!c) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 41) return;
      last = now;
      drawArt(c, m, { frame, label, t: 1.2 + (now - start) / 1000 });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.animated, reduced, inView, res, a, frame, label]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={media.alt}
      className="block h-auto w-full"
      style={{ aspectRatio: String(a) }}
    />
  );
}

function RealVideo({ media, aspect }: { media: Media; aspect: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, '0px');
  const reduced = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced]);
  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
      className="block h-full w-full object-cover"
      style={{ aspectRatio: String(aspect) }}
    />
  );
}

export function MediaView({ media, res, frame, label, className = '', showCaption, aspect, rounded }: Props) {
  const a = aspect ?? media.aspect ?? 0.8;
  let inner;
  if (media.src && media.kind === 'video') inner = <RealVideo media={media} aspect={a} />;
  else if (media.src)
    inner = (
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className="block h-full w-full object-cover"
        style={{ aspectRatio: String(a) }}
      />
    );
  else inner = <ArtCanvas media={media} res={res} frame={frame} label={label} aspect={aspect} />;

  return (
    <figure className={`m-0 ${className}`}>
      <div className={`overflow-hidden bg-paper-2 ${rounded ? 'rounded-[3px]' : ''}`}>{inner}</div>
      {showCaption && media.caption && (
        <figcaption className="mt-2 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-ink-3">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}
