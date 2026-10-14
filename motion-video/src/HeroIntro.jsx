import React from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BEZIER, HERO_VIDEO as T } from '../../src/hero-motion/timeline.js';

const C = {
  cream: '#FFF7EC', orange: '#FF5800', ink: '#2E211A', yellow: '#FBC54B', yellowTint: '#FFF0CC',
  coral: '#EE8383', coralTint: '#FBDDDB', sky: '#7FB3E0', skyTint: '#DCEBF8', green: '#8DBF57', greenTint: '#E4F0D3',
  mint: '#9FDCC4', mintTint: '#E3F5EE', grid: '#E2A23A'
};
const ease = {
  out: Easing.bezier(...BEZIER.out),
  inOut: Easing.bezier(...BEZIER.inOut),
  bounce: Easing.bezier(...BEZIER.bounce)
};
const BLOB = '54% 46% 43% 57% / 49% 44% 56% 51%';

// 0 → 1 over a beat of the timeline, eased.
const progress = (ms, beat, e = ease.out, i = 0, stagger = beat.stagger || 0) =>
  interpolate(ms, [beat.delay + i * stagger, beat.delay + i * stagger + beat.duration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e });
// Pop: 0 → overshoot → 1.
const pop = (p, over = 1.12) => interpolate(p, [0, 0.65, 1], [0, over, 1]);

function useFonts() {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const faces = [
      new FontFace('Nanum Square Round', `url(${staticFile('fonts/NanumSquareRoundEB.woff2')})`, { weight: '800' }),
      new FontFace('Nanum Square Round', `url(${staticFile('fonts/NanumSquareRoundB.woff2')})`, { weight: '700' })
    ];
    Promise.all(faces.map((f) => f.load().then((l) => document.fonts.add(l)))).then(() => continueRender(handle));
  }, [handle]);
}

// Layout per format, in pixels of the frame.
function layout(w, h) {
  if (w > h * 1.2) {
    // 16:9 — copy on the left, stage on the right (like the website)
    const S = h * 0.8;
    return {
      stage: { left: w * 0.53, top: h * 0.1, size: S },
      logo: { left: w * 0.075, top: h * 0.12, width: w * 0.24 },
      head: { left: w * 0.075, top: h * 0.34, size: h * 0.085, align: 'left' },
      themes: { left: w * 0.075, top: h * 0.66, size: h * 0.12, justify: 'flex-start' },
      cta: { left: w * 0.075, top: h * 0.83, size: h * 0.04, justify: 'flex-start' }
    };
  }
  if (h > w * 1.2) {
    // 9:16 — stacked
    const S = w * 0.86;
    return {
      stage: { left: (w - S) / 2, top: h * 0.14, size: S },
      logo: { left: w * 0.24, top: h * 0.055, width: w * 0.52 },
      head: { left: 0, top: h * 0.6, size: w * 0.088, align: 'center', width: w },
      themes: { left: 0, top: h * 0.775, size: w * 0.15, justify: 'center', width: w },
      cta: { left: 0, top: h * 0.885, size: w * 0.042, justify: 'center', width: w }
    };
  }
  // 1:1 — stacked, compact
  const S = h * 0.5;
  return {
    stage: { left: (w - S) / 2, top: h * 0.135, size: S },
    logo: { left: w * 0.32, top: h * 0.035, width: w * 0.36 },
    head: { left: 0, top: h * 0.645, size: w * 0.056, align: 'center', width: w },
    themes: null,
    cta: { left: 0, top: h * 0.85, size: w * 0.034, justify: 'center', width: w }
  };
}

function WaffleGrid({ ms }) {
  const lines = [];
  for (let i = 1; i <= 7; i++) {
    const p = i * 12.5;
    lines.push({ x1: p, y1: 0, x2: p, y2: 100 }, { x1: 0, y1: p, x2: 100, y2: p });
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {lines.map((l, i) => (
        <line key={i} {...l} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - progress(ms, T.grid, ease.out, i % 7)}
          stroke={C.grid} strokeOpacity={0.5} strokeWidth={0.55} strokeLinecap="round" />
      ))}
    </svg>
  );
}

const FRIENDS = [
  { src: 'mongle.webp', tint: C.skyTint, size: 0.215, pos: { left: '-1%', top: '6%' } },
  { src: 'dugeuni.webp', tint: C.coralTint, size: 0.19, pos: { right: '-2%', top: '13%' } },
  { src: 'ttoto.webp', tint: C.greenTint, size: 0.18, pos: { right: '3%', bottom: '17%' } }
];

function Stage({ ms, L }) {
  const S = L.stage.size;
  const blobP = progress(ms, T.blob, ease.out);
  const heroP = progress(ms, T.hero, ease.bounce);
  const bob = (period, phase) => Math.sin((ms / period) * Math.PI * 2 + phase) * S * 0.012;
  return (
    <div style={{ position: 'absolute', left: L.stage.left, top: L.stage.top, width: S, height: S * (470 / 540) }}>
      <div style={{
        position: 'absolute', left: '13%', top: '9%', width: '74%', aspectRatio: '1 / 1', borderRadius: BLOB, overflow: 'hidden',
        background: C.yellow, opacity: 0.9 * Math.min(1, blobP * 1.6), transform: `scale(${interpolate(blobP, [0, 0.7, 1], [0.7, 1.04, 1])})`
      }}>
        <WaffleGrid ms={ms} />
      </div>
      {/* 와플이 drops onto the blob, squashes, then bobs */}
      <Img src={staticFile('waple.webp')} style={{
        position: 'absolute', left: 0, top: 0, width: '100%',
        opacity: Math.min(1, heroP * 3),
        transform: `translateY(${interpolate(heroP, [0, 1], [-S * 0.35, 0]) + (heroP >= 1 ? bob(5200, 0) : 0)}px) scale(${interpolate(heroP, [0, 0.8, 0.9, 1], [1, 1, 1.03, 1])}, ${interpolate(heroP, [0, 0.8, 0.9, 1], [1, 1, 0.95, 1])})`
      }} />
      {FRIENDS.map((f, i) => {
        const p = progress(ms, T.friends, ease.out, i);
        const s = pop(p);
        return (
          <div key={f.src} style={{
            position: 'absolute', width: S * f.size, height: S * f.size, ...f.pos, opacity: Math.min(1, p * 2),
            transform: `translateY(${p >= 1 ? bob(4600 + i * 800, i) : 0}px) scale(${s}) rotate(${interpolate(p, [0, 0.65, 1], [-12, 4, 0])}deg)`
          }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: f.tint, border: `${S * 0.011}px solid #fff`, boxShadow: '0 10px 30px rgba(46,33,26,.12)' }}>
              <Img src={staticFile(f.src)} style={{ position: 'absolute', left: '8%', width: '84%', top: '12%' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Logo({ ms, L }) {
  const p = progress(ms, T.logo, ease.out);
  const sp = progress(ms, T.sparkles, ease.out);
  const colors = [C.yellow, C.orange, C.mint, C.coral, C.sky, C.yellow, C.green, C.orange];
  const w = L.logo.width;
  return (
    <div style={{ position: 'absolute', left: L.logo.left, top: L.logo.top, width: w, height: w * (153 / 584) }}>
      {sp > 0 && sp < 1 && colors.map((c, i) => {
        const a = (i / colors.length) * Math.PI * 2;
        const r = w * (0.45 + (i % 2) * 0.12) * sp;
        const d = w * 0.03 * (1 - sp * 0.8);
        return <div key={i} style={{ position: 'absolute', left: w / 2 + Math.cos(a) * r - d / 2, top: (w * 153 / 584) / 2 + Math.sin(a) * r * 0.55 - d / 2, width: d, height: d, borderRadius: '50%', background: c, opacity: 1 - sp }} />;
      })}
      <Img src={staticFile('logo.png')} style={{ width: '100%', opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 0.6, 1], [0.6, 1.08, 1])})` }} />
    </div>
  );
}

function Headline({ ms, L }) {
  const lines = [{ text: '북적이지 않아서,', color: C.orange }, { text: '아이가 머무는 오감놀이', color: C.ink, mark: '오감놀이' }];
  let n = 0;
  const ul = progress(ms, T.underline, ease.out);
  return (
    <div style={{ position: 'absolute', left: L.head.left, top: L.head.top, width: L.head.width, textAlign: L.head.align, fontFamily: 'Nanum Square Round', fontWeight: 800, fontSize: L.head.size, lineHeight: 1.18, letterSpacing: '-0.01em' }}>
      {lines.map((line) => (
        <div key={line.text} style={{ color: line.color, whiteSpace: 'nowrap' }}>
          {line.text.split(' ').map((word, wi) => {
            const chars = [...word].map((ch) => {
              const p = progress(ms, T.hop, ease.out, n++);
              return (
                <span key={n} style={{ display: 'inline-block', opacity: Math.min(1, p * 2.5), transform: `translateY(${interpolate(p, [0, 0.55, 1], [0.6, -0.12, 0])}em)` }}>{ch}</span>
              );
            });
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? ' ' : ''}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  {chars}
                  {word === line.mark && (
                    <svg viewBox="0 0 200 14" preserveAspectRatio="none" style={{ position: 'absolute', left: '-2%', width: '104%', bottom: '-0.14em', height: '0.3em', overflow: 'visible' }}>
                      <path d="M3 9 C 40 3, 80 13, 120 7 S 175 4, 197 8" pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - ul}
                        fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
                    </svg>
                  )}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const THEMES = [
  { src: 'theme-persimmon.webp', ring: C.yellow },
  { src: 'theme-taiyaki.webp', ring: C.coral },
  { src: 'theme-christmas.webp', ring: C.green }
];

function Themes({ ms, L }) {
  if (!L.themes) return null;
  const s = L.themes.size;
  return (
    <div style={{ position: 'absolute', left: L.themes.left, top: L.themes.top, width: L.themes.width, display: 'flex', gap: s * 0.22, justifyContent: L.themes.justify }}>
      {THEMES.map((t, i) => {
        const p = progress(ms, T.themes, ease.out, i);
        return (
          <div key={t.src} style={{ width: s, height: s, borderRadius: '50%', overflow: 'hidden', border: `${s * 0.06}px solid ${t.ring}`, boxShadow: '0 8px 24px rgba(46,33,26,.12)', opacity: Math.min(1, p * 2), transform: `scale(${pop(p, 1.1)})` }}>
            <Img src={staticFile(t.src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}
    </div>
  );
}

function Cta({ ms, L }) {
  const p = progress(ms, T.cta, ease.out);
  const u = progress(ms, T.url, ease.out);
  const f = L.cta.size;
  return (
    <div style={{ position: 'absolute', left: L.cta.left, top: L.cta.top, width: L.cta.width, display: 'flex', alignItems: 'center', gap: f * 0.8, justifyContent: L.cta.justify, fontFamily: 'Nanum Square Round', fontWeight: 800 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: f * 0.45, padding: `${f * 0.55}px ${f * 1.1}px`, borderRadius: 999, background: C.orange, color: '#fff', fontSize: f, boxShadow: '0 10px 26px rgba(255,88,0,.3)', opacity: Math.min(1, p * 2), transform: `scale(${pop(p, 1.08)})` }}>
        <svg width={f * 1.05} height={f * 1.05} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
        카카오톡 상담하기
      </div>
      <div style={{ fontSize: f * 0.85, color: C.ink, fontWeight: 700, opacity: u, transform: `translateX(${(1 - u) * f}px)` }}>kidswaffle.com</div>
    </div>
  );
}

// Soft pastel shapes drifting in the background (as on the website).
function Backdrop({ ms, w, h }) {
  const m = Math.min(w, h);
  const shapes = [
    { c: C.yellowTint, s: 0.6, x: -0.12, y: -0.1, o: 0.8, ph: 0 },
    { c: C.mintTint, s: 0.45, x: -0.1, y: 0.7, o: 0.8, ph: 1.4 },
    { c: C.coralTint, s: 0.5, x: 0.82, y: -0.12, o: 0.6, ph: 2.2 },
    { c: C.skyTint, s: 0.38, x: 0.85, y: 0.75, o: 0.6, ph: 0.7 }
  ];
  return shapes.map((b, i) => (
    <div key={i} style={{
      position: 'absolute', left: b.x * w, top: b.y * h, width: b.s * m, height: b.s * m * 0.86, background: b.c, opacity: b.o, borderRadius: '58% 42% 47% 53% / 46% 52% 48% 54%',
      transform: `translateY(${Math.sin(ms / 1800 + b.ph) * m * 0.015}px) rotate(${Math.sin(ms / 2600 + b.ph) * 4}deg)`
    }} />
  ));
}

export function HeroIntro() {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const L = layout(width, height);
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: 'hidden' }}>
      <Backdrop ms={ms} w={width} h={height} />
      <Stage ms={ms} L={L} />
      <Logo ms={ms} L={L} />
      <Headline ms={ms} L={L} />
      <Themes ms={ms} L={L} />
      <Cta ms={ms} L={L} />
    </AbsoluteFill>
  );
}
