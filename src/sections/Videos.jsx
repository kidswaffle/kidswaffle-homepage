import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { VideoCard } from '../components/marketing/VideoCard.jsx';
import { Button } from '../components/core/Button.jsx';
import { SegmentedTabs } from '../components/navigation/SegmentedTabs.jsx';
import { YOUTUBE_CHANNEL as CH, useIsMobile } from '../lib.js';

const CLIPS = [
  { title: '키즈와플 인사송', duration: '01:41', topic: '동요', href: 'https://youtu.be/8MRenGULq5o?si=3uGteWoYPsXEgM_Q', thumbnail: 'https://img.youtube.com/vi/8MRenGULq5o/hqdefault.jpg' },
  { title: '키즈와플 첫인사송 (친구들을 소개해요)', duration: '01:21', topic: '동요', href: 'https://youtu.be/UMkl6HulSek?si=XLsYb5FusxXjKW4j', thumbnail: 'https://img.youtube.com/vi/UMkl6HulSek/hqdefault.jpg' },
  { title: '문화센터 오감놀이 이곳이 좋은 이유 3가지', topic: '수업 소개', href: 'https://youtu.be/3KN4IGx3wMQ?si=4Az6Aq6YgxlWS8zR', thumbnail: 'https://img.youtube.com/vi/3KN4IGx3wMQ/hqdefault.jpg' }
];

export function Videos() {
  const mobile = useIsMobile();
  const [tab, setTab] = React.useState('전체');
  const list = tab === '전체' ? CLIPS : CLIPS.filter((c) => c.topic === tab);
  return (
    <section id="videos" style={{ marginTop: 'var(--section-y)', background: 'var(--surface-dark)', padding: 'var(--section-y) 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 44 }}>
        <SectionHeader align="center" tone="dark" label="수업 영상" title="집에서도 키즈와플 친구들과 함께"
          lead="키즈와플 유튜브 채널에서 노래와 오감놀이 이야기를 만나 보세요."
          action={<Button variant="ghost" iconRight="youtube" href={CH} target="_blank" rel="noreferrer" style={{ color: '#fff', border: '1px solid var(--border-dark)' }}>유튜브 채널 보기</Button>} />
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <SegmentedTabs tone="dark" value={tab} onChange={setTab}
            items={['전체', '동요', '수업 소개'].map((label) => ({ label }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(320px,1fr))', gap: mobile ? 16 : 24 }}>
          {list.map((c) => <VideoCard key={c.title} {...c} target="_blank" rel="noreferrer" />)}
        </div>
      </div>
    </section>
  );
}
