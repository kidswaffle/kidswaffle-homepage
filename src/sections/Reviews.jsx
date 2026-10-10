import React from 'react';
import { SectionHead as SectionHeader, Rail } from './Mobile.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { Button } from '../components/core/Button.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { KAKAO, useIsMobile } from '../lib.js';
import gil1 from '../assets/reviews/gil-1.webp';
import gil2 from '../assets/reviews/gil-2.webp';
import kimYeon1 from '../assets/reviews/kim-yeon-1.webp';
import kimMin1 from '../assets/reviews/kim-min-1.webp';
import hwang1 from '../assets/reviews/hwang-1.webp';
import hwang2 from '../assets/reviews/hwang-2.webp';
import hwang3 from '../assets/reviews/hwang-3.webp';
import kang1 from '../assets/reviews/kang-1.webp';
import kang2 from '../assets/reviews/kang-2.webp';
import ji1 from '../assets/reviews/ji-1.webp';

// Real reviews from parents (names masked as on the original posts). Newest first.
const REVIEWS = [
  { title: '처음 시작한 오감활동, 대만족 후기', author: '길*연', place: '클래스콕 수원점', date: '2026.03.04', accent: 'var(--kw-coral)', photos: [gil1, gil2],
    body: '처음으로 오감활동 수업을 신청했는데, 왜 진작 안 했을까 싶을 만큼 만족스러웠어요. 4주 동안 신체놀이, 감각자극, 촉감활동을 골고루 경험하면서 아이가 매 시간 눈을 반짝이며 참여하더라고요. 선생님께서 아이들 한 명 한 명 세심하게 챙겨주시고, 자연스럽게 참여하도록 도와주셔서 더욱 믿음이 갔어요. 엄마인 저도 함께 웃고 즐기다 보니 시간이 정말 금방 지나갔네요. 아이에게도, 저에게도 소중한 시간이었고 정말 잘한 선택이었다고 생각해요~~!' },
  { title: '아기도 엄마도 만족하는 수업', author: '김*연', place: '클래스콕 파주운정점', date: '2026.03.02', accent: 'var(--kw-yellow)', photos: [kimYeon1],
    body: '믿고 보는 클래스콕이지만 기대한 것보다 더 좋아서 최고였어요~~ 시설은 물론, 수업 구성도 알차고 선생님께서 아기들이 집중할 수 있게 많이 도와주셔서 너무 좋았습니다! 무엇보다 아기들을 예뻐해 주시는 행동과 눈빛이 정말 따뜻했어요~~ 문센 고민이시면 여기로 추천드려요!' },
  { title: '키즈와플 문센 후기!', author: '김*민', place: '클래스콕 파주운정점', date: '2026.02.28', accent: 'var(--kw-green)', photos: [kimMin1],
    body: '6개월이 된 아기와 함께 첫 문화센터를 경험했어요! 아기가 아직 어려서 잘 적응할 수 있을지, 낯선 곳에서 힘들어하진 않을지 걱정을 많이 했는데, 그런 걱정이 다 사라질 만큼 너무 즐거운 시간이었어요! 알찬 수업 구성과 다정한 선생님과 함께 재밌고 행복한 시간 보낼 수 있어서 너무 좋았어요~~ 코스튬이 너무 귀여워요 ㅎㅎ!!' },
  { title: '키즈와플 강력 추천합니다!', author: '황*은', place: '클래스콕 수원점', date: '2026.02.27', accent: 'var(--kw-sky)', photos: [hwang1, hwang2, hwang3],
    body: '매주 갈 때마다 이름 한 명 한 명 다 불러주시고 늘 활기 넘치게 아기 한 명 한 명이랑 놀이해주셨어요~! 그래서인지 아기가 선생님을 좋아하는 게 느껴지더라구요! 사진도 고퀄리티로 액자까지 받을 수 있어 추억도 제대로 남길 수 있어 좋아요! 선생님+수업+사진 다 마음에 들어서 연달아 2번 수강했습니다! 감사합니다 :-)' },
  { title: '키즈와플 아기가 너무 좋아했어요-!', author: '강*경', place: '클래스콕 수원점', date: '2026.02.25', accent: 'var(--kw-coral)', photos: [kang1, kang2],
    body: '좀 더 일찍 알았더라면 좋았을걸, 3월부터 어린이집에 가서 더 못 들어 너무 아쉬워요 ㅠ-ㅠ 아기가 율동부터 악기놀이, 촉감놀이까지 다 너무 좋아했습니다! 집중력이 짧은데 다양한 활동을 할 수 있어 더 좋았어요 :) 강사님께서도 항상 반겨주시고 놀이할 때 아기랑 같이 소통도 해주셔서 아기도 적극적으로 마음 놓고 수업 들을 수 있었던 거 같아요! ㅎㅎ 예쁜 사진도 찍어주시고 강추입니다! 기회되면 또 듣고 싶어요!' },
  { title: '아이가 너무 행복해하는 수업', author: '지*경', place: '클래스콕 수원점', date: '2025.12.26', accent: 'var(--kw-yellow)', photos: [ji1],
    body: '듣고 있는 문센 수업 3개 중 가장 만족도 높은 수업이에요! 우선, 아이가 수업 들을 때마다 많이 웃으며 행복해하는 표정을 볼 때마다 “아, 이 수업은 계속 들어야겠다!”라는 생각이 들었어요. 선생님도 매 수업마다 아이 이름을 불러주시며 아이를 예뻐해주시고! 한 명 한 명 너무 잘 대해주세요. 그리고 들었던 다른 수업들보다 교구 퀄리티랑 청결도가 너무 좋아서 다음 달도 수업 이어 들으려고 합니다! 연말에 아이에게 행복한 시간들 만들어주셔서 감사해요.' },
  { title: '키즈와플 오감팡팡 롯데동탄 수업후기', author: '이*민', place: '롯데백화점 동탄점', date: '2025.05.25', accent: 'var(--kw-sky)', photos: [],
    body: '첫 아기와 함께한 첫 수업. 소수 인원으로 진행된다고 하여 처음에는 괜찮을까 걱정도 되었지만, 막상 수업에 참여해보니 정해진 인원수 덕분에 아기들의 집중도가 훨씬 높았고, 선생님께서도 한 명 한 명 아이를 세심하게 살펴주셔서 괜한 걱정을 했구나 싶었습니다. 특히 마지막에 선물로 받은 사진을 보며 첫 수업 때의 감정이 떠올라 참 감동적이고 좋았어요. 처음이라 모든 게 낯설었지만, 부드럽고 따뜻한 분위기 덕분에 아기와 함께 편안하게 수업을 즐길 수 있었습니다. 감사합니다.' },
  { title: '9개월 아기, 육아휴직 아빠랑 다녀왔어요! (찐후기)', author: '맘카페 후기', place: '신세계백화점 타임스퀘어점', date: '2025.02', accent: 'var(--kw-green)', photos: [],
    body: '울 애기 9개월쯤 됐을 때 키즈와플 오감팡팡 수업 들었습니다! 결론부터 말하자면 진짜 강추!! 프로그램 구성이 진짜 알차더라고요. 아가들 놀이 활동, 감각 자극 활동들이 짱짱하게 짜여 있고, 매주 주제도 바뀌니까 울 애기가 지루해할 틈이 없었어요! 무엇보다 선생님이 진짜 최고예요! 아가들 한 명 한 명 다정하게 이름 불러주시고, 관심 가져주시는 게 느껴져서 넘 감사했어요. 문화센터 시설도 깨끗하고, 아가들 안전하게 놀 수 있게 잘 되어 있어서 안심이었어요. 울 애기 맘껏 기어 다니고, 뒹굴뒹굴하면서 신나게 놀았답니다! 육아휴직 아빠들, 키즈와플 오감팡팡 완전 강추해요! 아가랑 좋은 추억 많이 만들 수 있을 거예요!' },
  { title: '키즈와플 오감팡팡 타임스퀘어점 수업후기', author: '맘카페 후기', place: '신세계백화점 타임스퀘어점', date: '2025.02', accent: 'var(--kw-coral)', photos: [],
    body: '여름학기에 수강하고 다른 수업도 경험하고 싶어서 다른 수업을 들었다가 다시 돌아온 키즈와플! 처음엔 앉아만 있던 아기였는데 어느덧 기동성이 좋아져서 선생님이 교구를 꺼내면 다가가기도 하고, 여름보다 좀 더 적극적으로 수업에 참여할 수 있었어요. 악기 교구들과 촉감놀이, 매주 테마에 맞는 교구들로 40분 동안 신나게 놀 수 있어요! 거기에 퀄 좋은 코스튬으로 너무 귀여운 모습도 볼 수 있고, 사진 선생님께서 아기들의 이쁜 모습을 찍어 종강 때 인화도 해주는 사진 선물까지! 꽉 찬 겨울학기였습니다! 이제 어린이집 가야 해서 문센은 끝이지만 좋은 기억으로 가지고 갑니다.' }
];
const FIRST = 6;

function ReviewCard({ r, mobile }) {
  const [open, setOpen] = React.useState(false);
  const long = r.body.length > 150;
  const n = r.photos.length;
  return (
    <article style={{
      display: 'flex', flexDirection: 'column', gap: 16, padding: mobile ? 24 : 28, 
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)',
      ...(mobile ? { width: 'min(320px,84vw)', flex: '0 0 auto' } : {})
    }}>
      <Icon name="quote" size={26} style={{ color: r.accent }} />
      <h3 style={{ font: 'var(--type-h4)', color: 'var(--text-strong)' }}>{r.title}</h3>
      <p style={{ font: 'var(--type-body)', color: 'var(--text-body)', ...(long && !open ? { display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }}>{r.body}</p>
      {long && (
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
          style={{ alignSelf: 'flex-start', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', font: 'var(--type-button-sm)', color: 'var(--text-brand)' }}>
          {open ? '접기' : '전체 보기'}
        </button>
      )}
      {n > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: n === 1 ? '1fr' : 'repeat(' + n + ',1fr)', gap: 8 }}>
          {r.photos.map((src, i) => (
            <img key={i} src={src} alt="수강 후기에 올라온 수업 사진" loading="lazy"
              style={{ width: '100%', aspectRatio: n === 1 ? '16/10' : '1/1', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      )}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ font: 'var(--type-h5)', color: 'var(--text-strong)' }}>{r.author}{r.author.includes('후기') ? '' : ' 님'}</div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{r.place} · {r.date}</div>
      </div>
    </article>
  );
}

export function Reviews() {
  const mobile = useIsMobile();
  const [all, setAll] = React.useState(false);
  const list = mobile || all ? REVIEWS : REVIEWS.slice(0, FIRST);
  return (
    <section id="reviews" style={{ padding: 'var(--section-y) 0 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 48 }}>
        <SectionHeader align="center" label="학부모 후기" title="아이의 변화를 가장 먼저 알아채는 분들"
          lead="문화센터에서 키즈와플 오감팡팡을 함께한 보호자께 받은 후기입니다."
          action={<Chip icon="star" tone="yellow">실제 수강 후기</Chip>} />
        {mobile
          ? <Rail gap={14} itemWidth="min(320px,84vw)">{list.map((r) => <ReviewCard key={r.title + r.date} r={r} mobile />)}</Rail>
          : <div style={{ display: 'grid', alignItems: 'start', gap: 24 }} className="kw-reviews-grid">{list.map((r) => <ReviewCard key={r.title + r.date} r={r} />)}</div>}
        {!mobile && REVIEWS.length > FIRST && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => setAll(!all)}>{all ? '후기 접기' : '후기 더 보기 (' + (REVIEWS.length - FIRST) + ')'}</Button>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="lg" full={mobile} icon="phone" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담하기</Button>
        </div>
      </div>
    </section>
  );
}
