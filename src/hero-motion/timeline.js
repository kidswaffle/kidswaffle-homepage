// Hero intro timing, shared by the website (src/sections/HeroStage.jsx) and the
// video version (motion-video/). Milliseconds. See docs/hero-motion-brief.md.

// Bezier control points: the site's own easing (tokens/layout.css) plus a soft in-out.
export const BEZIER = {
  out: [0.22, 0.8, 0.32, 1],
  inOut: [0.45, 0, 0.25, 1],
  bounce: [0.34, 1.4, 0.5, 1],
  expo: [0.16, 1, 0.3, 1]
};
const css = ([a, b, c, d]) => `cubic-bezier(${a},${b},${c},${d})`;
export const EASE = { out: css(BEZIER.out), inOut: css(BEZIER.inOut), bounce: css(BEZIER.bounce), expo: css(BEZIER.expo) };

// Phones play the same intro a little faster.
export const MOBILE_TIME_SCALE = 0.85;

// Website intro "와플이 등장" (about 3.1s, first visit per tab only). A full-screen overlay:
// the round waffle draws itself, 와플이 drops in spinning through the turnaround frames, lands
// with a squash and a burst, waves hello, then flies into the hero stage while the headline rises.
export const HERO_INTRO = {
  // overlay
  rays: { delay: 0, duration: 900 },
  disc: { delay: 60, duration: 750 },
  grid: { delay: 260, duration: 520, stagger: 28 },
  drop: { delay: 520, duration: 760, turns: 2 },
  land: 1280,
  squash: { delay: 1280, duration: 520 },
  wave: { delay: 1720, duration: 700 },
  bubble: { delay: 1780, duration: 420, out: 2380 },
  exit: { delay: 2440, duration: 680 },
  // copy (starts as 와플이 heads for the stage)
  logo: { delay: 2500, duration: 600 },
  words: { delay: 2520, duration: 820, stagger: 60 },
  underline: { delay: 3050, duration: 600 },
  rise: { delay: 2700, duration: 700, stagger: 70 },
  cta: { delay: 3700, duration: 650 },
  end: 3120,
  // the stage's own entrance when there is no overlay (repeat visits, phones scrolling down)
  entrance: { duration: 820 }
};

// Video (YouTube intro, Reels, Kakao channel): the same beats, given room to breathe. 7s.
export const HERO_VIDEO = {
  length: 7000,
  grid: { delay: 0, duration: 900, stagger: 40 },
  blob: { delay: 150, duration: 700 },
  logo: { delay: 550, duration: 650 },
  sparkles: { delay: 700, duration: 750 },
  hero: { delay: 1300, duration: 700 },
  friends: { delay: 1900, duration: 600, stagger: 220 },
  hop: { delay: 2600, duration: 520, stagger: 45 },
  underline: { delay: 3600, duration: 650 },
  themes: { delay: 4100, duration: 550, stagger: 260 },
  cta: { delay: 5400, duration: 650 },
  url: { delay: 5900, duration: 500 }
};
