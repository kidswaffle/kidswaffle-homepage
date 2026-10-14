import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { Accordion } from '../components/core/Accordion.jsx';
import { Footer } from '../components/navigation/Footer.jsx';
import { Button } from '../components/core/Button.jsx';
import { Card } from '../components/core/Card.jsx';
import { KAKAO, YOUTUBE_CHANNEL, goto, useIsMobile } from '../lib.js';
import waple from '../assets/characters/waple-drop-in.webp';
import { FAQ } from '../data/faq.js';

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
