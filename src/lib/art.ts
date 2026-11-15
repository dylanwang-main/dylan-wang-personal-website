/**
 * Generated placeholder art.
 *
 * Until real photos go in, every card is a small two-ink "risograph print" drawn
 * about its topic (a court for coaching, a torii for Japan, a chart for data).
 * The same drawing feeds both the 3D drift textures and the flat pages, so the
 * whole site reads as one art direction instead of grey boxes.
 */
import type { ArtMotif, Ink, Media } from '../content/types';

export const INK: Record<Ink, string> = {
  rust: '#C0532E',
  moss: '#4E6B45',
  ochre: '#D9A441',
  sky: '#4F7CA8',
  ink: '#262420',
};

const PAPER = '#F1ECE2';
const PAPER_SHADE = '#E9E2D4';

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

let grainTile: HTMLCanvasElement | null = null;
function getGrain() {
  if (grainTile) return grainTile;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(128, 128);
  const rnd = mulberry32(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + rnd() * 135;
    img.data[i] = v;
    img.data[i + 1] = v * 0.97;
    img.data[i + 2] = v * 0.92;
    img.data[i + 3] = rnd() < 0.5 ? 34 : 0;
  }
  ctx.putImageData(img, 0, 0);
  grainTile = c;
  return c;
}

function halftone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  spacing: number,
  radius: (u: number, v: number) => number
) {
  ctx.fillStyle = color;
  for (let yy = y; yy < y + h; yy += spacing) {
    const row = Math.round((yy - y) / spacing);
    for (let xx = x + (row % 2 ? spacing / 2 : 0); xx < x + w; xx += spacing) {
      const r = radius((xx - x) / w, (yy - y) / h);
      if (r <= 0.15) continue;
      ctx.beginPath();
      ctx.arc(xx, yy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/* ------------------------------------------------------------------ */
/* Motifs. Each draws inside (0, 0, w, h). `t` is seconds, for loops.  */
/* ------------------------------------------------------------------ */

type Ctx = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  a: string;
  b: string;
  t: number;
  rnd: () => number;
};

const MOTIFS: Record<ArtMotif, (c: Ctx) => void> = {
  sun({ ctx, w, h, a, b, t }) {
    halftone(ctx, 0, 0, w, h * 0.62, alpha(b, 0.55), w / 28, (_, v) => (1 - v) * w * 0.012 + 0.4);
    const sy = h * (0.5 + Math.sin(t * 0.4) * 0.03);
    ctx.fillStyle = a;
    circle(ctx, w * 0.5, sy, w * 0.24);
    ctx.fill();
    ctx.fillStyle = b;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);
    ctx.fillStyle = alpha(a, 0.75);
    for (let i = 0; i < 6; i++) {
      const lw = w * (0.4 - i * 0.05);
      ctx.fillRect(w * 0.5 - lw / 2, h * 0.66 + i * h * 0.035, lw, h * 0.012);
    }
  },

  mountains({ ctx, w, h, a, b, rnd }) {
    ctx.fillStyle = alpha(a, 0.9);
    circle(ctx, w * 0.7, h * 0.28, w * 0.1);
    ctx.fill();
    const ridges = [
      { y: 0.48, amp: 0.16, col: alpha(b, 0.45) },
      { y: 0.6, amp: 0.2, col: alpha(b, 0.8) },
      { y: 0.74, amp: 0.14, col: alpha(a, 0.85) },
    ];
    for (const r of ridges) {
      ctx.fillStyle = r.col;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * r.y);
      const peaks = 3 + Math.floor(rnd() * 3);
      for (let i = 0; i <= peaks; i++) {
        const x = (i / peaks) * w;
        const up = i % 2 === 0 ? 0 : 1;
        ctx.lineTo(x, h * (r.y - up * r.amp * (0.5 + rnd() * 0.6)));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }
    // Half Dome-ish cliff
    ctx.fillStyle = alpha(b, 0.7);
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.6);
    ctx.quadraticCurveTo(w * 0.14, h * 0.33, w * 0.34, h * 0.31);
    ctx.lineTo(w * 0.36, h * 0.33);
    ctx.lineTo(w * 0.37, h * 0.6);
    ctx.closePath();
    ctx.fill();
  },

  torii({ ctx, w, h, a, b, t }) {
    ctx.fillStyle = alpha(b, 0.5);
    circle(ctx, w * 0.5, h * (0.42 + Math.sin(t * 0.3) * 0.01), w * 0.3);
    ctx.fill();
    halftone(ctx, 0, h * 0.72, w, h * 0.28, alpha(b, 0.7), w / 30, (_, v) => v * w * 0.012 + 0.3);
    ctx.fillStyle = a;
    // kasagi (top beam, slightly curved)
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.26);
    ctx.quadraticCurveTo(w * 0.5, h * 0.3, w * 0.9, h * 0.26);
    ctx.lineTo(w * 0.86, h * 0.31);
    ctx.quadraticCurveTo(w * 0.5, h * 0.34, w * 0.14, h * 0.31);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(w * 0.18, h * 0.38, w * 0.64, h * 0.035); // nuki
    ctx.fillRect(w * 0.27, h * 0.3, w * 0.06, h * 0.45); // pillars
    ctx.fillRect(w * 0.67, h * 0.3, w * 0.06, h * 0.45);
    ctx.fillRect(w * 0.47, h * 0.31, w * 0.06, h * 0.07); // gakuzuka
    ctx.fillStyle = alpha(b, 0.95);
    ctx.fillRect(w * 0.25, h * 0.73, w * 0.1, h * 0.03);
    ctx.fillRect(w * 0.65, h * 0.73, w * 0.1, h * 0.03);
  },

  court({ ctx, w, h, a, b, t }) {
    ctx.fillStyle = alpha(a, 0.85);
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.14);
    ctx.lineTo(w * 0.7, h * 0.14);
    ctx.lineTo(w * 0.94, h * 0.9);
    ctx.lineTo(w * 0.06, h * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = w * 0.008;
    ctx.stroke();
    const lerp = (p: number, q: number, k: number) => p + (q - p) * k;
    // service lines + net
    for (const k of [0.3, 0.5, 0.7]) {
      const y = lerp(h * 0.14, h * 0.9, k);
      const half = lerp(w * 0.2, w * 0.44, k);
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - half, y);
      ctx.lineTo(w * 0.5 + half, y);
      ctx.lineWidth = k === 0.5 ? w * 0.014 : w * 0.006;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(w * 0.5, lerp(h * 0.14, h * 0.9, 0.3));
    ctx.lineTo(w * 0.5, lerp(h * 0.14, h * 0.9, 0.7));
    ctx.lineWidth = w * 0.006;
    ctx.stroke();
    // ball bouncing across the net
    const p = (Math.sin(t * 1.4) + 1) / 2;
    const by = lerp(h * 0.3, h * 0.72, p) - Math.abs(Math.sin(t * 2.8)) * h * 0.06;
    ctx.fillStyle = b;
    circle(ctx, lerp(w * 0.38, w * 0.62, p), by, w * 0.035);
    ctx.fill();
  },

  bars({ ctx, w, h, a, b, t, rnd }) {
    const n = 7;
    const base = h * 0.8;
    const bw = (w * 0.7) / n;
    ctx.fillStyle = alpha(b, 0.25);
    for (let i = 0; i < 4; i++) ctx.fillRect(w * 0.12, h * (0.24 + i * 0.14), w * 0.78, 1.5);
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const v = 0.25 + rnd() * 0.5 + Math.sin(t * 0.9 + i) * 0.04;
      const x = w * 0.14 + i * bw;
      ctx.fillStyle = i === 2 ? b : alpha(a, 0.9);
      ctx.fillRect(x, base - v * h * 0.6, bw * 0.62, v * h * 0.6);
      pts.push([x + bw * 0.31, base - v * h * 0.6 - h * 0.06]);
    }
    ctx.strokeStyle = b;
    ctx.lineWidth = w * 0.008;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.fillStyle = a;
    ctx.fillRect(w * 0.1, base, w * 0.8, 3);
  },

  viewfinder({ ctx, w, h, a, b, t }) {
    // subject: head and shoulders
    ctx.fillStyle = alpha(b, 0.85);
    circle(ctx, w * 0.5, h * 0.42, w * 0.13);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.8, w * 0.3, h * 0.2, 0, Math.PI, 0);
    ctx.fill();
    halftone(ctx, 0, 0, w, h, alpha(a, 0.18), w / 26, (u) => u * 2.2 + 0.3);
    // brackets
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.012;
    const m = w * 0.1;
    const L = w * 0.12;
    const corners: [number, number, number, number][] = [
      [m, m, 1, 1],
      [w - m, m, -1, 1],
      [m, h - m, 1, -1],
      [w - m, h - m, -1, -1],
    ];
    for (const [x, y, sx, sy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x, y + sy * L);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * L, y);
      ctx.stroke();
    }
    ctx.lineWidth = w * 0.004;
    ctx.beginPath();
    ctx.moveTo(w * 0.47, h * 0.5);
    ctx.lineTo(w * 0.53, h * 0.5);
    ctx.moveTo(w * 0.5, h * 0.5 - w * 0.03);
    ctx.lineTo(w * 0.5, h * 0.5 + w * 0.03);
    ctx.stroke();
    // REC
    if (Math.floor(t * 1.4) % 2 === 0) {
      ctx.fillStyle = INK.rust;
      circle(ctx, m + w * 0.04, m + w * 0.09, w * 0.018);
      ctx.fill();
    }
    ctx.fillStyle = a;
    ctx.font = `500 ${Math.round(w * 0.04)}px "Geist Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    ctx.fillText('REC', m + w * 0.075, m + w * 0.09);
  },

  browser({ ctx, w, h, a, b }) {
    ctx.fillStyle = alpha(a, 0.12);
    roundRect(ctx, w * 0.1, h * 0.14, w * 0.8, h * 0.72, w * 0.03);
    ctx.fill();
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.008;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.21);
    ctx.lineTo(w * 0.9, h * 0.21);
    ctx.stroke();
    ctx.fillStyle = a;
    for (let i = 0; i < 3; i++) {
      circle(ctx, w * (0.15 + i * 0.04), h * 0.175, w * 0.012);
      ctx.fill();
    }
    ctx.fillStyle = b;
    ctx.fillRect(w * 0.16, h * 0.27, w * 0.68, h * 0.2);
    ctx.fillStyle = alpha(a, 0.85);
    ctx.fillRect(w * 0.16, h * 0.51, w * 0.4, h * 0.025);
    ctx.fillRect(w * 0.16, h * 0.55, w * 0.28, h * 0.02);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === 1 ? alpha(b, 0.8) : alpha(a, 0.3);
      ctx.fillRect(w * (0.16 + i * 0.235), h * 0.62, w * 0.2, h * 0.17);
    }
    // a little cursor heading for the button
    ctx.fillStyle = a;
    ctx.beginPath();
    ctx.moveTo(w * 0.62, h * 0.42);
    ctx.lineTo(w * 0.62, h * 0.5);
    ctx.lineTo(w * 0.64, h * 0.48);
    ctx.lineTo(w * 0.66, h * 0.52);
    ctx.lineTo(w * 0.67, h * 0.51);
    ctx.lineTo(w * 0.65, h * 0.47);
    ctx.lineTo(w * 0.68, h * 0.47);
    ctx.closePath();
    ctx.fill();
  },

  waves({ ctx, w, h, a, b, t }) {
    const rows = 14;
    for (let r = 0; r < rows; r++) {
      const y0 = h * (0.12 + (r / rows) * 0.8);
      ctx.strokeStyle = r % 3 === 0 ? b : alpha(a, 0.85);
      ctx.lineWidth = w * (0.006 + (r / rows) * 0.01);
      ctx.beginPath();
      for (let x = 0; x <= w; x += w / 40) {
        const y = y0 + Math.sin(x / (w * 0.12) + t * 1.2 + r * 0.7) * h * 0.015 * (1 + r / rows);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  cup({ ctx, w, h, a, b, t }) {
    const cx = w * 0.5;
    const cy = h * 0.56;
    ctx.fillStyle = alpha(a, 0.2);
    circle(ctx, cx, cy, w * 0.36);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = PAPER_SHADE;
    circle(ctx, cx, cy, w * 0.24);
    ctx.fill();
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.01;
    ctx.stroke();
    ctx.fillStyle = b;
    circle(ctx, cx, cy, w * 0.19);
    ctx.fill();
    // latte heart
    ctx.fillStyle = PAPER;
    ctx.beginPath();
    const s = w * 0.07;
    ctx.moveTo(cx, cy + s * 0.9);
    ctx.bezierCurveTo(cx - s * 1.6, cy - s * 0.2, cx - s * 0.6, cy - s * 1.3, cx, cy - s * 0.35);
    ctx.bezierCurveTo(cx + s * 0.6, cy - s * 1.3, cx + s * 1.6, cy - s * 0.2, cx, cy + s * 0.9);
    ctx.fill();
    // handle
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.03;
    ctx.beginPath();
    ctx.arc(cx + w * 0.29, cy, w * 0.05, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    // steam
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = alpha(a, 0.6);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      for (let k = 0; k <= 20; k++) {
        const y = h * 0.28 - k * h * 0.008;
        const x = cx + i * w * 0.08 + Math.sin(k * 0.5 + t * 2 + i) * w * 0.02;
        k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  arch({ ctx, w, h, a, b }) {
    const x = w * 0.24;
    const y = h * 0.16;
    const aw = w * 0.52;
    const ah = h * 0.64;
    ctx.fillStyle = a;
    ctx.fillRect(0, 0, w, h * 0.86);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = PAPER;
    ctx.beginPath();
    ctx.moveTo(x, y + ah);
    ctx.lineTo(x, y + aw / 2);
    ctx.arc(x + aw / 2, y + aw / 2, aw / 2, Math.PI, 0);
    ctx.lineTo(x + aw, y + ah);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = alpha(b, 0.85);
    ctx.beginPath();
    ctx.moveTo(x, y + ah);
    ctx.lineTo(x + aw, y + ah);
    ctx.lineTo(x + aw * 1.25, h);
    ctx.lineTo(x - aw * 0.05, h);
    ctx.closePath();
    ctx.fill();
    halftone(ctx, x, y, aw, ah, alpha(b, 0.5), w / 30, (u, v) => (1 - v) * u * w * 0.014);
  },

  grid({ ctx, w, h, a, b, t, rnd }) {
    const cards = 7;
    for (let i = 0; i < cards; i++) {
      const cw = w * (0.18 + rnd() * 0.16);
      const chh = cw * 1.25;
      const x = w * (0.08 + rnd() * 0.62);
      const y = h * (0.08 + rnd() * 0.6) + Math.sin(t * 0.8 + i) * h * 0.01;
      ctx.save();
      ctx.translate(x + cw / 2, y + chh / 2);
      ctx.rotate((rnd() - 0.5) * 0.4 + Math.sin(t * 0.5 + i) * 0.02);
      ctx.fillStyle = i % 3 === 0 ? alpha(b, 0.9) : alpha(a, 0.15 + rnd() * 0.5);
      ctx.fillRect(-cw / 2, -chh / 2, cw, chh);
      ctx.restore();
    }
  },

  trolley({ ctx, w, h, a, b, t }) {
    ctx.fillStyle = alpha(b, 0.4);
    circle(ctx, w * 0.75, h * 0.25, w * 0.12);
    ctx.fill();
    const x0 = ((t * 0.08) % 1) * w * 0.25 - w * 0.06;
    ctx.fillStyle = a;
    roundRect(ctx, x0 + w * 0.08, h * 0.42, w * 0.84, h * 0.24, w * 0.04);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = PAPER;
    for (let i = 0; i < 5; i++) ctx.fillRect(x0 + w * (0.13 + i * 0.155), h * 0.46, w * 0.11, h * 0.08);
    ctx.fillStyle = b;
    ctx.fillRect(x0 + w * 0.08, h * 0.58, w * 0.84, h * 0.025);
    ctx.fillStyle = a;
    for (const wx of [0.22, 0.34, 0.66, 0.78]) {
      circle(ctx, x0 + w * wx, h * 0.68, w * 0.035);
      ctx.fill();
    }
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.006;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.lineTo(w, h * 0.72);
    ctx.moveTo(x0 + w * 0.5, h * 0.42);
    ctx.lineTo(x0 + w * 0.42, h * 0.3);
    ctx.lineTo(x0 + w * 0.6, h * 0.3);
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(w, h * 0.3);
    ctx.stroke();
    halftone(ctx, 0, h * 0.76, w, h * 0.24, alpha(a, 0.35), w / 30, (_, v) => v * w * 0.01 + 0.4);
  },

  plate({ ctx, w, h, a, b }) {
    const cx = w * 0.5;
    const cy = h * 0.52;
    ctx.fillStyle = PAPER_SHADE;
    circle(ctx, cx, cy, w * 0.34);
    ctx.fill();
    ctx.strokeStyle = alpha(a, 0.6);
    ctx.lineWidth = w * 0.006;
    ctx.stroke();
    circle(ctx, cx, cy, w * 0.25);
    ctx.stroke();
    ctx.fillStyle = a;
    circle(ctx, cx - w * 0.06, cy - w * 0.03, w * 0.11);
    ctx.fill();
    ctx.fillStyle = b;
    circle(ctx, cx + w * 0.08, cy + w * 0.04, w * 0.08);
    ctx.fill();
    ctx.fillStyle = alpha(INK.moss, 0.9);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(cx + w * (0.02 + i * 0.02), cy - w * (0.1 - i * 0.015), w * 0.03, w * 0.012, i, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = a;
    ctx.fillRect(w * 0.08, h * 0.28, w * 0.022, h * 0.46);
    ctx.fillRect(w * 0.9, h * 0.28, w * 0.022, h * 0.46);
    for (let i = 0; i < 3; i++) ctx.fillRect(w * (0.072 + i * 0.012), h * 0.25, w * 0.006, h * 0.06);
  },

  notebook({ ctx, w, h, a, b }) {
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(-0.06);
    ctx.fillStyle = PAPER_SHADE;
    ctx.fillRect(-w * 0.34, -h * 0.36, w * 0.68, h * 0.72);
    ctx.strokeStyle = alpha(a, 0.5);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-w * 0.34, -h * 0.36, w * 0.68, h * 0.72);
    for (let i = 0; i < 7; i++) {
      const y = -h * 0.24 + i * h * 0.075;
      ctx.strokeStyle = a;
      ctx.lineWidth = w * 0.006;
      ctx.strokeRect(-w * 0.26, y - w * 0.025, w * 0.05, w * 0.05);
      if (i % 3 !== 2) {
        ctx.strokeStyle = b;
        ctx.lineWidth = w * 0.012;
        ctx.beginPath();
        ctx.moveTo(-w * 0.255, y);
        ctx.lineTo(-w * 0.24, y + w * 0.018);
        ctx.lineTo(-w * 0.205, y - w * 0.03);
        ctx.stroke();
      }
      ctx.fillStyle = alpha(a, 0.75);
      ctx.fillRect(-w * 0.17, y - 2, w * (0.22 + ((i * 37) % 17) / 100), 4);
    }
    ctx.restore();
    ctx.fillStyle = b;
    ctx.save();
    ctx.translate(w * 0.8, h * 0.22);
    ctx.rotate(0.7);
    ctx.fillRect(-w * 0.02, 0, w * 0.04, h * 0.32);
    ctx.fillStyle = a;
    ctx.beginPath();
    ctx.moveTo(-w * 0.02, h * 0.32);
    ctx.lineTo(w * 0.02, h * 0.32);
    ctx.lineTo(0, h * 0.36);
    ctx.fill();
    ctx.restore();
  },

  record({ ctx, w, h, a, b, t }) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const R = w * 0.4;
    ctx.fillStyle = a;
    circle(ctx, cx, cy, R);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = alpha(PAPER, 0.18);
    ctx.lineWidth = 1;
    for (let r = R * 0.45; r < R * 0.97; r += R * 0.04) {
      circle(ctx, cx, cy, r);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.9);
    ctx.fillStyle = b;
    circle(ctx, 0, 0, R * 0.34);
    ctx.fill();
    ctx.fillStyle = alpha(PAPER, 0.85);
    ctx.fillRect(-R * 0.2, -R * 0.06, R * 0.24, R * 0.04);
    ctx.restore();
    ctx.fillStyle = PAPER;
    circle(ctx, cx, cy, R * 0.035);
    ctx.fill();
    ctx.strokeStyle = alpha(PAPER, 0.35);
    ctx.lineWidth = w * 0.02;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.75, -2.4, -1.9);
    ctx.stroke();
  },

  dancer({ ctx, w, h, a, b, t }) {
    const spin = Math.sin(t * 1.1) * 0.25;
    ctx.strokeStyle = alpha(b, 0.7);
    ctx.lineWidth = w * 0.01;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.58, w * (0.2 + i * 0.06), h * 0.05, 0, Math.PI * (0.1 + i * 0.05) + spin, Math.PI * (0.9 - i * 0.05) + spin);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(spin * 0.4);
    ctx.fillStyle = a;
    circle(ctx, 0, -h * 0.25, w * 0.065);
    ctx.fill();
    ctx.lineCap = 'round';
    ctx.strokeStyle = a;
    ctx.lineWidth = w * 0.05;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.18);
    ctx.quadraticCurveTo(w * 0.03, -h * 0.05, 0, h * 0.06);
    ctx.stroke();
    ctx.lineWidth = w * 0.03;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.15);
    ctx.quadraticCurveTo(w * 0.15, -h * 0.25, w * 0.22, -h * 0.32);
    ctx.moveTo(0, -h * 0.15);
    ctx.quadraticCurveTo(-w * 0.14, -h * 0.1, -w * 0.24, -h * 0.16);
    ctx.moveTo(0, h * 0.06);
    ctx.lineTo(-w * 0.06, h * 0.3);
    ctx.moveTo(0, h * 0.06);
    ctx.quadraticCurveTo(w * 0.12, h * 0.12, w * 0.2, h * 0.04);
    ctx.stroke();
    ctx.fillStyle = alpha(b, 0.95);
    ctx.beginPath();
    ctx.moveTo(-w * 0.02, -h * 0.02);
    ctx.quadraticCurveTo(-w * 0.2, h * 0.1, -w * 0.18, h * 0.14);
    ctx.lineTo(w * 0.18, h * 0.12);
    ctx.quadraticCurveTo(w * 0.16, h * 0.06, w * 0.03, -h * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface DrawOptions {
  /** Frame number shown in the corner, e.g. 7 → "No. 07" */
  frame?: number;
  /** Small printed label along the bottom */
  label?: string;
  /** Seconds, for animated motifs */
  t?: number;
}

export function drawArt(canvas: HTMLCanvasElement, media: Media, opts: DrawOptions = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const [ia, ib] = media.inks ?? (['ink', 'rust'] as [Ink, Ink]);
  const seed = hashString(media.alt + media.motif);
  const rnd = mulberry32(seed);

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);

  // Each print gets a slightly different paper tone
  ctx.fillStyle = alpha('#C9B99A', 0.05 + rnd() * 0.08);
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'multiply';
  MOTIFS[media.motif]({ ctx, w, h, a: INK[ia], b: INK[ib], t: opts.t ?? 0, rnd });

  // Grain and a soft vignette so it feels printed
  ctx.globalCompositeOperation = 'multiply';
  const pattern = ctx.createPattern(getGrain(), 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
  const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(60,45,25,0.12)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // Printed marks
  ctx.globalCompositeOperation = 'source-over';
  const fs = Math.max(9, Math.min(15, Math.round(Math.min(w, h * 0.8) * 0.026)));
  ctx.font = `500 ${fs}px "Geist Mono", ui-monospace, monospace`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = alpha(INK.ink, 0.55);
  if (opts.frame !== undefined) {
    ctx.textAlign = 'right';
    ctx.fillText(`No. ${String(opts.frame).padStart(2, '0')}`, w - fs * 1.4, fs * 2.2);
  }
  if (opts.label) {
    ctx.textAlign = 'left';
    const maxChars = Math.floor((w - fs * 2.8) / (fs * 0.62));
    const text = opts.label.length > maxChars ? opts.label.slice(0, maxChars - 1) + '…' : opts.label;
    ctx.fillText(text.toUpperCase(), fs * 1.4, h - fs * 1.4);
  }
  ctx.restore();
}

export function makeArtCanvas(media: Media, width: number, opts: DrawOptions = {}) {
  const aspect = media.aspect ?? 0.8;
  const c = document.createElement('canvas');
  c.width = Math.round(width);
  c.height = Math.round(width / aspect);
  drawArt(c, media, opts);
  return c;
}

const urlCache = new Map<string, string>();
/** Static art as a data URL (cached), for <img> tags and CSS backgrounds */
export function artDataUrl(media: Media, width: number, opts: DrawOptions = {}) {
  const key = `${media.alt}|${media.motif}|${media.inks?.join()}|${media.aspect}|${width}|${opts.frame}|${opts.label}`;
  const hit = urlCache.get(key);
  if (hit) return hit;
  const url = makeArtCanvas(media, width, opts).toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}
