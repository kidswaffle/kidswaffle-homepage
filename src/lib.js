import React from 'react';

export const KAKAO = 'http://pf.kakao.com/_Kxjwwxj/chat';
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@%ED%82%A4%EC%A6%88%EC%99%80%ED%94%8C';

export const goto = (id) => (e) => {
  if (e && e.preventDefault) e.preventDefault();
  const el = document.getElementById(id);
  // Leave room for the sticky phone header when it is on screen.
  const offset = document.querySelector('.kw-mnav') ? 92 : 40;
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
};

// Phone layout switch — matches the 760px breakpoint in styles/layout.css.
const MOBILE_QUERY = '(max-width: 760px)';
const subscribe = (cb) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(MOBILE_QUERY).matches, () => false);
}
