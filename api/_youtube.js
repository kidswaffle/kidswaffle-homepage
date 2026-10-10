// Helpers for api/videos.js: read a channel's public RSS feed and keep regular (non-Shorts) videos.

export const HANDLE_URL = 'https://www.youtube.com/@%ED%82%A4%EC%A6%88%EC%99%80%ED%94%8C';

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");

export function parseFeed(xml) {
  const out = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = (e.match(/<title>([^<]*)<\/title>/) || [])[1];
    const href = (e.match(/<link rel="alternate" href="([^"]+)"/) || [])[1] || '';
    const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
    if (id && title) out.push({ id, title: decode(title).trim(), href, published });
  }
  return out;
}

// Tabs on the site: "동요" when the title reads like a song, otherwise "수업 소개".
export function topicOf(title) {
  return /송|노래|동요|율동|song/i.test(title) ? '동요' : '수업 소개';
}

export function findChannelId(html) {
  const pick = (re) => (html.match(re) || [])[1];
  return pick(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/)
    || pick(/"externalId":"(UC[\w-]{22})"/)
    || pick(/"channelId":"(UC[\w-]{22})"/);
}

// Shorts open at /shorts/ID with 200; regular videos redirect to /watch.
export async function isShort(video) {
  if (video.href.includes('/shorts/')) return true;
  try {
    const r = await fetch('https://www.youtube.com/shorts/' + video.id, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(4000) });
    return r.status === 200;
  } catch {
    return false;
  }
}
