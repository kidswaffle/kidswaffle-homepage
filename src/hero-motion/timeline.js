// Hero intro timing, shared by the website (src/sections/HeroStage.jsx) and the
// video version (motion-video/). Milliseconds. See docs/hero-motion-brief.md.

// Bezier control points: the site's own easing (tokens/layout.css) plus a soft in-out.
export const BEZIER = {
  out: [0.22, 0.8, 0.32, 1],
  inOut: [0.45, 0, 0.25, 1],
  bounce: [0.34, 1.4, 0.5, 1]
};
const css = ([a, b, c, d]) => `cubic-bezier(${a},${b},${c},${d})`;
export const EASE = { out: css(BEZIER.out), inOut: css(BEZIER.inOut), bounce: css(BEZIER.bounce) };

// Phones play the same intro a little faster.
export const MOBILE_TIME_SCALE = 0.85;

// Website: a short intro (about 2.7s) so the call to action is never kept waiting.
export const HERO_INTRO = {
  logo: { delay: 0, duration: 520 },
  sparkles: { delay: 120, duration: 640 },
  blob: { delay: 60, duration: 620 },
  grid: { delay: 320, duration: 620, stagger: 45 },
  hop: { delay: 120, duration: 480, stagger: 26 },
  underline: { delay: 880, duration: 560 },
  hero: { delay: 380, duration: 760 },
  friends: { delay: 900, duration: 560, stagger: 150 },
  chip: { delay: 1400, duration: 520 },
  cta: { delay: 2050, duration: 620 }
};

// Whole website intro length (the CTA pulse is the last thing to move).
export const HERO_INTRO_END = HERO_INTRO.cta.delay + HERO_INTRO.cta.duration;

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
