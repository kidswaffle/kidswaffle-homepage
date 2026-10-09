import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { TestimonialCard } from '../components/marketing/TestimonialCard.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Button } from '../components/core/Button.jsx';
import { KAKAO, useIsMobile } from '../lib.js';
import { Rail } from './Mobile.jsx';

const REVIEWS = [
  { author: '영통 수강맘', accent: 'var(--kw-coral)', quote: '부끄럼 많고 내성적이라 엄마에게 안겨만 있던 아이가 어느덧 먼저 선생님께 달려가 안기고 강의실을 뛰어다니게 됐어요. 3학기째 수강 중인데 문센 진짜 많이 들어봤지만 오감수업 중 최고예요!' },
  { author: '부천 수강맘', accent: 'var(--kw-yellow)', quote: '다른 문센은 시간에 쫓기는 기분인데, 여기 갈 때는 여유로워서 좋았어요. 사진도 예쁘게 찍어 주시고 교구도 깨끗해서 걱정이 없었어요.' },
  { author: '분당 수강맘', accent: 'var(--kw-green)', quote: '소수정예로 1대1 지도 시간이 많아서 아이들과 선생님이 금방 친해져요. 수강하는 모든 아이들이 즐거워해요. 대만족!' },
  { author: '영등포 수강맘', accent: 'var(--kw-sky)', quote: '선생님의 열정적인 수업 덕분에 처음부터 아이가 잘 적응했어요. 매주 귀여운 의상과 교구에 사진까지 받아볼 수 있어 감사합니다.' },
  { author: '서수원 수강맘', accent: 'var(--kw-coral)', quote: '벌써 두 번째 수강이에요. 매번 다른 주제로 포토존까지 꾸며 주셔서 매주 인생샷을 남길 수 있어요.' },
  { author: '수원 수강맘', accent: 'var(--kw-yellow)', quote: '후기를 보고 믿고 시작했는데 강사님의 열정과 깨끗한 교구, 코스튬이 인상적이었어요. 종강 때 받은 인화 사진은 정말 좋았어요.' }
];

export function Reviews() {
  const mobile = useIsMobile();
  return (
    <section id="reviews" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 48 }}>
        <SectionHeader align="center" label="학부모 후기" title="아이의 변화를 가장 먼저 알아채는 분들"
          lead="문화센터에서 키즈와플 오감팡팡을 함께한 보호자께 받은 후기입니다."
          action={<Chip icon="star" tone="yellow">실제 수강 후기</Chip>} />
        {mobile
          ? <Rail gap={14}>{REVIEWS.map((r) => <TestimonialCard key={r.author} rating={5} {...r} style={{ width: 'min(300px,82vw)', flex: '0 0 auto' }} />)}</Rail>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, alignItems: 'stretch' }}>
              {REVIEWS.map((r) => <TestimonialCard key={r.author} rating={5} {...r} />)}
            </div>}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="lg" full={mobile} icon="phone" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담하기</Button>
        </div>
      </div>
    </section>
  );
}
