import React from 'react';
import { HERO_INTRO as T, EASE, MOBILE_TIME_SCALE } from '../hero-motion/timeline.js';
import waple from '../assets/characters/waple-drop-in.webp';
import mongle from '../assets/hero/mongle.webp';
import dugeuni from '../assets/hero/dugeuni.webp';
import ttoto from '../assets/hero/ttoto.webp';
import themePersimmon from '../assets/hero/theme-persimmon.webp';
import themeTaiyaki from '../assets/hero/theme-taiyaki.webp';
import themeChristmas from '../assets/hero/theme-christmas.webp';

/*
 * Hero stage, "와플 오비트": 와플이 on a living waffle blob, with the three friends and this
 * season's themes orbiting on a tilted ellipse, passing in front of and behind 와플이.
 *
 * Layers, back to front (each drifts with the pointer by its own depth):
 *   glow → blob (morphing gradient, waffle texture, light sweep) → back half of the orbit →
 *   와플이 → front half of the orbit → sparkle particles
 *
 * The server renders a still frame (orbit at its resting angle). In the browser one
 * requestAnimationFrame loop drives the intro and then the ambient motion, and only runs while
 * the stage is on screen and the tab is visible. Reduced-motion visitors get the still frame.
 */

const MOBILE_QUERY = '(max-width: 760px)';
const TAU = Math.PI * 2;

const ORBIT = [
  { kind: 'friend', name: '몽글이', src: mongle, tint: 'var(--kw-sky-tint)', ring: 'var(--kw-sky)' },
  { kind: 'theme', name: '감 수확 테마', src: themePersimmon, ring: 'var(--kw-yellow)' },
  { kind: 'friend', name: '두근이', src: dugeuni, tint: 'var(--kw-coral-tint)', ring: 'var(--kw-coral)' },
  { kind: 'theme', name: '붕어빵 테마', src: themeTaiyaki, ring: 'var(--kw-coral)' },
  { kind: 'friend', name: '또또', src: ttoto, tint: 'var(--kw-green-tint)', ring: 'var(--kw-green)' },
  { kind: 'theme', name: '크리스마스 테마', src: themeChristmas, ring: 'var(--kw-green)' }
];

// Stage geometry, as fractions of the stage width W (the stage is W × W·ratio).
const GEO = {
  desktop: { maxW: 560, ratio: 0.92, orbit: { cx: 0.5, cy: 0.585, rx: 0.48, ry: 0.2 }, item: 0.15, blob: { cx: 0.5, cy: 0.47, r: 0.31 }, hero: 0.9, particles: 26 },
  mobile: { maxW: 360, ratio: 0.95, orbit: { cx: 0.5, cy: 0.585, rx: 0.46, ry: 0.19 }, item: 0.165, blob: { cx: 0.5, cy: 0.47, r: 0.31 }, hero: 0.9, particles: 14 }
};
const REST_ANGLE = -Math.PI / 2 + 0.35; // where the orbit rests in the server frame
const ORBIT_PERIOD = 46000; // ms per revolution

// --- small math helpers -----------------------------------------------------------------
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// A spring that settles with one soft overshoot.
const springOut = (t) => (t >= 1 ? 1 : 1 - Math.exp(-6.5 * t) * Math.cos(8.5 * t));
const seg = (ms, delay, dur) => clamp01((ms - delay) / dur);

// Smooth closed blob through n points around (cx, cy) with per-point radius (Catmull-Rom → Bézier).
function blobPath(cx, cy, radii, rot = 0) {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = rot + (i / n) * TAU;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + 'Z';
}
// Organic radius wobble: each point breathes on its own slow sine.
const BLOB_SEEDS = [0, 1.7, 3.1, 4.4, 5.9, 2.3, 0.8];
const blobRadii = (base, ms, amt = 0.055) => BLOB_SEEDS.map((s, i) =>
  base * (1 + amt * Math.sin(ms / (2300 + i * 310) + s) + amt * 0.6 * Math.sin(ms / (3700 + i * 170) + s * 1.7)));

// Position of orbit item i at a given orbit angle, in px within a W-wide stage.
function orbitPose(i, angle, W, g) {
  const a = angle + (i / ORBIT.length) * TAU;
  const s = Math.sin(a);
  const depth = (s + 1) / 2; // 0 = far (top of ellipse, behind), 1 = near (bottom, in front)
  return {
    x: (g.orbit.cx + g.orbit.rx * Math.cos(a)) * W,
    y: (g.orbit.cy + g.orbit.ry * s) * W,
    scale: 0.7 + 0.36 * depth,
    opacity: 0.62 + 0.38 * depth,
    front: s > 0
  };
}

// --- the stage ----------------------------------------------------------------------------
function OrbitItem({ it, i, sizePx, pose }) {
  return (
    <span className="kw-orb" data-orb={i} style={{
      width: sizePx, height: sizePx, opacity: pose.opacity, zIndex: pose.front ? 4 : 1,
      transform: `translate(${(pose.x - sizePx / 2).toFixed(1)}px, ${(pose.y - sizePx / 2).toFixed(1)}px) scale(${pose.scale.toFixed(3)})`
    }}>
      <span className="kw-orb-in" style={{ background: it.tint || '#fff', boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${it.ring}, 0 14px 30px rgba(46,33,26,.16)` }}>
        <img src={it.src} alt={it.kind === 'friend' ? '키즈와플 캐릭터 ' + it.name : '키즈와플 오감팡팡 ' + it.name} loading="eager" draggable="false"
          className={it.kind === 'friend' ? 'kw-orb-friend' : 'kw-orb-photo'} />
      </span>
    </span>
  );
}

export function HeroStage({ mobile = false }) {
  const g = mobile ? GEO.mobile : GEO.desktop;
  const W = g.maxW; // the server frame is laid out at the max width; the browser re-measures
  const sizePx = Math.round(g.item * W);
  const uid = mobile ? 'm' : 'd';
  const d = blobPath(200, 200, blobRadii(g.blob.r * 400, 0, 0));
  return (
    <div data-kw="stage" className="kw-stage" style={{ width: `min(100%, ${g.maxW}px)`, aspectRatio: `1 / ${g.ratio}` }}>
      <span className="kw-glow" data-depth="-4" aria-hidden="true" />
      <svg className="kw-blob" data-depth="-8" viewBox="0 0 400 400" aria-hidden="true"
        style={{ left: `${(g.blob.cx - 0.5) * 100}%`, top: `${(g.blob.cy - 0.5) / g.ratio * 100}%`, height: `${100 / g.ratio}%` }}>
        <defs>
          <radialGradient id={`kwBlobFill-${uid}`} cx="38%" cy="30%" r="80%">
            <stop offset="0" stopColor="#FFE08A" />
            <stop offset=".55" stopColor="#FBC54B" />
            <stop offset="1" stopColor="#F4A93A" />
          </radialGradient>
          <linearGradient id={`kwSheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`kwBlobClip-${uid}`}><path className="kw-blob-shape" d={d} /></clipPath>
        </defs>
        <path className="kw-blob-shape" d={d} fill={`url(#kwBlobFill-${uid})`} />
        <g clipPath={`url(#kwBlobClip-${uid})`}>
          <g className="kw-grid" transform="rotate(-8 200 200)" stroke="#D88E22" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round">
            {Array.from({ length: 11 }, (_, i) => 40 + i * 32).map((p, i) => (
              <React.Fragment key={i}>
                <line className="kw-draw" pathLength="1" x1={p} y1="-20" x2={p} y2="420" />
                <line className="kw-draw" pathLength="1" x1="-20" y1={p} x2="420" y2={p} />
              </React.Fragment>
            ))}
          </g>
          <rect className="kw-sheen" x="-160" y="-60" width="120" height="520" fill={`url(#kwSheen-${uid})`} />
        </g>
      </svg>
      <svg className="kw-ring" data-depth="6" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
        style={{ left: `${(g.orbit.cx - g.orbit.rx) * 100}%`, top: `${(g.orbit.cy - g.orbit.ry) / g.ratio * 100}%`, width: `${g.orbit.rx * 200}%`, height: `${(g.orbit.ry * 200) / g.ratio}%` }}>
        <ellipse cx="50" cy="50" rx="49.5" ry="48.5" fill="none" stroke="#2E211A" strokeOpacity=".16" strokeWidth="1.2" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="kw-orbit">
        {ORBIT.map((it, i) => <OrbitItem key={it.name} it={it} i={i} sizePx={sizePx} pose={orbitPose(i, REST_ANGLE, W, g)} />)}
      </div>
      <span className="kw-hero" data-depth="4" style={{ width: `${g.hero * 100}%` }}>
        <img src={waple} alt="키즈와플 캐릭터 와플이가 두 팔을 벌리고 웃고 있다" width="1080" height="810" fetchpriority="high" draggable="false" />
      </span>
      <canvas className="kw-sparks" data-depth="16" aria-hidden="true" />
    </div>
  );
}

// --- headline -----------------------------------------------------------------------------
// One line of the headline: words rise out of a mask; `mark` gets a hand-drawn underline.
export function HopText({ text, mark }) {
  return text.split(' ').map((w, wi) => (
    <React.Fragment key={wi}>
      {wi > 0 ? ' ' : null}
      <span className="kw-word">
        <span className="kw-mask"><span className="kw-word-in" aria-hidden="true">{w}</span></span>
        {w === mark && (
          <svg className="kw-ul" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
            <path className="kw-draw" pathLength="1" d="M3 9 C 40 3, 80 13, 120 7 S 175 4, 197 8"
              fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </span>
    </React.Fragment>
  ));
}

// --- motion engine ------------------------------------------------------------------------
const prefersMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export function useHeroIntro(rootRef, mobile) {
  React.useEffect(() => {
    if (mobile !== prefersMobile()) return; // still the server (desktop) layout on a phone: wait for the real one
    const root = rootRef.current;
    const stage = root && root.querySelector('[data-kw="stage"]');
    if (!stage) return;
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = html.classList.contains('kw-intro') && !reduce;
    const k = mobile ? MOBILE_TIME_SCALE : 1;
    const g = mobile ? GEO.mobile : GEO.desktop;
    const cleanups = [];
    const anims = [];

    // Text intro (Web Animations): words rise out of their masks, then the rest of the copy.
    if (intro) {
      const play = (el, frames, o) => el && anims.push(el.animate(frames, { fill: 'backwards', easing: EASE.out, ...o, duration: o.duration * k, delay: (o.delay || 0) * k }));
      root.querySelectorAll('h1 .kw-word-in').forEach((w, i) =>
        play(w, [{ transform: 'translateY(108%) rotate(4deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: T.words.duration, delay: T.words.delay + i * T.words.stagger, easing: EASE.expo }));
      play(root.querySelector('h1 .kw-draw'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], T.underline);
      root.querySelectorAll('[data-kw-rise]').forEach((el, i) =>
        play(el, [{ transform: 'translateY(18px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: T.rise.duration, delay: T.rise.delay + i * T.rise.stagger, easing: EASE.expo }));
      play(root.querySelector('[data-kw="cta"]'), [{ transform: 'scale(1)' }, { transform: 'scale(1.05)', offset: .45 }, { transform: 'scale(1)' }],
        { ...T.cta, fill: 'none', easing: 'ease-in-out' });
      const logo = document.querySelector('.kw-nav a[aria-label$="첫 화면으로"], .kw-mnav a[aria-label$="첫 화면으로"]');
      play(logo, [{ transform: 'scale(.86)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { ...T.logo, easing: EASE.expo });
    }

    // Stage elements
    const blobShapes = [...stage.querySelectorAll('.kw-blob-shape')];
    const blobSvg = stage.querySelector('.kw-blob');
    const gridLines = [...stage.querySelectorAll('.kw-grid .kw-draw')];
    const orbs = [...stage.querySelectorAll('.kw-orb')];
    const hero = stage.querySelector('.kw-hero');
    const glow = stage.querySelector('.kw-glow');
    const ring = stage.querySelector('.kw-ring');
    const canvas = stage.querySelector('.kw-sparks');
    const layers = [...stage.querySelectorAll('[data-depth]')];
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, dpr = 1, sizePx = 0;
    const measure = () => {
      const r = stage.getBoundingClientRect();
      W = r.width; H = r.height; sizePx = Math.round(g.item * W);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      orbs.forEach((o) => { o.style.width = o.style.height = sizePx + 'px'; });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(stage); cleanups.push(() => ro.disconnect());

    // Sparkle particles: slow rise, sideways sway, twinkle.
    const rnd = (a, b) => a + Math.random() * (b - a);
    const sparks = Array.from({ length: g.particles }, () => ({
      x: rnd(0.08, 0.92), y: rnd(0.05, 0.95), r: rnd(1.2, 3), v: rnd(0.012, 0.03), sw: rnd(0.004, 0.012), ph: rnd(0, TAU),
      tw: rnd(1600, 3200), star: Math.random() < 0.3, c: Math.random() < 0.55 ? '255,255,255' : Math.random() < 0.6 ? '251,197,75' : '255,88,0'
    }));
    const drawSparks = (ms, fade) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (fade <= 0) return;
      for (const p of sparks) {
        const y = ((p.y - (ms / 1000) * p.v) % 1 + 1) % 1;
        const x = p.x + Math.sin(ms / 1000 * 0.9 + p.ph) * p.sw * 4;
        const a = fade * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(ms / p.tw * TAU + p.ph))) * Math.min(1, y * 6, (1 - y) * 6);
        const px = x * W, py = y * H;
        ctx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
        ctx.beginPath();
        if (p.star) {
          const s = p.r * 2.4;
          ctx.moveTo(px, py - s); ctx.quadraticCurveTo(px, py, px + s, py); ctx.quadraticCurveTo(px, py, px, py + s);
          ctx.quadraticCurveTo(px, py, px - s, py); ctx.quadraticCurveTo(px, py, px, py - s);
        } else ctx.arc(px, py, p.r, 0, TAU);
        ctx.fill();
      }
    };

    // Pointer depth (desktop): every layer drifts by its data-depth, smoothed.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!mobile && !reduce) {
      const onMove = (e) => {
        const r = stage.getBoundingClientRect();
        ptr.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
        ptr.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
      };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; };
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave);
      cleanups.push(() => { root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); });
    }

    // One frame of the whole stage at `ms` since it started playing.
    const startAngle = REST_ANGLE - 0.9; // the orbit sweeps in to its resting angle during the intro
    const frame = (ms, introOn) => {
      const t = introOn ? ms / k : 1e9; // intro clock in design milliseconds
      // blob: grows from a seed with a spring, then breathes and slowly turns
      const grow = springOut(seg(t, T.blob.delay, T.blob.duration));
      const d = blobPath(200, 200, blobRadii(g.blob.r * 400 * (0.25 + 0.75 * grow), ms), ms / 60000);
      blobShapes.forEach((p) => p.setAttribute('d', d));
      blobSvg.style.opacity = Math.min(1, seg(t, T.blob.delay, 260));
      glow.style.opacity = easeInOutCubic(seg(t, 0, 900));
      gridLines.forEach((l, i) => {
        l.style.strokeDashoffset = (1 - easeOutExpo(seg(t, T.grid.delay + (i >> 1) * T.grid.stagger + (i % 2) * 60, T.grid.duration))).toFixed(3);
      });
      // 와플이: settles with a spring (visible from the first frame), then breathes
      const hs = springOut(seg(t, T.hero.delay, T.hero.duration));
      const heroY = (1 - hs) * 0.06 * W + Math.sin(ms / 2600 * TAU) * 0.012 * W;
      // orbit: items fly out from behind 와플이 on a spiral, then keep turning
      const op = seg(t, T.orbit.delay, T.orbit.duration);
      const angle = startAngle + 0.9 * easeOutExpo(op) + (ms / ORBIT_PERIOD) * TAU;
      ring.style.opacity = easeInOutCubic(seg(t, T.orbit.delay, 700));
      const span = T.orbit.duration - (ORBIT.length - 1) * T.orbit.stagger;
      orbs.forEach((o, i) => {
        const pp = clamp01((op * T.orbit.duration - i * T.orbit.stagger) / span);
        const spread = easeOutExpo(pp);
        const pose = orbitPose(i, angle, W, g);
        const cx = g.orbit.cx * W, cy = g.orbit.cy * W * 0.9;
        const x = cx + (pose.x - cx) * spread, y = cy + (pose.y - cy) * spread;
        const bob = Math.sin(ms / (2200 + i * 260) + i) * 0.008 * W;
        o.style.transform = `translate(${(x - sizePx / 2 + ptr.x * 10).toFixed(1)}px, ${(y - sizePx / 2 + bob + ptr.y * 6).toFixed(1)}px) scale(${(pose.scale * (0.4 + 0.6 * springOut(pp))).toFixed(3)})`;
        o.style.opacity = (pose.opacity * Math.min(1, pp * 3)).toFixed(3);
        o.style.zIndex = pose.front ? 4 : 1;
      });
      // pointer depth
      ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
      for (const el of layers) {
        const dep = +el.dataset.depth;
        const extra = el === hero ? ` translateY(${heroY.toFixed(1)}px) scale(${(0.94 + 0.06 * hs).toFixed(4)})` : '';
        el.style.transform = `translate(${(ptr.x * dep).toFixed(2)}px, ${(ptr.y * dep * 0.6).toFixed(2)}px)${extra}`;
      }
      drawSparks(ms, easeInOutCubic(seg(t, T.sparks.delay, 900)));
    };

    html.classList.remove('kw-intro');
    try { sessionStorage.setItem('kw-intro', '1'); } catch (e) { /* private mode */ }
    if (reduce) { frame(0, false); return () => cleanups.forEach((c) => c()); }

    // Run only while the stage is on screen and the tab is visible.
    let raf = 0, visible = false, t0 = 0, pausedAt = 0, introOn = intro, started = false;
    const loop = (now) => {
      if (!t0) t0 = now;
      const ms = now - t0;
      if (introOn && ms / k > T.end) introOn = false;
      frame(ms, introOn);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      if (pausedAt && t0) t0 += performance.now() - pausedAt;
      pausedAt = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { if (!raf) return; cancelAnimationFrame(raf); raf = 0; pausedAt = performance.now(); };
    // Hold the start frame until the stage is on screen (on phones it starts below the fold).
    frame(0, introOn);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) { if (!started) { started = true; t0 = 0; } start(); } else stop();
    }, { threshold: 0.2 });
    io.observe(stage);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    cleanups.push(() => { io.disconnect(); stop(); document.removeEventListener('visibilitychange', onVis); });

    // Any interaction ends the text intro at once (the stage keeps its own pace).
    const skip = () => anims.forEach((a) => { try { a.finish(); } catch (e) { /* done */ } });
    const events = ['pointerdown', 'wheel', 'keydown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, skip, { once: true, passive: true }));
    cleanups.push(() => events.forEach((ev) => window.removeEventListener(ev, skip)));
    return () => cleanups.forEach((c) => c());
  }, [mobile]);
}
