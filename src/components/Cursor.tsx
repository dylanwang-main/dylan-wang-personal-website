/**
 * The custom cursor. A small ink dot that:
 *  - grows into a ring over links and buttons
 *  - becomes a filled "View" disc over cards (data-cursor="view")
 *  - shows a caption next to it when the 3D scene passes one in
 * The system cursor is hidden only while this is active (never on touch screens).
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CursorMode, getCursorOverride, subscribeCursor } from '../lib/cursor';
import { useIsTouch } from '../lib/hooks';

const INTERACTIVE = 'a, button, [role="button"], summary, select, label[for], input[type="range"]';

export function Cursor() {
  const isTouch = useIsTouch();
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [domMode, setDomMode] = useState<{ mode: CursorMode; label?: string }>({ mode: 'default' });
  const override = useSyncExternalStore(subscribeCursor, getCursorOverride, () => null);

  useEffect(() => {
    if (isTouch) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    return () => root.classList.remove('has-custom-cursor');
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;
    let x = -100;
    let y = -100;
    let raf = 0;
    const paint = () => {
      raf = 0;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const view = el?.closest?.('[data-cursor="view"]') as HTMLElement | null;
      if (view) return setDomMode({ mode: 'view', label: view.dataset.cursorLabel });
      if (el?.closest?.(INTERACTIVE)) return setDomMode({ mode: 'link' });
      setDomMode({ mode: 'default' });
    };
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const mode = override?.mode ?? domMode.mode;
  const label = override?.label ?? domMode.label ?? 'View';
  const size = mode === 'view' ? 58 : mode === 'link' ? 30 : 8;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s' }}
    >
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          background: mode === 'link' ? 'transparent' : '#1A1A1A',
          border: mode === 'link' ? '1px solid #1A1A1A' : 'none',
          transition: 'width .22s cubic-bezier(.2,.8,.2,1), height .22s cubic-bezier(.2,.8,.2,1), left .22s cubic-bezier(.2,.8,.2,1), top .22s cubic-bezier(.2,.8,.2,1), background .2s',
          mixBlendMode: mode === 'link' ? 'normal' : 'normal',
        }}
      >
        {mode === 'view' && (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper">{label}</span>
        )}
      </div>
      {override?.caption && (
        <div className="absolute left-9 top-6 max-w-[280px] whitespace-nowrap border border-line bg-paper/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink shadow-sm">
          {override.caption}
        </div>
      )}
    </div>
  );
}
