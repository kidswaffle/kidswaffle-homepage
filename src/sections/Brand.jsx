import React from 'react';
import { useIsMobile } from '../lib.js';
import { SectionHead as SectionHeader } from './Mobile.jsx';

export function Brand() {
  const mobile = useIsMobile();
  return (
    <section id="brand" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 36 }}>
        <SectionHeader align="center" label="브랜드 소개" title="아이가 산만한 건, 엄마 탓이 아닙니다" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 16 : 20, textAlign: mobile ? 'left' : 'center', font: mobile ? 'var(--type-body)' : 'var(--type-body-lg)', color: 'var(--text-body)' }}>
          <p>육아가 어려운 건 엄마가 부족해서가 아닙니다. 모든 것이 처음이기에 당연한 과정입니다.</p>
          <p>아이가 집중하지 못하는 건 사랑이 부족해서가 아니라, 세상을 탐색하는 방식이 다를 뿐입니다.</p>
          <p>키즈와플은 '정답'을 가르치지 않습니다. 아이에게는 스스로 성장하는 즐거움을, 엄마에게는 아이를 믿고 지켜볼 수 있는 '숨 쉴 시간'을 선물합니다.</p>
          <p style={{ font: 'var(--type-h5)', color: 'var(--text-strong)', marginTop: 8 }}>키즈와플 대표 이승진</p>
        </div>
      </div>
    </section>
  );
}
