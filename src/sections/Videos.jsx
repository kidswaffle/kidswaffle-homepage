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

const ICON = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 5h4v14H6zM14 5h4v14h-4z',
  volume: 'M3 10v4h4l5 4V6L7 10H3zM16 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  mute: 'M3 10v4h4l5 4V6L7 10H3zM16 9l5 6M21 9l-5 6',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'
};
function Glyph({ name }) {
  const line = name === 'volume' || name === 'mute' || name === 'expand';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill={line ? 'none' : 'currentColor'} stroke={line ? 'currentColor' : 'none'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON[name]} />
    </svg>
  );
}

// The same dark card as VideoCard, with the YouTube player in place of the thumbnail.
// YouTube's own control bar is turned off; a small bar of ours (play/pause, sound, fullscreen)
// appears only while the pointer is over the video. Clicking the video also toggles play/pause.
function PlayingCard({ video }) {
  const frame = React.useRef(null);
  const box = React.useRef(null);
  const [playing, setPlaying] = React.useState(true);
  const [muted, setMuted] = React.useState(false);
  const send = (func, args = []) => frame.current && frame.current.contentWindow &&
    frame.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  // Captions stay off: YouTube can switch them on from the viewer's own account settings.
  const captionsOff = () => { send('unloadModule', ['captions']); send('unloadModule', ['cc']); };

  React.useEffect(() => {
    // Keep the button in step with the player (e.g. when the video ends).
    const onMessage = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      let d = e.data;
      try { if (typeof d === 'string') d = JSON.parse(d); } catch { return; }
      const st = d && d.info && d.info.playerState;
      if (st === 1) { setPlaying(true); captionsOff(); }
      else if (st === 2 || st === 0) setPlaying(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const toggle = () => { send(playing ? 'pauseVideo' : 'playVideo'); setPlaying(!playing); };
  const toggleSound = (e) => { e.stopPropagation(); send(muted ? 'unMute' : 'mute'); setMuted(!muted); };
  const fullscreen = (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) document.exitFullscreen();
    else if (box.current && box.current.requestFullscreen) box.current.requestFullscreen();
  };
  const btn = { width: 40, height: 40, display: 'grid', placeItems: 'center', border: 0, borderRadius: '50%', background: 'transparent', color: '#fff', cursor: 'pointer' };
  const src = 'https://www.youtube-nocookie.com/embed/' + video.id +
    '?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-dark-raised)', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <div ref={box} className="kw-player" style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
        <iframe ref={frame} src={src} title={video.title}
          onLoad={() => { frame.current && frame.current.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); captionsOff(); }}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        <div onClick={toggle} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
        <div className="kw-player-bar" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '28px 12px 10px', background: 'linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,0))', pointerEvents: 'none' }}>
          <button type="button" aria-label={playing ? '일시정지' : '재생'} onClick={(e) => { e.stopPropagation(); toggle(); }} style={{ ...btn, pointerEvents: 'auto' }}><Glyph name={playing ? 'pause' : 'play'} /></button>
          <button type="button" aria-label={muted ? '소리 켜기' : '소리 끄기'} onClick={toggleSound} style={{ ...btn, pointerEvents: 'auto' }}><Glyph name={muted ? 'mute' : 'volume'} /></button>
          <span style={{ flex: 1 }} />
          <button type="button" aria-label="전체 화면" onClick={fullscreen} style={{ ...btn, pointerEvents: 'auto' }}><Glyph name="expand" /></button>
        </div>
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
