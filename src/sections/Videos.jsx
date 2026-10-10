import React from 'react';
import { SectionHead as SectionHeader } from './Mobile.jsx';
import { VideoCard } from '../components/marketing/VideoCard.jsx';
import { Button } from '../components/core/Button.jsx';
import { SegmentedTabs } from '../components/navigation/SegmentedTabs.jsx';
import { YOUTUBE_CHANNEL as CH, useIsMobile } from '../lib.js';

const MAX_VIDEOS = 3;

// Shown until (or if) the live list from /api/videos is unavailable.
const FALLBACK = [
  { id: '8MRenGULq5o', title: '키즈와플 인사송', topic: '동요' },
  { id: 'UMkl6HulSek', title: '키즈와플 첫인사송 (친구들을 소개해요)', topic: '동요' },
  { id: '3KN4IGx3wMQ', title: '문화센터 오감놀이 이곳이 좋은 이유 3가지', topic: '수업 소개' }
];
const TOPICS = ['동요', '수업 소개'];
const watchUrl = (id) => 'https://www.youtube.com/watch?v=' + id;

// Newest videos from the channel's RSS feed (shorts excluded server-side), or null on any failure.
function useChannelVideos() {
  const [videos, setVideos] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    fetch('/api/videos')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (alive && Array.isArray(d.videos) && d.videos.length) setVideos(d.videos); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return videos;
}

// The same dark card as VideoCard, with the YouTube player in place of the thumbnail.
function PlayingCard({ video }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-dark-raised)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
        <iframe src={'https://www.youtube-nocookie.com/embed/' + video.id + '?autoplay=1&rel=0&playsinline=1'} title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ alignSelf: 'flex-start', font: 'var(--type-label)', color: 'var(--text-on-dark)', background: 'var(--surface-dark)', borderRadius: 'var(--radius-pill)', padding: '0 14px', height: 32, display: 'inline-flex', alignItems: 'center' }}>{video.topic}</span>
        <div style={{ font: 'var(--type-h4)', color: '#fff' }}>{video.title}</div>
      </div>
    </div>
  );
}

export function Videos() {
  const mobile = useIsMobile();
  const live = useChannelVideos();
  const clips = live || FALLBACK;
  const [tab, setTab] = React.useState('전체');
  const [playing, setPlaying] = React.useState(null);
  const tabs = ['전체'].concat(TOPICS.filter((t) => clips.some((c) => c.topic === t)));
  const active = tabs.includes(tab) ? tab : '전체';
  const list = (active === '전체' ? clips : clips.filter((c) => c.topic === active)).slice(0, MAX_VIDEOS);
  return (
    <section id="videos" style={{ marginTop: 'var(--section-y)', background: 'var(--surface-dark)', padding: 'var(--section-y) 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'flex', flexDirection: 'column', gap: mobile ? 28 : 44 }}>
        <SectionHeader align="center" tone="dark" label="수업 영상" title="집에서도 키즈와플 친구들과 함께"
          lead="키즈와플 유튜브 채널에서 노래와 오감놀이 이야기를 만나 보세요."
          action={<Button variant="ghost" iconRight="youtube" href={CH} target="_blank" rel="noreferrer" style={{ color: '#fff', border: '1px solid var(--border-dark)' }}>유튜브 채널 보기</Button>} />
        {tabs.length > 2 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <SegmentedTabs tone="dark" value={active} onChange={setTab} items={tabs.map((label) => ({ label }))} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(320px,1fr))', gap: mobile ? 16 : 24 }}>
          {list.map((c) => c.id === playing
            ? <PlayingCard key={c.id} video={c} />
            : <VideoCard key={c.id} title={c.title} topic={c.topic} href={watchUrl(c.id)} thumbnail={'https://img.youtube.com/vi/' + c.id + '/hqdefault.jpg'}
                onClick={(e) => { e.preventDefault(); setPlaying(c.id); }} />)}
        </div>
      </div>
    </section>
  );
}
