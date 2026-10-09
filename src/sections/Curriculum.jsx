import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { FeatureBullet } from '../components/marketing/FeatureBullet.jsx';
import { SegmentedTabs } from '../components/navigation/SegmentedTabs.jsx';
import { ProgramCard } from '../components/marketing/ProgramCard.jsx';
import { Card } from '../components/core/Card.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Rail } from './Mobile.jsx';
import { useIsMobile } from '../lib.js';
import stepWaple from '../assets/characters/step-waple.webp';
import stepMongle from '../assets/characters/step-mongle.webp';
import stepDugeuni from '../assets/characters/step-dugeuni.webp';
import stepTtoto from '../assets/characters/step-ttoto.webp';

const STEPS = [
  { label: '인사·노래', icon: 'music', accent: 'var(--kw-yellow)', tint: 'var(--kw-yellow-tint)', cardTitle: '인사와 노래', tag: '청각·사회성',
    one: '첫 인사 노래로 시작하고, 악기를 연주하고, 끝 인사노래로 마칩니다.',
    image: stepWaple, imageAlt: '와플이',
    badge: '청각·사회성 · 전 월령', title: '노래로 열고, 노래로 닫는 수업',
    body: '첫 인사 노래로 친구와 선생님을 만나고, 악기를 흔들며 리듬을 느끼고, 끝 인사노래로 하루를 마무리해요.',
    primary: ['청각', '사회성'], secondary: ['감정표현', '자신감'],
    highlights: [
      { title: '첫 인사 노래하기', body: '인사를 나누며 사람과 관계 맺는 법을 배워요.' },
      { title: '악기 연주하기', body: '소리로 감정을 표현하고 이해해요.' },
      { title: '끝 인사노래', body: '스스로 인사하며 자신감과 배려를 배워요.' }] },
  { label: '인지카드', icon: 'shapes', accent: 'var(--kw-sky)', tint: 'var(--kw-sky-tint)', cardTitle: '인지카드', tag: '시각·언어',
    one: '그림 카드로 사물의 모양과 이름을 익힙니다.',
    image: stepMongle, imageAlt: '몽글이',
    badge: '시각·언어 · 전 월령', title: '보고, 듣고, 이름을 불러요',
    body: '그림 카드로 사물의 개념과 이름을 익히며 어휘를 넓혀 가요.',
    primary: ['시각', '어휘'], secondary: ['집중', '개념 이해'],
    highlights: [{ title: '인지카드 익히기', body: '매주 새 카드로 사물의 이름을 만나요.' }] },
  { label: '오감교구', icon: 'hand', accent: 'var(--kw-coral)', tint: 'var(--kw-coral-tint)', cardTitle: '오감교구 활동', tag: '촉각·후각·미각',
    one: '매주 다른 교구로 촉감, 색, 소리를 경험합니다.',
    image: stepDugeuni, imageAlt: '두근이',
    badge: '촉각·후각·미각 · 전 월령', title: '손끝으로 만나는 매주 새 교구',
    body: '부드럽고 까끌까끌한 촉감, 알록달록한 색, 다양한 소리, 안전한 재료로 하는 후각·미각 놀이까지. 매주 다른 교구로 놀아요.',
    primary: ['촉각', '대·소근육'], secondary: ['탐색', '호기심'],
    highlights: [
      { title: '오감교구 활동', body: '촉감, 감각, 색상을 경험하며 몸을 움직여요.' },
      { title: '매 수업 교구 소독', body: '아기에게 안전한 소독제로 강사가 직접 세척해요.' },
      { title: '구강기 교구 분리 관리', body: '입에 넣었던 교구는 따로 모아 더 꼼꼼히 관리해요.' }] },
  { label: '포토존·정리', icon: 'smile', accent: 'var(--kw-green)', tint: 'var(--kw-green-tint)', cardTitle: '포토존과 정리정돈', tag: '표현·생활습관',
    one: '테마 포토존에서 사진을 남기고, 놀이가 끝나면 함께 정리합니다.',
    image: stepTtoto, imageAlt: '또또',
    badge: '표현·생활습관 · 전 월령', title: '놀고, 남기고, 제자리로',
    body: '매주 바뀌는 테마 포토존에서 아이의 모습을 사진으로 남기고, 놀이가 끝나면 종류별로 나누며 함께 정리해요.',
    primary: ['표현', '생활습관'], secondary: ['관찰력', '자립심'],
    highlights: [
      { title: '포토존 사진', body: '일상을 사진으로 기록해요.' },
      { title: '정리정돈', body: '분류하고 제자리에 두며 스스로 하는 힘을 길러요.' },
      { title: '프리미엄 과정', body: '전문 촬영 선생님이 수업 내내 촬영하고, 마지막 주에 베스트 컷을 인화해 선물해요.' }] }
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
    <SectionHeader align="center" label="오감놀이 커리큘럼" title="인사로 열고 정리로 닫는, 7가지 순서"
      lead="키즈와플 오감팡팡은 매 수업 같은 순서로 진행합니다. 익숙한 순서 안에서 아이는 다음 활동을 예상하며 편안하게 참여할 수 있어요." />
  );
  const tabs = <SegmentedTabs style={{ width: 'max-content' }} value={tab} onChange={setTab} items={STEPS.map((x) => ({ label: x.label, dot: x.accent }))} />;
  if (mobile) {
    return (
      <section id="program" style={{ padding: 'var(--section-y) 0 0' }}>
        <div style={{ padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {header}
          <Rail>
            {STEPS.map((x) => (
              <Card key={x.label} pad={20} style={{ width: 240, flex: '0 0 auto' }}>
                <FeatureBullet icon={x.icon} title={x.cardTitle} body={x.one} color={x.accent} tint={x.tint} />
              </Card>
            ))}
          </Rail>
          <div className="kw-rail" style={{ overflowX: 'auto', margin: '0 calc(var(--gutter) * -1)', padding: '4px var(--gutter) 8px' }}>{tabs}</div>
          <MobileProgramCard key={s.label} s={s} />
        </div>
      </section>
    );
  }
  return (
    <section id="program" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: 56 }}>
        {header}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 36 }}>
          {STEPS.map((x) => (
            <FeatureBullet key={x.label} icon={x.icon} title={x.cardTitle} body={x.one} color={x.accent} tint={x.tint} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>{tabs}</div>
        <ProgramCard key={s.label} badge={s.badge} title={s.title} body={s.body} accent={s.accent} image={s.image} imageAlt={s.imageAlt} imageFit="contain"
          primaryFocus={s.primary} secondaryFocus={s.secondary} highlights={s.highlights} ctaLabel="" />
      </div>
    </section>
  );
}
