# Media

Drop real photos and clips here, then point a `cover.src` (or any `media.src`) at them.

- Photos: `.webp` or `.jpg`, about 1200px on the long side.
- Clips: short muted loops, 5 to 8 seconds, 720p `.mp4` (H.264). Set `kind: 'video'` and add a `poster` image.
- Anything without a `src` keeps showing its generated print.

Example in `src/content/content.ts`:

```ts
cover: {
  src: '/media/japan-01.mp4',
  poster: '/media/japan-01.webp',
  kind: 'video',
  alt: 'Shibuya crossing at night',
  aspect: 0.8,
  motif: 'torii', // still used as a fallback
  caption: 'Tokyo · July 2026 · first night · shot by me',
},
```
