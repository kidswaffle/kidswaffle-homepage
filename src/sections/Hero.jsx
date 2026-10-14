import React from 'react';
import { NavBar } from '../components/navigation/NavBar.jsx';
import { Button } from '../components/core/Button.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Chip } from '../components/core/Chip.jsx';
import { LogoTicker } from '../components/marketing/LogoTicker.jsx';
import { KAKAO, goto, useIsMobile } from '../lib.js';
import logo from '../assets/logo.png';
import { NAV } from './Mobile.jsx';
import waple from '../assets/characters/waple-drop-in.webp';
import shinsegae from '../assets/partners/shinsegae.webp';
import emart from '../assets/partners/emart.webp';
import classcoc from '../assets/partners/classcoc.webp';
import lotte from '../assets/partners/lotte.webp';
import hyundai from '../assets/partners/hyundai.webp';
import seoulChildcare from '../assets/partners/seoul-childcare.webp';
import gyeonggiChildcare from '../assets/partners/gyeonggi-childcare.webp';
import akPlaza from '../assets/partners/ak-plaza.webp';
import galleria from '../assets/partners/galleria.webp';

const PARTNERS = [
  { logo: shinsegae, name: '신세계백화점 문화센터' },
  { logo: emart, name: '이마트 문화센터' },
  { logo: classcoc, name: '스타필드 클래스콕' },
  { logo: lotte, name: '롯데백화점 문화센터' },
  { logo: hyundai, name: '현대백화점 문화센터' },
  { logo: seoulChildcare, name: '서울시육아종합지원센터' },
  { logo: gyeonggiChildcare, name: '경기도 육아종합지원센터' },
  { logo: akPlaza, name: 'AK플라자 문화센터' },
  { logo: galleria, name: '갤러리아 문화센터' }
];

function Blob({ color, size, top, left, right, delay = 0, opacity = 1 }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', top, left, right, width: size, height: size * 0.86, background: color, opacity,
      borderRadius: '58% 42% 47% 53% / 46% 52% 48% 54%', pointerEvents: 'none',
      animation: 'kwFloat var(--cycle-blob) ease-in-out infinite', animationDelay: (-delay * 3.7) + 's'
    }} />
  );
}

// Phone hero (mobile kit): copy stack, full-width CTAs, then the bobbing 와플이 and the partner rail.
function MobileHero() {
  return (
    <header style={{ position: 'relative', overflowX: 'clip', paddingBottom: 8 }}>
      <Blob color="var(--kw-yellow-tint)" size={210} top={-40} right={-70} />
      <Blob color="var(--kw-mint-tint)" size={160} top={520} left={-80} delay={1.4} opacity={.7} />
      <div className="kw-rise" style={{ position: 'relative', padding: '36px var(--gutter) 0', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
        <span style={{ font: 'var(--type-label)', letterSpacing: '.02em', color: 'var(--text-brand)' }}>부모와 함께하는 영유아 오감놀이 · 키즈와플 오감팡팡</span>
        <h1 style={{ font: 'var(--type-h1)', fontSize: 'clamp(34px,10vw,42px)', lineHeight: 1.14 }}>
          <span style={{ display: 'block', color: 'var(--brand)' }}>북적이지 않아서,</span>
          <span style={{ display: 'block' }}>아이가 머무는 오감놀이</span>
        </h1>
        <p style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>
          5~24개월 아이와 부모가 함께 듣는 수업입니다. 한 클래스 최대 10명으로, 아이가 충분히 만지고 반응할 때까지 기다립니다. 매주 바뀌는 테마 놀이와 포토존 사진으로 첫 놀이를 기록해요.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip tone="yellow" icon="baby">생후 5~24개월</Chip>
          <Chip tone="mint" icon="users">부모와 함께 듣는 수업</Chip>
          <Chip tone="mint" icon="users">한 클래스 최대 10명</Chip>
        </div>
        <Button full size="lg" icon="phone" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담하기</Button>
        <Button full size="lg" variant="secondary" icon="layout-grid" href="#program" onClick={goto('program')}>오감놀이 둘러보기</Button>
      </div>
      <div style={{ position: 'relative', marginTop: 28, display: 'grid', placeItems: 'center' }}>
        <span aria-hidden="true" style={{ position: 'absolute', width: 230, height: 230, background: 'var(--kw-yellow)', borderRadius: '54% 46% 43% 57% / 49% 44% 56% 51%', opacity: .9 }} />
        <img src={waple} alt="키즈와플 캐릭터 와플이가 두 팔을 벌리고 웃고 있다" width="1080" height="810" fetchpriority="high"
          style={{ position: 'relative', width: 300, maxWidth: '86%', height: 'auto', animation: 'kwBob var(--cycle-bob) ease-in-out infinite' }} />
      </div>
      <div style={{ padding: '28px var(--gutter) 0' }}>
        <LogoTicker caption="믿을 수 있는 파트너와 함께합니다" items={PARTNERS} />
      </div>
    </header>
  );
}

export function Hero() {
  const mobile = useIsMobile();
  if (mobile) return <MobileHero />;
  return (
    <header style={{ position: 'relative', paddingTop: 20, overflowX: 'clip', overflowY: 'visible', paddingBottom: 24 }}>
      <Blob color="var(--kw-yellow-tint)" size={340} top={-40} left={-110} opacity={.75} />
      <Blob color="var(--kw-mint-tint)" size={260} top={420} left={-90} delay={1.4} opacity={.7} />
      <Blob color="var(--kw-coral-tint)" size={300} top={-70} right={-120} delay={2.2} opacity={.6} />
      <Blob color="var(--kw-sky-tint)" size={210} top={480} right={-60} delay={0.7} opacity={.6} />

      <div style={{ position: 'relative', maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <NavBar sticky logoSrc={logo} active="" ctaLabel="카카오톡 상담하기" ctaHref={KAKAO} secondaryLabel=""
          onNavigate={(l) => goto(NAV[l])()}
          items={Object.keys(NAV).map((label) => ({ label }))} />
      </div>

      <div style={{
        position: 'relative', maxWidth: 'var(--container)', margin: '0 auto',
        padding: '48px var(--gutter) 0', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 48, alignItems: 'center'
      }}>
        <div className="kw-rise" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26 }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: '.02em', color: 'var(--text-brand)', display: 'flex', flexWrap: 'wrap', columnGap: 8 }}><span style={{ whiteSpace: 'nowrap' }}>부모와 함께하는 영유아 오감놀이 ·</span><span style={{ whiteSpace: 'nowrap' }}>키즈와플 오감팡팡</span></span>
          <h1 style={{ font: 'var(--type-h1)', fontSize: 'clamp(38px,5.2vw,74px)', lineHeight: 1.12 }}>
            <span style={{ display: 'block', color: 'var(--brand)' }}>북적이지 않아서,</span>
            <span style={{ display: 'block' }}>아이가 머무는 오감놀이</span>
          </h1>
          <p style={{ font: 'var(--type-body-lg)', fontSize: 19, color: 'var(--text-body)', maxWidth: 480 }}>
            5~24개월 아이와 부모가 함께 듣는 수업입니다. 한 클래스 최대 10명으로, 아이가 충분히 만지고 반응할 때까지 기다립니다. 매주 바뀌는 테마 놀이와 포토존 사진으로 첫 놀이를 기록해요.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button size="lg" icon="phone" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담하기</Button>
            <Button size="lg" variant="secondary" icon="layout-grid" href="#program" onClick={goto('program')}>오감놀이 둘러보기</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
            <Chip tone="yellow" icon="baby">생후 5~24개월</Chip>
            <Chip tone="mint" icon="users">부모와 함께 듣는 수업</Chip>
            <Chip tone="mint" icon="users">한 클래스 최대 10명</Chip>
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: 420, display: 'grid', placeItems: 'center' }}>
          <span aria-hidden="true" style={{
            position: 'absolute', width: 400, height: 400, background: 'var(--kw-yellow)',
            borderRadius: '54% 46% 43% 57% / 49% 44% 56% 51%', opacity: .9
          }} />
          <img src={waple} alt="키즈와플 캐릭터 와플이가 두 팔을 벌리고 웃고 있다" width="1080" height="810" fetchpriority="high"
            style={{ position: 'relative', width: '108%', maxWidth: 520, height: 'auto', animation: 'kwBob var(--cycle-bob) ease-in-out infinite' }} />
          <span style={{
            position: 'absolute', left: -8, bottom: 58, display: 'inline-flex', whiteSpace: 'nowrap', alignItems: 'center', gap: 10,
            padding: '12px 18px', background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-lift)', font: 'var(--type-body-sm)', color: 'var(--text-strong)',
            animation: 'kwBob var(--cycle-bob-chip) ease-in-out -2.1s infinite'
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--kw-yellow)' }} />
            와플이가 이번 주 놀이를 골랐어요
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: -12 }}>
        <a href="#program" onClick={goto('program')} style={{
          position: 'relative', display: 'flex', width: 'fit-content', margin: '12px auto 0', alignItems: 'center', gap: 8, height: 46, padding: '0 20px', whiteSpace: 'nowrap',
          background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-card)',
          font: 'var(--type-body-sm)', color: 'var(--text-body)'
        }}>
          수업 순서 보기
          <Icon name="chevron-down" size={16} style={{ color: 'var(--brand)', animation: 'kwNudge var(--cycle-nudge) ease-in-out infinite' }} />
        </a>
      </div>

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '48px var(--gutter) 0' }}>
        <LogoTicker caption="믿을 수 있는 파트너와 함께합니다" items={PARTNERS} />
      </div>
    </header>
  );
}
