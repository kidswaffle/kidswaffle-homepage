// Hero intro timing, shared by the website (src/sections/HeroStage.jsx) and the
// video version (motion-video/). Milliseconds. See docs/hero-motion-brief.md.
export const EASE = {
  out: 'cubic-bezier(.22,.8,.32,1)',
  inOut: 'cubic-bezier(.45,0,.25,1)',
  bounce: 'cubic-bezier(.34,1.4,.5,1)'
};

// Phones play the same intro a little faster.
export const MOBILE_TIME_SCALE = 0.85;

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

// Whole intro length (the CTA pulse is the last thing to move).
export const HERO_INTRO_END = HERO_INTRO.cta.delay + HERO_INTRO.cta.duration;
