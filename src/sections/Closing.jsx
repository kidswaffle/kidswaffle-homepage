import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { Accordion } from '../components/core/Accordion.jsx';
import { Footer } from '../components/navigation/Footer.jsx';
import { Button } from '../components/core/Button.jsx';
import { Card } from '../components/core/Card.jsx';
import { KAKAO, YOUTUBE_CHANNEL, goto, useIsMobile } from '../lib.js';
import waple from '../assets/characters/waple-drop-in.webp';

export const FAQ = [
  { q: '몇 개월부터 참여할 수 있나요?', a: '키즈와플 오감팡팡은 생후 5개월부터 24개월까지의 영유아가 부모와 함께 참여하는 문화센터 오감놀이 수업입니다.' },
  { q: '부모님이 수업에 함께 들어가나요?', a: '네, 부모와 아이가 함께 듣는 수업입니다. 베이직은 보호자가 아이와 함께 활동에 깊이 참여하는 과정이고, 프리미엄은 사진 촬영을 전문 촬영 선생님께 맡기고 아이에게만 집중할 수 있는 과정입니다.' },
  { q: '클래스당 인원은 몇 명인가요?', a: '키즈와플 오감팡팡은 한 클래스 최대 10명입니다. 선생님 두 분이 함께 들어가 아이마다 머무는 시간을 다르게 가져갑니다.' },
  { q: '베이직과 프리미엄은 무엇이 다른가요?', a: '두 과정 모두 같은 커리큘럼과 교구로 진행합니다. 프리미엄은 전문 촬영 선생님이 수업 내내 아이의 개인컷과 포토존 컷을 촬영하고, 마지막 주에 베스트 컷을 인화·포장해 선물로 드립니다.' },
  { q: '수업은 어떻게 진행되나요?', a: '매 수업은 첫 인사 노래, 인지카드, 악기 연주, 오감교구 활동, 포토존 사진, 정리정돈, 끝 인사노래의 7단계로 진행합니다. 매주 테마가 바뀌고, 테마에 맞춰 교구와 의상, 포토존을 새로 준비합니다.' },
  { q: '교구 위생과 안전은 어떻게 관리하나요?', a: '매 수업 사용하는 모든 교구는 아기에게 안전한 소독제와 소독 티슈로 강사가 직접 세척합니다. 구강기 아기를 고려해 입에 넣었던 교구는 따로 분리해 관리하고, 놀이 중에도 강사가 위험 요소를 계속 살핍니다.' },
  { q: '정말 아이 발달에 도움이 될까요? 다른 아이와 비교되진 않을까요?', a: '오감팡팡의 활동은 색, 소리, 촉감, 안전한 재료로 하는 후각·미각 놀이처럼 집에서 경험하기 어려운 다양한 감각 자극을 주도록 구성했습니다. 키즈와플은 다른 아기와 비교하지 않고, 우리 아이가 이전보다 무엇을 즐거워하고 새롭게 시도하는지에 집중합니다.' },
  { q: '수강 신청은 어떻게 하나요?', a: '키즈와플 오감팡팡은 문화센터 강좌로 운영합니다. 카카오톡으로 상담을 남겨 주시면 가까운 지점과 학기 일정을 안내해 드립니다.' }
];

export function Closing() {
  const mobile = useIsMobile();
  const [region, setRegion] = React.useState(false);
  return (
    <>
      <section id="faq" style={{ padding: 'var(--section-y) 0 0' }}>
        <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 40 }}>
          <SectionHeader align="center" label="자주 묻는 질문" title="궁금한 점을 미리 정리했습니다" />
          <Accordion items={FAQ} />
        </div>
      </section>

      <section id="contact" style={{ padding: 'var(--section-y) 0 0' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <Card tone="waffle" pad={0} radius="var(--radius-2xl)" elevated={false}
            style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(340px,1fr))', gap: 0, overflow: 'hidden' }}>
            <div style={{ padding: mobile ? '36px 24px 0' : 56, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
              <h2 style={mobile ? { font: 'var(--type-h2)', fontSize: 28 } : { font: 'var(--type-h2)' }}>오늘, 아이의 첫 놀이를<br />시작해 보세요</h2>
              <p style={{ font: 'var(--type-body-lg)', color: 'var(--kw-ink-700)', maxWidth: 400 }}>
                카카오톡으로 아이의 월령과 사는 지역을 남겨 주시면, 가까운 문화센터 수업과 학기 일정을 안내해 드립니다.
              </p>
              <img src={waple} alt="손을 흔드는 키즈와플 캐릭터 와플이" loading="lazy" style={mobile ? { width: 180, marginTop: 8, alignSelf: 'center' } : { width: 220, marginTop: 8 }} />
            </div>
            <div style={{ background: 'var(--surface-card)', padding: mobile ? 24 : 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ font: 'var(--type-h4)' }}>카카오톡으로 바로 상담하세요</div>
                <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>아이의 월령과 희망 지역을 남겨 주시면 가까운 문화센터 수업과 학기 일정을 안내해 드립니다.</p>
                <Button full size="lg" icon="phone" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담하기</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="kw-footer" style={{ marginTop: 'var(--section-y)' }}>
        <Footer
          tagline="키즈와플 오감팡팡 · 문화센터 영유아 오감놀이"
          social={[{ name: 'YouTube', icon: 'youtube', href: YOUTUBE_CHANNEL }, { name: '카카오톡 채널', icon: 'phone', href: 'https://pf.kakao.com/_Kxjwwxj' }, { name: '메일', icon: 'mail', href: 'mailto:kidswaffle@naver.com' }]}
          columns={[
            { title: 'PROGRAM', links: [{ label: '인사와 노래', href: '#program', onClick: goto('program') }, { label: '인지카드', href: '#program', onClick: goto('program') }, { label: '오감교구 활동', href: '#program', onClick: goto('program') }, { label: '포토존과 정리', href: '#program', onClick: goto('program') }, { label: '테마 오감놀이', href: '#season', onClick: goto('season') }] },
            { title: 'KIDSWAFFLE', links: [{ label: '브랜드 소개', href: '#brand', onClick: goto('brand') }, { label: '캐릭터', href: '#characters', onClick: goto('characters') }, { label: '수업 영상', href: '#videos', onClick: goto('videos') }, { label: '학부모 후기', href: '#reviews', onClick: goto('reviews') }] },
            { title: 'SUPPORT', links: [{ label: '자주 묻는 질문', href: '#faq', onClick: goto('faq') }, { label: '카카오톡 상담', href: KAKAO }, { label: '운영 지역', href: '#', onClick: (e) => { e.preventDefault(); setRegion(!region); }, note: region ? <div style={{ marginTop: 8, font: 'var(--type-caption)', color: 'var(--text-on-dark-muted)' }}>수원·화성·서울·파주 문화센터</div> : null }] }
          ]}
          info={<><span>상호 키즈와플 오감팡팡 | 대표 이승진 | 사업자등록번호 325-41-00862</span><span>이메일 kidswaffle@naver.com</span></>}
          legal={['이용약관', '개인정보처리방침']} />
      </div>
    </>
  );
}
