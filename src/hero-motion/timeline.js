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

// Website intro (about 2.6s). The headline is up within 0.9s; the stage then keeps moving on its own.
export const HERO_INTRO = {
  // copy
  logo: { delay: 0, duration: 700 },
  words: { delay: 80, duration: 900, stagger: 70 },
  underline: { delay: 820, duration: 700 },
  rise: { delay: 420, duration: 800, stagger: 90 },
  cta: { delay: 2100, duration: 650 },
  // stage
  blob: { delay: 120, duration: 1100 },
  grid: { delay: 420, duration: 900, stagger: 35 },
  hero: { delay: 200, duration: 1000 },
  orbit: { delay: 700, duration: 1500, stagger: 110 },
  sparks: { delay: 1100 },
  end: 2800
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
