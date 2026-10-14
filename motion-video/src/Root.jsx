import React from 'react';
import { Composition } from 'remotion';
import { HeroIntro } from './HeroIntro.jsx';
import { HERO_VIDEO } from '../../src/hero-motion/timeline.js';

const FPS = 30;
const frames = Math.round((HERO_VIDEO.length / 1000) * FPS);
const FORMATS = [
  { id: 'HeroIntro-16x9', width: 1920, height: 1080 }, // YouTube intro, Kakao channel
  { id: 'HeroIntro-9x16', width: 1080, height: 1920 }, // Reels, Shorts
  { id: 'HeroIntro-1x1', width: 1080, height: 1080 } // Instagram feed
];

export const Root = () => (
  <>
    {FORMATS.map((f) => (
      <Composition key={f.id} id={f.id} component={HeroIntro} durationInFrames={frames} fps={FPS} width={f.width} height={f.height} />
    ))}
  </>
);
