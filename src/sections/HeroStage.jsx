import React from 'react';
import { HERO_INTRO as T, EASE, MOBILE_TIME_SCALE } from '../hero-motion/timeline.js';
import front from '../assets/waple/front.webp';
import qLeft from '../assets/waple/q-left.webp';
import qRight from '../assets/waple/q-right.webp';
import sideLeft from '../assets/waple/side-left.webp';
import sideRight from '../assets/waple/side-right.webp';
import back from '../assets/waple/back.webp';
import wave from '../assets/waple/wave.webp';

/*
 * Hero motion "와플이 등장", built only from 와플이's official turnaround renders (no redraw).
 *
 * IntroOverlay (first visit per tab): a round waffle draws itself, 와플이 drops in spinning through
 * the turnaround frames, lands with a squash, a shockwave and a burst of waffle confetti, waves
 * hello, then flies into the hero stage (desktop) or zooms away (phone) while the headline rises.
 *
 * HeroStage: 와플이 stays alive on the waffle — breathing, looking around, waving now and then,
 * turning toward the pointer, and spinning with a jump when tapped.
 *
 * The server HTML is the still final frame. One requestAnimationFrame loop per part, paused while
 * off screen or in a hidden tab. Reduced-motion visitors get the still frame and no overlay.
 */

const MOBILE_QUERY = '(max-width: 760px)';
const TAU = Math.PI * 2;

// Frames share one crop box, so scale and floor line match. Named by where 와플이 faces on screen.
const FRAMES = [
  { k: 'front', src: front },
  { k: 'l3', src: qRight }, // three-quarter, facing screen left
  { k: 'l', src: sideLeft },
  { k: 'back', src: back },
  { k: 'r', src: sideRight },
  { k: 'r3', src: qLeft }, // three-quarter, facing screen right
  { k: 'wave', src: wave }
];
const SPIN = ['front', 'l3', 'l', 'back', 'r', 'r3'];
const LINES = ['안녕! 나는 와플이야', '같이 놀자!', '오감놀이 좋아!', '만지고 느껴 봐!'];
const STAGE_MAX = { desktop: 520, mobile: 340 };

// --- small math helpers -----------------------------------------------------------------
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const springOut = (t) => (t >= 1 ? 1 : 1 - Math.exp(-6.5 * t) * Math.cos(8.5 * t));
const seg = (ms, delay, dur) => clamp01((ms - delay) / dur);
// Landing squash: 1 at impact, wobbling back to 0.
const wobble = (s) => (s >= 1 ? 0 : Math.exp(-5 * s) * Math.cos(10 * s));
const spinFrame = (p, turns) => (p >= 1 ? 'front' : SPIN[Math.floor(p * turns * SPIN.length) % SPIN.length]);

// --- shared pieces ------------------------------------------------------------------------
// A round waffle: crust rim, golden face, a grid of ridges that turns very slowly, a light sweep.
function WaffleDisc({ uid }) {
  const lines = Array.from({ length: 9 }, (_, i) => 72 + i * 32);
  return (
    <svg className="kw-disc" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id={`kwDiscFill-${uid}`} cx="40%" cy="34%" r="75%">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset=".5" stopColor="#FBC54B" />
          <stop offset="1" stopColor="#EFA03A" />
        </radialGradient>
        <linearGradient id={`kwDiscSheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`kwDiscClip-${uid}`}><circle cx="200" cy="200" r="168" /></clipPath>
      </defs>
      <circle cx="200" cy="200" r="190" fill="#E9952F" />
      <circle cx="200" cy="200" r="182" fill="#F6B445" />
      <circle cx="200" cy="200" r="170" fill={`url(#kwDiscFill-${uid})`} />
      <g clipPath={`url(#kwDiscClip-${uid})`}>
        <g className="kw-disc-grid" stroke="#D98A20" strokeOpacity=".42" strokeWidth="9" strokeLinecap="round">
          {lines.map((p, i) => (
            <React.Fragment key={i}>
              <line className="kw-draw" pathLength="1" x1={p} y1="24" x2={p} y2="376" />
              <line className="kw-draw" pathLength="1" x1="24" y1={p} x2="376" y2={p} />
            </React.Fragment>
          ))}
        </g>
        <rect className="kw-sheen" x="-160" y="-60" width="110" height="520" fill={`url(#kwDiscSheen-${uid})`} />
      </g>
      <circle cx="200" cy="200" r="170" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="3" />
    </svg>
  );
}

// 와플이: every frame stacked; only the one with `.on` shows.
function Sprite({ eagerFront }) {
  return FRAMES.map((f) => (
    <img key={f.k} src={f.src} data-f={f.k} className={f.k === 'front' ? 'on' : undefined}
      alt={f.k === 'front' ? '키즈와플 캐릭터 와플이가 웃으며 서 있다' : ''}
      width="492" height="640" draggable="false" decoding="async"
      loading={f.k === 'front' && eagerFront ? 'eager' : 'lazy'}
      fetchpriority={f.k === 'front' && eagerFront ? 'high' : undefined} />
  ));
}

function Bubble({ text }) {
  return <span className="kw-bubble" aria-hidden="true"><span className="kw-bubble-in">{text}</span></span>;
}

// --- the stage ----------------------------------------------------------------------------
export function HeroStage({ mobile = false }) {
  return (
    <div data-kw="stage" className="kw-stage" style={{ width: `min(100%, ${mobile ? STAGE_MAX.mobile : STAGE_MAX.desktop}px)` }}>
      <span className="kw-glow" aria-hidden="true" />
      <WaffleDisc uid={mobile ? 'm' : 'd'} />
      <span className="kw-shadow" aria-hidden="true" />
      <button type="button" className="kw-waple" aria-label="와플이와 인사하기">
        <span className="kw-sprite"><Sprite eagerFront /></span>
      </button>
      <Bubble text={LINES[0]} />
      <canvas className="kw-fx" aria-hidden="true" />
    </div>
  );
}

// Full-screen intro. Shown only while <html> has `kw-intro` (first visit, motion allowed).
export function IntroOverlay() {
  return (
    <div data-kw="ov" className="kw-ov">
      <span className="kw-ov-bg" />
      <span className="kw-ov-rays" />
      <div className="kw-ov-group">
        <WaffleDisc uid="ov" />
        <span className="kw-ov-ring" />
        <span className="kw-shadow" />
        <span className="kw-waple"><span className="kw-sprite"><Sprite eagerFront /></span></span>
        <Bubble text={LINES[0]} />
      </div>
      <canvas className="kw-ov-fx" aria-hidden="true" />
      <button type="button" className="kw-ov-skip">건너뛰기</button>
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

// --- particles ----------------------------------------------------------------------------
const COLORS = ['#FBC54B', '#FF8A3D', '#EE8383', '#8DBF57', '#7FB3E0', '#FFFFFF'];
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function drawParticle(ctx, p, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  const s = p.size;
  if (p.kind === 'waffle') {
    // a tiny waffle square: rounded tile with a 2×2 grid
    const h = s / 2, r = s * 0.22;
    ctx.fillStyle = '#FBC54B';
    ctx.beginPath();
    ctx.moveTo(-h + r, -h); ctx.arcTo(h, -h, h, h, r); ctx.arcTo(h, h, -h, h, r); ctx.arcTo(-h, h, -h, -h, r); ctx.arcTo(-h, -h, h, -h, r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(217,138,32,.75)';
    ctx.lineWidth = Math.max(1, s * 0.12);
    ctx.beginPath();
    for (const q of [-h / 3, h / 3]) { ctx.moveTo(q, -h * 0.8); ctx.lineTo(q, h * 0.8); ctx.moveTo(-h * 0.8, q); ctx.lineTo(h * 0.8, q); }
    ctx.stroke();
  } else if (p.kind === 'star') {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill();
  } else if (p.kind === 'heart') {
    ctx.fillStyle = p.color;
    const k = s / 2;
    ctx.beginPath();
    ctx.moveTo(0, k * 0.9);
    ctx.bezierCurveTo(-k * 1.6, -k * 0.2, -k * 0.7, -k * 1.5, 0, -k * 0.55);
    ctx.bezierCurveTo(k * 0.7, -k * 1.5, k * 1.6, -k * 0.2, 0, k * 0.9);
    ctx.fill();
  } else if (p.kind === 'strip') {
    ctx.fillStyle = p.color;
    ctx.fillRect(-s / 2, -s / 5, s, s / 2.5);
  } else {
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// A burst of confetti from (x, y): waffle tiles, stars, hearts and paper strips, with gravity.
function burst(list, x, y, n, power) {
  for (let i = 0; i < n; i++) {
    const a = rnd(-Math.PI * 0.95, -Math.PI * 0.05);
    const v = rnd(0.35, 1) * power;
    const r = Math.random();
    list.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: rnd(0, TAU), vr: rnd(-0.012, 0.012),
      kind: r < 0.32 ? 'waffle' : r < 0.55 ? 'star' : r < 0.68 ? 'heart' : r < 0.88 ? 'strip' : 'dot',
      color: pick(COLORS), size: rnd(7, 15) * (power > 1 ? 1.2 : 1), life: 0, max: rnd(1100, 1700)
    });
  }
}
// Advance and draw burst particles (px per ms). Returns whether any are left.
function stepBurst(ctx, list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life += dt;
    if (p.life > p.max) { list.splice(i, 1); continue; }
    p.vy += 0.0016 * dt; p.vx *= Math.pow(0.996, dt); p.vy *= Math.pow(0.998, dt);
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    drawParticle(ctx, p, Math.min(1, (p.max - p.life) / 300));
  }
  return list.length > 0;
}

function fitCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  return { w: r.width, h: r.height, dpr };
}

const setFrame = (sprite, k) => {
  if (sprite.dataset.f === k) return;
  sprite.dataset.f = k;
  for (const img of sprite.children) img.classList.toggle('on', img.dataset.f === k);
};

// --- the intro overlay ----------------------------------------------------------------------
// Plays the overlay; resolves when it is gone. `getTarget` gives the stage's rect for the hand-off
// (null on phones, where the stage is below the fold and the overlay zooms away instead).
function playOverlay(ov, { k, getTarget, onExit }) {
  const group = ov.querySelector('.kw-ov-group');
  const bg = ov.querySelector('.kw-ov-bg');
  const rays = ov.querySelector('.kw-ov-rays');
  const disc = group.querySelector('.kw-disc');
  const grid = [...group.querySelectorAll('.kw-disc-grid .kw-draw')];
  const ring = group.querySelector('.kw-ov-ring');
  const shadow = group.querySelector('.kw-shadow');
  const waple = group.querySelector('.kw-waple');
  const sprite = group.querySelector('.kw-sprite');
  const bubble = group.querySelector('.kw-bubble-in');
  const skipBtn = ov.querySelector('.kw-ov-skip');
  const canvas = ov.querySelector('.kw-ov-fx');
  const ctx = canvas.getContext('2d');
  let cv = fitCanvas(canvas);
  const confetti = [];

  let S = 0, baseX = 0, baseY = 0, flip = null, burstDone = false, exited = false;
  const measure = () => { S = group.offsetWidth; baseX = group.offsetLeft; baseY = group.offsetTop; cv = fitCanvas(canvas); };
  measure();

  const frame = (t, dt) => {
    // backdrop and sunburst
    const exitP = seg(t, T.exit.delay, T.exit.duration);
    const fade = 1 - easeInOutCubic(seg(t, T.exit.delay + 120, T.exit.duration - 160));
    bg.style.opacity = fade.toFixed(3);
    const rp = easeOutExpo(seg(t, T.rays.delay, T.rays.duration));
    rays.style.opacity = (fade * rp).toFixed(3);
    rays.style.transform = `translate(-50%,-50%) scale(${(0.4 + 0.6 * rp).toFixed(3)}) rotate(${(t * 0.012).toFixed(2)}deg)`;

    // the whole group: a little shake on landing, then the hand-off
    const sinceLand = t - T.land;
    let gx = 0, gy = sinceLand > 0 ? Math.sin(sinceLand / 24) * Math.exp(-sinceLand / 110) * 0.022 * S : 0;
    let gs = 1, gOpacity = 1;
    if (exitP > 0) {
      if (!exited) { exited = true; flip = getTarget && getTarget(); if (onExit) onExit(); }
      const e = easeInOutCubic(exitP);
      if (flip) {
        gx = (flip.left - baseX) * e; gy = (flip.top - baseY) * e; gs = 1 + (flip.width / S - 1) * e;
      } else {
        gs = 1 - 0.35 * e; gx = gy = (1 - gs) * S / 2; gOpacity = 1 - easeInOutCubic(seg(t, T.exit.delay, T.exit.duration * 0.8));
      }
    }
    group.style.transform = `translate(${gx.toFixed(1)}px,${gy.toFixed(1)}px) scale(${gs.toFixed(4)})`;
    group.style.opacity = gOpacity.toFixed(3);

    // the waffle draws itself and thumps when 와플이 lands
    const dp = springOut(seg(t, T.disc.delay, T.disc.duration));
    const thump = sinceLand > 0 ? 1 + 0.05 * wobble(seg(t, T.land, 600)) : 1;
    disc.style.transform = `scale(${(dp * thump).toFixed(4)}) rotate(${(-80 * (1 - easeOutExpo(seg(t, T.disc.delay, T.disc.duration)))).toFixed(2)}deg)`;
    disc.style.opacity = Math.min(1, seg(t, T.disc.delay, 160)).toFixed(3);
    grid.forEach((l, i) => {
      l.style.strokeDashoffset = (1 - easeOutExpo(seg(t, T.grid.delay + (i >> 1) * T.grid.stagger + (i % 2) * 50, T.grid.duration))).toFixed(3);
    });

    // 와플이: falls spinning, squashes on landing, waves hello, turns to the front for the hand-off
    const p = seg(t, T.drop.delay, T.drop.duration);
    let y = 0, sx = 1, sy = 1, rot = 0, f = 'front';
    if (t < T.drop.delay) waple.style.opacity = '0';
    else waple.style.opacity = '1';
    if (t < T.land) {
      y = -(1 - p * p) * (window.innerHeight * 0.75 + S * 0.4);
      f = spinFrame(p, T.drop.turns);
      rot = -10 * (1 - p);
      sy = 1 + 0.08 * p; sx = 1 - 0.05 * p; // stretched by the fall
    } else {
      const w = wobble(seg(t, T.squash.delay, T.squash.duration));
      sy = 1 - 0.2 * w; sx = 1 + 0.14 * w;
      if (t >= T.wave.delay && t < T.exit.delay) {
        f = 'wave';
        y = -Math.sin(Math.PI * seg(t, T.wave.delay, 380)) * 0.07 * S;
      }
    }
    setFrame(sprite, f);
    waple.style.transform = `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
    const near = t < T.land ? p * p : 1;
    const hop = y < 0 && t >= T.land ? 1 + y / (0.25 * S) : 1;
    shadow.style.opacity = (t < T.drop.delay ? 0 : (0.15 + 0.65 * near) * hop).toFixed(3);
    shadow.style.transform = `scale(${((0.3 + 0.7 * near) * sx * hop).toFixed(3)},${(0.3 + 0.7 * near).toFixed(3)})`;

    // shockwave ring
    const q = seg(t, T.land, 720);
    ring.style.opacity = (sinceLand > 0 ? (1 - q) * 0.9 : 0).toFixed(3);
    ring.style.transform = `scale(${(0.2 + 2.1 * easeOutExpo(q)).toFixed(3)},${((0.2 + 2.1 * easeOutExpo(q)) * 0.32).toFixed(3)})`;

    // speech bubble
    const bIn = springOut(seg(t, T.bubble.delay, T.bubble.duration));
    const bOut = 1 - easeInOutCubic(seg(t, T.bubble.out, 200));
    bubble.style.transform = `scale(${(bIn * bOut).toFixed(3)})`;
    bubble.style.opacity = (t < T.bubble.delay ? 0 : bOut).toFixed(3);

    skipBtn.style.opacity = (Math.min(1, seg(t, 300, 400)) * fade).toFixed(3);

    // confetti
    if (!burstDone && sinceLand >= 0) {
      burstDone = true;
      const r = waple.getBoundingClientRect();
      burst(confetti, r.left + r.width / 2, r.bottom - r.height * 0.1, window.innerWidth < 600 ? 46 : 70, window.innerWidth < 600 ? 0.95 : 1.35);
    }
    ctx.setTransform(cv.dpr, 0, 0, cv.dpr, 0, 0);
    ctx.clearRect(0, 0, cv.w, cv.h);
    stepBurst(ctx, confetti, dt);
  };

  return new Promise((resolve) => {
    let raf = 0, t0 = 0, last = 0, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      ov.style.display = 'none';
      resolve();
    };
    const loop = (now) => {
      if (!t0) { t0 = now; last = now; }
      const t = (now - t0) / k;
      frame(t, Math.min(50, now - last));
      last = now;
      if (t >= T.end && confetti.length === 0) return finish();
      if (t >= T.end) { bg.style.opacity = '0'; ov.style.pointerEvents = 'none'; }
      raf = requestAnimationFrame(loop);
    };
    frame(0, 0);
    ov.classList.remove('kw-ov-wait');
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', measure);
    // Skip: a quick fade, then the page as it is.
    const skip = () => {
      if (done) return;
      if (!exited && onExit) { exited = true; onExit(true); }
      ov.style.pointerEvents = 'none';
      const a = ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' });
      a.onfinish = finish;
      setTimeout(finish, 400);
    };
    ov.skip = skip;
  });
}

// --- the stage runtime --------------------------------------------------------------------
// Ambient life for 와플이 on the stage. `entrance`: 'drop' (falls in when first seen), 'hello'
// (a spin in place) or null.
function runStage(stage, { mobile, root, entrance }) {
  const cleanups = [];
  const waple = stage.querySelector('.kw-waple');
  const sprite = stage.querySelector('.kw-sprite');
  const shadow = stage.querySelector('.kw-shadow');
  const disc = stage.querySelector('.kw-disc');
  const bubbleWrap = stage.querySelector('.kw-bubble');
  const bubble = stage.querySelector('.kw-bubble-in');
  const canvas = stage.querySelector('.kw-fx');
  const ctx = canvas.getContext('2d');
  let W = stage.offsetWidth, cv = fitCanvas(canvas);
  const pad = () => (cv.w - W) / 2; // canvas overhangs the stage on every side
  const ro = new ResizeObserver(() => { W = stage.offsetWidth; cv = fitCanvas(canvas); });
  ro.observe(stage); cleanups.push(() => ro.disconnect());

  // drifting floaters: tiny waffles, stars, hearts
  const floaters = Array.from({ length: mobile ? 9 : 14 }, () => ({
    u: rnd(0, 1), v: rnd(0, 1), speed: rnd(0.000012, 0.000028), sway: rnd(0.01, 0.03), ph: rnd(0, TAU),
    rot: rnd(0, TAU), vr: rnd(-0.0006, 0.0006), kind: pick(['waffle', 'waffle', 'star', 'star', 'heart', 'dot']),
    color: pick(['#FBC54B', '#FF8A3D', '#EE8383', '#FFFFFF', '#8DBF57']), size: rnd(6, 12)
  }));
  const confetti = [];

  // what 와플이 is doing: idle, or an action with its own clock
  let action = null; // { type, t0, dur }
  let lineIdx = 0, bubbleUntil = 0, lastPointer = -1e9, nextIdle = 5200, idleFlip = 0;
  let face = 'front', faceAt = 0, hidden = entrance === 'drop';
  const ptr = { x: 0, tx: 0, on: false };

  const say = (ms, text, dur = 1500) => { bubble.textContent = text; bubbleUntil = ms + dur; bubbleAt = ms; };
  let bubbleAt = -1e9;
  const startAction = (ms, type) => { action = { type, t0: ms, dur: type === 'spin' ? 720 : type === 'drop' ? T.entrance.duration : type === 'wave' ? 1100 : 1000 }; };

  if (hidden) waple.style.opacity = shadow.style.opacity = '0';

  const frame = (ms, dt) => {
    let y = Math.sin(ms / 2600 * TAU) * 0.012 * W, sx = 1, sy = 1 + Math.sin(ms / 1300 * TAU) * 0.008, rot = 0, f = face;
    let shadowK = 1;
    if (action) {
      const p = clamp01((ms - action.t0) / action.dur);
      if (action.type === 'drop' || action.type === 'spin') {
        const airEnd = action.type === 'drop' ? 0.62 : 0.6;
        if (p < airEnd) {
          const a = p / airEnd;
          f = spinFrame(a, 1);
          if (action.type === 'drop') { y = -(1 - a * a) * 0.38 * W; rot = -8 * (1 - a); shadowK = 0.3 + 0.7 * a * a; waple.style.opacity = Math.min(1, a * 4).toFixed(3); }
          else { y = -Math.sin(Math.PI * a) * 0.2 * W; shadowK = 1 - Math.sin(Math.PI * a) * 0.55; }
        } else {
          f = 'front';
          if (!action.landed) {
            action.landed = true;
            burst(confetti, pad() + W * 0.5, pad() + W * 0.88, mobile ? 18 : 26, 0.62);
            if (action.type === 'spin') say(ms, LINES[(lineIdx = (lineIdx + 1) % LINES.length)]);
          }
          const w = wobble((p - airEnd) / (1 - airEnd));
          sy = 1 - 0.16 * w; sx = 1 + 0.11 * w;
        }
      } else if (action.type === 'wave') {
        f = 'wave';
        y += -Math.sin(Math.PI * clamp01(p / 0.4)) * 0.05 * W;
      } else if (action.type === 'look') {
        f = p < 0.45 ? 'l3' : p < 0.9 ? 'r3' : 'front';
      }
      if (p >= 1) { action = null; face = 'front'; faceAt = ms; }
    } else if (!mobile && ptr.on && ms - lastPointer < 4000) {
      // turn toward the pointer (well off to either side), with a small pop on each turn
      const want = ptr.x < -0.62 ? 'l3' : ptr.x > 0.62 ? 'r3' : 'front';
      if (want !== face) { face = want; faceAt = ms; }
      f = face;
    } else if (face !== 'front') { face = 'front'; faceAt = ms; f = face; }
    if (!action && ms > nextIdle && ms - lastPointer > 2500) {
      startAction(ms, idleFlip++ % 2 ? 'look' : 'wave');
      if (idleFlip === 1) say(ms, LINES[0], 1300);
      nextIdle = ms + 6500 + Math.random() * 2500;
    }
    const pop = 1 - 0.06 * wobble(clamp01((ms - faceAt) / 260));
    setFrame(sprite, f);
    ptr.x += (ptr.tx - ptr.x) * 0.08;
    const px = mobile ? 0 : ptr.x * 7;
    waple.style.transform = `translate(${px.toFixed(1)}px,${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${(sx * (action ? 1 : pop)).toFixed(3)},${sy.toFixed(3)})`;
    shadow.style.transform = `translateX(${px.toFixed(1)}px) scale(${(shadowK * sx).toFixed(3)},${shadowK.toFixed(3)})`;
    shadow.style.opacity = (0.8 * shadowK).toFixed(3);
    disc.style.transform = `translate(${(-px * 0.6).toFixed(1)}px,0)`;
    // bubble
    const bIn = springOut(clamp01((ms - bubbleAt) / 420));
    const bOut = ms > bubbleUntil ? 1 - clamp01((ms - bubbleUntil) / 200) : 1;
    bubbleWrap.style.opacity = bOut > 0 && ms >= bubbleAt ? '1' : '0';
    bubble.style.transform = `scale(${(bIn * bOut).toFixed(3)})`;
    // particles
    ctx.setTransform(cv.dpr, 0, 0, cv.dpr, 0, 0);
    ctx.clearRect(0, 0, cv.w, cv.h);
    for (const q of floaters) {
      const v = ((q.v - ms * q.speed) % 1 + 1) % 1;
      const u = q.u + Math.sin(ms / 1000 + q.ph) * q.sway;
      q.rot += q.vr * dt;
      drawParticle(ctx, { ...q, x: u * cv.w, y: v * cv.h }, 0.75 * Math.min(1, v * 5, (1 - v) * 5));
    }
    stepBurst(ctx, confetti, dt);
  };

  // pointer and taps
  if (!mobile) {
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      ptr.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ptr.on = true; lastPointer = clock();
    };
    const onLeave = () => { ptr.tx = 0; ptr.on = false; };
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    cleanups.push(() => { root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); });
  }
  const onTap = () => {
    const ms = clock();
    if (action && (action.type === 'spin' || action.type === 'drop')) return;
    startAction(ms, 'spin'); nextIdle = ms + 7000;
  };
  waple.addEventListener('click', onTap);
  cleanups.push(() => waple.removeEventListener('click', onTap));

  // clock that only runs while the loop runs
  let raf = 0, visible = false, base = 0, runStart = 0, last = 0, started = false;
  const clock = () => (raf ? base + performance.now() - runStart : base);
  const loop = (now) => {
    const ms = base + now - runStart;
    frame(ms, Math.min(50, now - (last || now)));
    last = now;
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (raf || !visible || document.hidden) return;
    runStart = performance.now(); last = 0;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { if (!raf) return; base = clock(); cancelAnimationFrame(raf); raf = 0; };
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    // phones: fall in once most of the stage is on screen
    if (visible && !started && (entrance !== 'drop' || en.intersectionRatio >= 0.55)) {
      started = true;
      if (entrance) {
        // already in view at once (tall phone): spin hello instead of falling in
        startAction(clock(), entrance === 'drop' ? 'drop' : 'spin');
        nextIdle = 4800;
      }
      if (hidden) { waple.style.opacity = shadow.style.opacity = ''; hidden = false; }
    }
    if (visible) start(); else stop();
  }, { threshold: [0, 0.35, 0.55, 0.8] });
  io.observe(stage);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  cleanups.push(() => { io.disconnect(); stop(); document.removeEventListener('visibilitychange', onVis); });
  return () => cleanups.forEach((c) => c());
}

// --- wiring -------------------------------------------------------------------------------
const prefersMobile = () => window.matchMedia(MOBILE_QUERY).matches;

export function useHeroIntro(rootRef, mobile) {
  React.useEffect(() => {
    if (mobile !== prefersMobile()) return; // still the server (desktop) layout on a phone: wait for the real one
    const root = rootRef.current;
    const stage = root && root.querySelector('[data-kw="stage"]');
    if (!stage) return;
    const ov = root.querySelector('[data-kw="ov"]');
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = !!ov && html.classList.contains('kw-intro') && !reduce;
    const k = mobile ? MOBILE_TIME_SCALE : 1;
    const cleanups = [];
    let alive = true;

    // Copy intro (Web Animations), held at its start state and released by the overlay's hand-off.
    const anims = [];
    if (intro) {
      const play = (el, frames, o) => {
        if (!el) return;
        const a = el.animate(frames, { fill: 'backwards', easing: EASE.out, ...o, duration: o.duration * k, delay: (o.delay - T.exit.delay) * k });
        a.pause(); anims.push(a);
      };
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
    const releaseCopy = (instant) => anims.forEach((a) => { try { instant ? a.finish() : a.play(); } catch (e) { /* done */ } });

    if (intro) { ov.style.display = 'block'; ov.classList.add('kw-ov-wait'); }
    html.classList.remove('kw-intro');
    try { sessionStorage.setItem('kw-intro', '1'); } catch (e) { /* private mode */ }
    if (reduce) return undefined;
    if (!intro) {
      cleanups.push(runStage(stage, { mobile, root, entrance: mobile ? 'drop' : 'hello' }));
      return () => cleanups.forEach((c) => c());
    }

    // The overlay waits (briefly) for 와플이's frames so the spin never shows a gap.
    if (!mobile) stage.style.visibility = 'hidden';
    const imgs = [...ov.querySelectorAll('.kw-sprite img')];
    imgs.forEach((i) => { i.loading = 'eager'; });
    const ready = Promise.race([
      Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : null))),
      new Promise((r) => setTimeout(r, 1500))
    ]);
    let skip = null, skipped = false;
    ready.then(() => {
      if (!alive || skipped) return;
      const done = playOverlay(ov, {
        k,
        getTarget: mobile ? null : () => stage.getBoundingClientRect(),
        onExit: (instant) => releaseCopy(instant)
      });
      skip = ov.skip;
      return done;
    }).then(() => {
      if (!alive || skipped) return;
      stage.style.visibility = '';
      cleanups.push(runStage(stage, { mobile, root, entrance: mobile ? 'drop' : null }));
    });

    // Any interaction skips the intro.
    const onSkip = () => {
      if (skip) return skip();
      if (skipped) return;
      skipped = true;
      ov.style.display = 'none'; stage.style.visibility = ''; releaseCopy(true);
      cleanups.push(runStage(stage, { mobile, root, entrance: mobile ? 'drop' : null }));
    };
    const skipBtn = ov.querySelector('.kw-ov-skip');
    skipBtn.addEventListener('click', onSkip);
    const events = ['wheel', 'keydown', 'touchmove'];
    events.forEach((ev) => window.addEventListener(ev, onSkip, { once: true, passive: true }));
    ov.addEventListener('pointerdown', onSkip);
    cleanups.push(() => {
      skipBtn.removeEventListener('click', onSkip);
      ov.removeEventListener('pointerdown', onSkip);
      events.forEach((ev) => window.removeEventListener(ev, onSkip));
    });
    return () => { alive = false; cleanups.forEach((c) => c()); };
  }, [mobile]);
}
