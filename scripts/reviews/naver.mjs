// Naver blog search API (needs NAVER_CLIENT_ID / NAVER_CLIENT_SECRET), then the post text for each hit.
const QUERY = '키즈와플 오감팡팡';
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").trim();

export async function fetchBlogs(browser) {
  const id = process.env.NAVER_CLIENT_ID, secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) { console.log('naver: no API keys, skipped'); return []; }
  const url = 'https://openapi.naver.com/v1/search/blog.json?display=30&sort=date&query=' + encodeURIComponent(QUERY);
  const res = await fetch(url, { headers: { 'X-Naver-Client-Id': id, 'X-Naver-Client-Secret': secret } });
  if (!res.ok) { console.error('naver API', res.status, await res.text()); return []; }
  const items = (await res.json()).items || [];
  const rows = [];
  for (const it of items) {
    const m = String(it.link).match(/blog\.naver\.com\/([^/?]+)\/(\d+)|blogId=([^&]+)&logNo=(\d+)/);
    if (!m) continue; // only plain Naver blog posts
    const blogId = m[1] || m[3], logNo = m[2] || m[4];
    rows.push({
      id: `blog-${blogId}-${logNo}`, source: 'blog', url: `https://blog.naver.com/${blogId}/${logNo}`, mobile: `https://m.blog.naver.com/${blogId}/${logNo}`,
      author: strip(it.bloggername), title: strip(it.title), snippet: strip(it.description),
      date: /^\d{8}$/.test(it.postdate) ? `${it.postdate.slice(0, 4)}.${it.postdate.slice(4, 6)}.${it.postdate.slice(6, 8)}` : ''
    });
  }
  console.log(`naver: ${rows.length} blog posts found`);
  // post text for the judge (falls back to the search snippet)
  const ctx = await browser.newContext({ locale: 'ko-KR', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const page = await ctx.newPage();
  for (const r of rows.slice(0, 20)) {
    r.body = r.snippet;
    try {
      await page.goto(r.mobile, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForSelector('.se-main-container, #postViewArea, .post_ct', { timeout: 6000 });
      const t = await page.$eval('.se-main-container, #postViewArea, .post_ct', (e) => e.innerText);
      if (t && t.length > r.snippet.length) r.body = t.replace(/\n{3,}/g, '\n\n').trim().slice(0, 3500);
    } catch { /* keep the snippet */ }
  }
  await ctx.close();
  return rows.slice(0, 20);
}
