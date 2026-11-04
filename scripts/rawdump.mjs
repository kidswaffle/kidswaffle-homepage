import { chromium } from 'playwright';
import fs from 'node:fs';
const browser = await chromium.launch();
const out = {};
for (const [key, label] of [['suwon', '수원'], ['unjeong', '운정']]) {
  const ctx = await browser.newContext({ locale: 'ko-KR', viewport: { width: 430, height: 932 } });
  const page = await ctx.newPage();
  try {
    await page.goto('https://www.classkok.com', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('a', { hasText: label }).first().click({ timeout: 10000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.goto('https://www.classkok.com/', { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.querySelectorAll('.main-popup-wrap').forEach((e) => e.remove()); document.querySelector('#popLctrSrch').click(); });
    const input = page.locator('input#search:visible, input[placeholder*="검색"]:visible').first();
    await input.fill('키즈와플'); await input.press('Enter');
    await page.waitForLoadState('networkidle').catch(() => {});
    const no = await page.$eval('#ulViewThumbnail a[onclick*=fn_moveLctrDetail]', (a) => a.getAttribute('onclick').match(/L\d+/)[0]);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }), page.evaluate((n) => fn_moveLctrDetail(n), no).catch(() => {})]);
    const res = await page.evaluate(async (n) => (await fetch('/mlt/selectLctrRvwList.do', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body: new URLSearchParams({ currentPageNo: '1', lctrNo: n, sortCd: '01', cstmrId: '' }) })).json(), no);
    const list = res.rvwList || [];
    out[key] = { keys: Object.keys(list[0] || {}), withImg: list.filter((r) => r.rvwImgAtflList && r.rvwImgAtflList.length).slice(0, 3).map((r) => ({ id: r.rvwSrnm, imgs: r.rvwImgAtflList })), total: list.length, imgCount: list.filter((r) => r.rvwImgAtflList && r.rvwImgAtflList.length).length };
    // is the image publicly downloadable without a session?
    const first = out[key].withImg[0] && out[key].withImg[0].imgs[0];
    out[key].sample = first;
  } catch (e) { out[key] = { error: e.message }; }
  await ctx.close();
}
fs.mkdirSync('rawdump', { recursive: true });
fs.writeFileSync('rawdump/out.json', JSON.stringify(out, null, 1));
await browser.close();
