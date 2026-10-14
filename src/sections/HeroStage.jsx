import React from 'react';
import { HERO_INTRO as T, EASE, MOBILE_TIME_SCALE } from '../hero-motion/timeline.js';
import waple from '../assets/characters/waple-drop-in.webp';
import mongle from '../assets/hero/mongle.webp';
import dugeuni from '../assets/hero/dugeuni.webp';
import ttoto from '../assets/hero/ttoto.webp';
import themePersimmon from '../assets/hero/theme-persimmon.webp';
import themeTaiyaki from '../assets/hero/theme-taiyaki.webp';
import themeChristmas from '../assets/hero/theme-christmas.webp';

const MOBILE_QUERY = '(max-width: 760px)';
const BLOB_RADIUS = '54% 46% 43% 57% / 49% 44% 56% 51%';

// Stage geometry. Desktop: the right column (max 540px wide). Phone: under the copy.
const LAYOUT = {
  desktop: {
    stage: { width: '100%', maxWidth: 540, aspectRatio: '540 / 470' },
    blob: { width: '74%', left: '13%', top: '9%' },
    hero: { width: '100%', left: '0%', top: '0%' },
    friends: [
      { name: '몽글이', src: mongle, tint: 'var(--kw-sky-tint)', size: 116, style: { left: '-1%', top: '6%' } },
      { name: '두근이', src: dugeuni, tint: 'var(--kw-coral-tint)', size: 104, style: { right: '-2%', top: '13%' } },
      { name: '또또', src: ttoto, tint: 'var(--kw-green-tint)', size: 96, style: { right: '3%', bottom: '17%' } }
    ],
    chip: { left: '-4%', bottom: '6%' }
  },
  mobile: {
    stage: { width: 'min(340px, 92vw)', aspectRatio: '340 / 300' },
    blob: { width: '70%', left: '15%', top: '6%' },
    hero: { width: '96%', left: '2%', top: '0%' },
    friends: [
      { name: '몽글이', src: mongle, tint: 'var(--kw-sky-tint)', size: 72, style: { left: '-2%', top: '4%' } },
      { name: '두근이', src: dugeuni, tint: 'var(--kw-coral-tint)', size: 66, style: { right: '-2%', top: '9%' } },
      { name: '또또', src: ttoto, tint: 'var(--kw-green-tint)', size: 62, style: { right: '0%', bottom: '12%' } }
    ],
    chip: { left: '50%', bottom: '-4%', transform: 'translateX(-50%)' }
  }
};

const THEMES = [
  { src: themePersimmon, alt: '감 수확 테마' },
  { src: themeTaiyaki, alt: '붕어빵 테마' },
  { src: themeChristmas, alt: '크리스마스 테마' }
];

// Waffle grid drawn on the blob: 7 vertical + 7 horizontal strokes, each drawn with stroke-dashoffset.
function WaffleGrid() {
  const lines = [];
  for (let i = 1; i <= 7; i++) {
    const p = i * 12.5;
    lines.push(<line key={'v' + i} x1={p} y1="0" x2={p} y2="100" />);
    lines.push(<line key={'h' + i} x1="0" y1={p} x2="100" y2={p} />);
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <g className="kw-grid" stroke="#E2A23A" strokeOpacity=".5" strokeWidth=".55" strokeLinecap="round" fill="none">
        {lines.map((l) => React.cloneElement(l, { pathLength: 1, className: 'kw-draw' }))}
      </g>
    </svg>
  );
}

function Friend({ f, i }) {
  const bob = [4.6, 5.4, 6.2][i];
  return (
    <span data-kw="friend" data-kw-hide="" style={{ position: 'absolute', width: f.size, height: f.size, zIndex: 2, ...f.style }}>
      <span style={{ display: 'block', width: '100%', height: '100%', animation: `kwBob ${bob}s ease-in-out ${-i * 1.3}s infinite` }}>
        <span style={{
          position: 'relative', display: 'block', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
          background: f.tint, border: '5px solid #fff', boxShadow: 'var(--shadow-lift)'
        }}>
          <img src={f.src} alt={'키즈와플 캐릭터 ' + f.name} loading="eager"
            style={{ position: 'absolute', left: '8%', width: '84%', top: '12%', height: 'auto' }} />
        </span>
      </span>
    </span>
  );
}

function ThemeChip({ mobile, style }) {
  return (
    <span data-kw="chip" data-kw-hide="" style={{ position: 'absolute', zIndex: 3, ...style }}>
      <span style={{
        display: 'inline-flex', whiteSpace: 'nowrap', alignItems: 'center', gap: mobile ? 8 : 10,
        padding: mobile ? '6px 14px 6px 6px' : '8px 18px 8px 8px', background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-lift)', font: 'var(--type-body-sm)', fontSize: mobile ? 13 : 14, color: 'var(--text-strong)',
        animation: 'kwBob var(--cycle-bob-chip) ease-in-out -2.1s infinite'
      }}>
        <span className="kw-theme" aria-hidden="true" style={{ width: mobile ? 30 : 38, height: mobile ? 30 : 38 }}>
          {THEMES.map((t, i) => <img key={t.alt} src={t.src} alt="" style={{ animationDelay: ['0s', '-5.2s', '-2.6s'][i] }} />)}
        </span>
        와플이가 이번 주 놀이를 골랐어요
      </span>
    </span>
  );
}

// The character stage beside (desktop) or under (phone) the hero copy. Its server-rendered state
// is the intro's final frame; the intro (useHeroIntro) only plays in the browser.
export function HeroStage({ mobile = false }) {
  const L = mobile ? LAYOUT.mobile : LAYOUT.desktop;
  return (
    <div data-kw="stage" style={{ position: 'relative', margin: '0 auto', ...L.stage }}>
      <span data-kw="blob" data-kw-hide="" aria-hidden="true" style={{
        position: 'absolute', aspectRatio: '1 / 1', ...L.blob, background: 'var(--kw-yellow)',
        borderRadius: BLOB_RADIUS, opacity: .9, overflow: 'hidden'
      }}>
        <WaffleGrid />
      </span>
      <span data-kw="hero" style={{ position: 'absolute', zIndex: 1, ...L.hero }}>
        <img src={waple} alt="키즈와플 캐릭터 와플이가 두 팔을 벌리고 웃고 있다" width="1080" height="810" fetchpriority="high"
          style={{ display: 'block', width: '100%', height: 'auto', animation: 'kwBob var(--cycle-bob) ease-in-out infinite' }} />
      </span>
      {L.friends.map((f, i) => <Friend key={f.name} f={f} i={i} />)}
      <ThemeChip mobile={mobile} style={L.chip} />
    </div>
  );
}

// Splits a line into per-character spans (kept inside per-word nowrap spans so Korean words never
// break mid-word). `mark` gets a hand-drawn underline.
export function HopText({ text, mark }) {
  const words = text.split(' ');
  return words.map((w, wi) => {
    const chars = [...w].map((c, ci) => <span key={ci} className="kw-ch" aria-hidden="true">{c}</span>);
    const word = w === mark
      ? (
        <span key={wi} style={{ position: 'relative', whiteSpace: 'nowrap', display: 'inline-block' }}>
          {chars}
          <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true"
            style={{ position: 'absolute', left: '-2%', width: '104%', bottom: '-0.14em', height: '0.3em', overflow: 'visible' }}>
            <path className="kw-draw" pathLength="1" d="M3 9 C 40 3, 80 13, 120 7 S 175 4, 197 8"
              fill="none" stroke="var(--brand)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".85" />
          </svg>
        </span>
      )
      : <span key={wi} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{chars}</span>;
    return <React.Fragment key={wi}>{wi > 0 ? ' ' : null}{word}</React.Fragment>;
  });
}

const prefersMobile = () => window.matchMedia(MOBILE_QUERY).matches;

// Plays the intro once per visit. index.html adds `kw-intro` to <html> before first paint (unless the
// visitor prefers reduced motion or already saw it this session); that class holds the stage's
// hidden start state, and this hook hands it over to Web Animations with fill: 'backwards'.
export function useHeroIntro(rootRef, mobile) {
  React.useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('kw-intro')) return;
    if (mobile !== prefersMobile()) return; // still the server (desktop) layout on a phone: wait for the real one
    const root = rootRef.current;
    if (!root) return;
    const k = mobile ? MOBILE_TIME_SCALE : 1;
    const anims = [];
    const cleanups = [];
    const play = (el, frames, o) => {
      if (!el) return;
      anims.push(el.animate(frames, {
        fill: 'backwards', easing: EASE.out, ...o, duration: o.duration * k, delay: (o.delay || 0) * k
      }));
    };
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => [...root.querySelectorAll(s)];

    // 1 logo pop + sparkles (nav lives outside the stage)
    const logo = document.querySelector('.kw-nav a[aria-label$="첫 화면으로"], .kw-mnav a[aria-label$="첫 화면으로"]');
    if (logo) {
      play(logo, [{ transform: 'scale(.82)' }, { transform: 'scale(1.06)', offset: .6 }, { transform: 'scale(1)' }], { ...T.logo, easing: EASE.inOut });
      sparkle(logo, T.sparkles);
    }
    // 3 headline: every character hops once (always visible, so it never delays the page's main text)
    $$('h1 .kw-ch').forEach((c, i) => play(c, [{ transform: 'translateY(0)' }, { transform: 'translateY(-0.2em)', offset: .4 }, { transform: 'translateY(0)' }],
      { duration: T.hop.duration, delay: T.hop.delay + i * T.hop.stagger, easing: EASE.inOut }));
    play($('h1 .kw-draw'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], T.underline);
    // The character stage plays when it is on screen (on phones it starts below the first screen).
    const stage = $('[data-kw="stage"]');
    const playStage = (shift) => {
      const at = (o) => ({ ...o, delay: Math.max(0, (o.delay || 0) + shift) });
      const stagePlay = (el, frames, o) => play(el, frames, at(o));
      // 2 blob pops, waffle grid draws on it
      stagePlay($('[data-kw="blob"]'), [{ transform: 'scale(.7)', opacity: 0 }, { transform: 'scale(1.04)', opacity: .9, offset: .7 }, { transform: 'scale(1)', opacity: .9 }], T.blob);
      $$('.kw-grid .kw-draw').forEach((l, i) => stagePlay(l, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        { duration: T.grid.duration, delay: T.grid.delay + (i % 7) * T.grid.stagger + (i % 2) * 40 }));
      // 4 와플이 jumps for joy (visible from the first frame)
      stagePlay($('[data-kw="hero"]'), [
        { transform: 'translateY(0) scale(1,1)' },
        { transform: 'translateY(2%) scale(1.04,.94)', offset: .18 },
        { transform: 'translateY(-7%) scale(.97,1.04)', offset: .5 },
        { transform: 'translateY(0) scale(1.03,.96)', offset: .82 },
        { transform: 'translateY(0) scale(1,1)' }
      ], { ...T.hero, easing: 'ease-in-out' });
      // 5 friends pop in one by one
      $$('[data-kw="friend"]').forEach((f, i) => stagePlay(f, [
        { transform: 'scale(0) rotate(-12deg)', opacity: 0 },
        { transform: 'scale(1.12) rotate(4deg)', opacity: 1, offset: .65 },
        { transform: 'scale(1) rotate(0)', opacity: 1 }
      ], { duration: T.friends.duration, delay: T.friends.delay + i * T.friends.stagger, easing: EASE.bounce }));
      // 6 theme chip slides up
      stagePlay($('[data-kw="chip"]'), [{ translate: '0 24px', opacity: 0 }, { translate: '0 0', opacity: 1 }], T.chip);
    };
    const r = stage && stage.getBoundingClientRect();
    if (!stage || (r.top < window.innerHeight * .7 && r.bottom > 0)) playStage(0);
    else {
      stage.classList.add('kw-stage-wait');
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        playStage(-300);
        stage.classList.remove('kw-stage-wait');
      }, { threshold: .35 });
      io.observe(stage);
      cleanups.push(() => io.disconnect());
    }
    // 7 the CTA asks for a click once
    play(document.querySelector('header [data-kw="cta"]'), [{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: .45 }, { transform: 'scale(1)' }],
      { ...T.cta, fill: 'none', easing: 'ease-in-out' });

    html.classList.remove('kw-intro');
    try { sessionStorage.setItem('kw-intro', '1'); } catch (e) { /* private mode */ }

    // Any interaction jumps straight to the final frame.
    const skip = () => anims.forEach((a) => { try { a.finish(); } catch (e) { /* already done */ } });
    const events = ['pointerdown', 'wheel', 'keydown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, skip, { once: true, passive: true }));
    return () => { events.forEach((ev) => window.removeEventListener(ev, skip)); cleanups.forEach((c) => c()); };
  }, [mobile]);
}

// A short burst of dots around an element; the dots are created and removed in the browser only.
function sparkle(target, t) {
  const colors = ['#FBC54B', '#FF5800', '#9FDCC4', '#EE8383', '#7FB3E0', '#FBC54B'];
  target.style.position = 'relative';
  colors.forEach((c, i) => {
    const d = document.createElement('span');
    const a = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px;border-radius:50%;background:${c};pointer-events:none`;
    target.appendChild(d);
    const r = 46 + (i % 2) * 14;
    d.animate([
      { transform: 'translate(0,0) scale(.4)', opacity: 0 },
      { transform: `translate(${Math.cos(a) * r * .6}px,${Math.sin(a) * r * .5}px) scale(1)`, opacity: 1, offset: .35 },
      { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r * .8}px) scale(0)`, opacity: 0 }
    ], { duration: t.duration, delay: t.delay + i * 20, easing: EASE.out, fill: 'backwards' }).onfinish = () => d.remove();
  });
}
