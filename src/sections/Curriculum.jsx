import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { SegmentedTabs } from '../components/navigation/SegmentedTabs.jsx';
import { ProgramCard } from '../components/marketing/ProgramCard.jsx';
import { Card } from '../components/core/Card.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { useIsMobile } from '../lib.js';
import stepWaple from '../assets/characters/step-waple.webp';
import stepMongle from '../assets/characters/step-mongle.webp';
import stepDugeuni from '../assets/characters/step-dugeuni.webp';
import stepTtoto from '../assets/characters/step-ttoto.webp';

const STEPS = [
  { label: '인사·노래', accent: 'var(--kw-yellow)', image: stepWaple, imageAlt: '와플이',
    badge: '청각', title: '노래로 열고, 노래로 닫습니다',
    body: '엄마와 함께 인사하고, 악기로 소리와 리듬을 느끼며, 끝 인사노래로 마무리합니다.',
    primary: ['청각'], secondary: ['리듬감'],
    highlights: [
      { title: '엄마와 함께 인사', body: '첫 인사 노래' },
      { title: '악기 연주', body: '소리와 리듬 경험' },
      { title: '끝 인사노래', body: '노래로 마무리' }] },
  { label: '인지카드', accent: 'var(--kw-sky)', image: stepMongle, imageAlt: '몽글이',
    badge: '시각·청각', title: '보고, 듣고, 따라 읽습니다',
    body: '선생님이 단어를 읽으면 엄마가 따라 읽고, 아이는 보고 들으며 시각과 청각을 자극합니다.',
    primary: ['시각', '청각'], secondary: ['어휘'],
    highlights: [
      { title: '선생님이 읽기', body: '설명과 함께 단어 소개' },
      { title: '엄마가 따라 읽기', body: '같은 단어를 한 번 더' },
      { title: '아이가 보고 듣기', body: '시각·청각 자극' }] },
  { label: '오감교구', accent: 'var(--kw-coral)', image: stepDugeuni, imageAlt: '두근이',
    badge: '촉각·후각·미각', title: '아이에 맞춰 진행하는 1:1 오감활동',
    body: '1:1 오감활동으로 아이의 성향을 확인하고, 아이에 맞게 활동을 진행합니다. 교구는 매 수업 소독하며 구강기 교구는 따로 관리합니다.',
    primary: ['촉각', '대·소근육'], secondary: ['탐색'],
    highlights: [
      { title: '1:1 성향 확인', body: '아이에 맞는 활동 진행' },
      { title: '매 수업 소독', body: '모든 교구 대상' },
      { title: '구강기 교구 분리', body: '따로 모아 관리' }] },
  { label: '포토존·정리', accent: 'var(--kw-green)', image: stepTtoto, imageAlt: '또또',
    badge: '표현·생활습관', title: '아이를 사진으로 남기고, 함께 정리합니다',
    body: '매주 새로운 테마 포토존에서 영유아 아이만 촬영하고, 놀이 후에는 엄마와 함께 정리합니다.',
    primary: ['표현'], secondary: ['생활습관'],
    highlights: [
      { title: '테마 포토존 촬영', body: '영유아 아이만 촬영' },
      { title: '엄마와 함께 정리', body: '교구를 제자리에' }] }
];

// Phone version of ProgramCard: accent band with the character, then copy, focus chips and highlights.
function MobileProgramCard({ s }) {
  return (
    <Card pad={0} radius="var(--radius-xl)" style={{ overflow: 'hidden' }}>
      <div style={{ height: 220, background: s.accent, display: 'grid', placeItems: 'center' }}>
        <img src={s.image} alt={s.imageAlt} style={{ height: 196, width: 'auto', objectFit: 'contain', animation: 'kwBob 5.6s ease-in-out infinite' }} />
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        <Chip icon="sparkles" tone="neutral">{s.badge}</Chip>
        <h3 style={{ font: 'var(--type-h3)', color: 'var(--text-strong)' }}>{s.title}</h3>
        <p style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{s.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {s.primary.concat(s.secondary).map((t) => <Chip key={t} style={{ height: 34 }}>{t}</Chip>)}
        </div>
      </div>
      <div style={{ padding: '20px 24px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {s.highlights.map((h) => (
          <div key={h.title} style={{ display: 'flex', gap: 12 }}>
            <Icon name="check" size={18} style={{ color: s.accent, marginTop: 4 }} />
            <div>
              <div style={{ font: 'var(--type-h5)', color: 'var(--text-strong)' }}>{h.title}</div>
              <p style={{ marginTop: 4, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{h.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Curriculum() {
  const mobile = useIsMobile();
  const [tab, setTab] = React.useState(STEPS[0].label);
  const s = STEPS.find((x) => x.label === tab);
  const header = (
    <SectionHeader align="center" label="오감놀이 커리큘럼" title="하나의 주제로 연결된 오감놀이"
      lead="매주 하나의 주제로 노래, 카드, 교구, 포토존이 이어집니다." />
  );
  const tabs = <SegmentedTabs value={tab} onChange={setTab} items={STEPS.map((x) => ({ label: x.label, dot: x.accent }))} />;
  if (mobile) {
    return (
      <section id="program" style={{ padding: 'var(--section-y) 0 0' }}>
        <div style={{ padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {header}
          <div className="kw-mtabs">{tabs}</div>
          <MobileProgramCard key={s.label} s={s} />
        </div>
      </section>
    );
  }
  return (
    <section id="program" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: 56 }}>
        {header}
        <div style={{ display: 'flex', justifyContent: 'center' }}>{tabs}</div>
        <ProgramCard key={s.label} badge={s.badge} title={s.title} body={s.body} accent={s.accent} image={s.image} imageAlt={s.imageAlt} imageFit="contain"
          primaryFocus={s.primary} secondaryFocus={s.secondary} highlights={s.highlights} ctaLabel="" />
      </div>
    </section>
  );
}
