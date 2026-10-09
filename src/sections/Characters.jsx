import React from 'react';
import { useIsMobile } from '../lib.js';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { CharacterCard } from '../components/marketing/CharacterCard.jsx';
import cardWaple from '../assets/characters/card-waple.png';
import cardDugeuni from '../assets/characters/card-dugeuni.png';
import cardMongle from '../assets/characters/card-mongle.png';
import cardTtoto from '../assets/characters/card-ttoto.png';

const CAST = [
  { name: '와플이', romanized: 'WAPLE', role: '발견과 탐색', color: 'var(--kw-yellow)', tint: 'var(--kw-yellow-tint)',
    body: '새로운 놀이를 가장 먼저 찾아내고 친구들을 불러요.', image: cardWaple },
  { name: '두근이', romanized: 'DUGEUNI', role: '움직임과 리듬', color: 'var(--kw-coral)', tint: 'var(--kw-coral-tint)',
    body: '노래가 들리면 가장 먼저 몸이 움직이는 친구예요.', image: cardDugeuni },
  { name: '몽글이', romanized: 'MONGLE', role: '감정과 공감', color: 'var(--kw-sky)', tint: 'var(--kw-sky-tint)',
    body: '속상한 친구 옆에 조용히 앉아 마음을 들어 줘요.', image: cardMongle },
  { name: '또또', romanized: 'TTOTO', role: '정리와 생활습관', color: 'var(--kw-green)', tint: 'var(--kw-green-tint)',
    body: '놀이가 끝나면 정리송을 부르며 제자리를 챙겨요.', image: cardTtoto }
];

export function Characters() {
  const mobile = useIsMobile();
  return (
    <section id="characters" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 48 }}>
        <SectionHeader align="center" label="캐릭터" title="키즈와플 친구들을 소개합니다"
          lead="키즈와플 노래와 영상에 함께 나오는 네 친구예요. 아이들은 친구의 이름을 부르며 노래를 따라 해요." />
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))', gap: mobile ? 16 : 24 }}>
          {CAST.map((c) => <CharacterCard key={c.name} {...c} />)}
        </div>
      </div>
    </section>
  );
}
