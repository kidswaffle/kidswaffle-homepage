import React from 'react';
import { Hero } from './sections/Hero.jsx';
import { Stats } from './sections/Stats.jsx';
import { Brand } from './sections/Brand.jsx';
import { Curriculum } from './sections/Curriculum.jsx';
import { Seasons } from './sections/Seasons.jsx';
import { Reviews } from './sections/Reviews.jsx';
import { Characters } from './sections/Characters.jsx';
import { Videos } from './sections/Videos.jsx';
import { Closing } from './sections/Closing.jsx';
import { MobileNav } from './sections/Mobile.jsx';
import { useScrollReveal } from './useScrollReveal.js';
import { useIsMobile } from './lib.js';

export function App() {
  const ref = React.useRef(null);
  const mobile = useIsMobile();
  useScrollReveal(ref, mobile);
  return (
    <>
    {mobile && <MobileNav />}
    <div ref={ref}>
      <Hero />
      <Stats />
      <Brand />
      <Curriculum />
      <Seasons />
      <Reviews />
      <Characters />
      <Videos />
      <Closing />
    </div>
    </>
  );
}
