import { HANDLE_URL, parseFeed, topicOf, findChannelId, isShort } from './_youtube.js';

let channelId = process.env.YOUTUBE_CHANNEL_ID || '';

export default async function handler(req, res) {
  try {
    if (!channelId) {
      const page = await fetch(HANDLE_URL, { headers: { 'accept-language': 'ko-KR,ko;q=0.9' }, signal: AbortSignal.timeout(6000) });
      channelId = findChannelId(await page.text()) || '';
    }
    if (!channelId) throw new Error('channel id not found');
    const feed = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId, { signal: AbortSignal.timeout(6000) });
    if (!feed.ok) throw new Error('feed ' + feed.status);
    const entries = parseFeed(await feed.text()).slice(0, 15);
    const shorts = await Promise.all(entries.map(isShort));
    const videos = entries.filter((_, i) => !shorts[i]).map(({ id, title, published }) => ({ id, title, published, topic: topicOf(title) }));
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ videos });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
}
