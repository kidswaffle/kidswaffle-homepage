import React from 'react';
import { useIsMobile } from '../lib.js';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import persimmon from '../assets/seasons/persimmon.webp';
import taiyaki from '../assets/seasons/taiyaki.webp';
import squirrel from '../assets/seasons/squirrel.webp';
import hanok from '../assets/seasons/hanok.webp';
import christmas from '../assets/seasons/christmas.webp';
import harvest from '../assets/seasons/harvest.webp';

const SEASONS = [
  { src: persimmon, pos: '50% 40%' }, { src: taiyaki, pos: '50% 35%' }, { src: squirrel, pos: '50% 45%' },
  { src: hanok, pos: '50% 45%' }, { src: christmas, pos: '50% 40%' }, { src: harvest, pos: '50% 50%' }
];

export function Seasons() {
  const mobile = useIsMobile();
  const list = SEASONS.concat(SEASONS);
  return (
    <section id="season" style={{ padding: 'var(--section-y) 0 0' }}>
      <style>{`
        @keyframes kwSeasonRun{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .kw-season-rail{display:flex;width:max-content;animation:kwSeasonRun 60s linear infinite}
        .kw-season-wrap:hover .kw-season-rail{animation-play-state:paused}
        .kw-season-card{position:relative;flex:none;width:clamp(240px,24vw,340px);aspect-ratio:1/1;margin-right:24px;overflow:hidden;border-radius:var(--radius-xl);box-shadow:var(--shadow-card);background:var(--kw-yellow-tint)}
        .kw-season-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform var(--dur-4) var(--ease-out)}
        .kw-season-card:hover img{transform:scale(1.06)}
        @media (prefers-reduced-motion:reduce){.kw-season-rail{animation:none}.kw-season-wrap{overflow-x:auto!important}}
      `}</style>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <SectionHeader align="center" label="테마 오감놀이" title="매주 새로운 놀이터가 열립니다"
          lead="매주 바뀌는 테마에 맞춰 교구와 의상, 포토존을 새로 꾸밉니다." />
      </div>
      <div className="kw-season-wrap" style={{ marginTop: mobile ? 28 : 48, padding: '8px 0 20px', overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
        maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)' }}>
        <div className="kw-season-rail">
          {list.map((s, i) => (
            <figure key={i} className="kw-season-card" style={{ margin: '0 24px 0 0' }} aria-hidden={i >= SEASONS.length ? 'true' : undefined}>
              <img loading="lazy" src={s.src} width="720" height="720" alt="키즈와플 오감팡팡 테마 포토존에서 노는 아기" style={{ objectPosition: s.pos }} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
