// Discovery run 2: list the 키즈와플 classes of each store, open a detail page and look for its reviews.
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = 'discovery3';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const log = [];
const STORES = [['suwon', '스타필드\n수원'], ['unjeong', '스타필드 빌리지\n운정']];

for (const [key, label] of STORES) {
  const ctx = await browser.newContext({ locale: 'ko-KR', viewport: { width: 430, height: 932 } });
  const page = await ctx.newPage();
  const net = [];
  page.on('response', async (r) => {
    if (!/json/.test(r.headers()['content-type'] || '')) return;
    let body = ''; try { body = (await r.text()).slice(0, 1500); } catch { /* streamed */ }
    net.push({ url: r.url(), method: r.request().method(), post: (r.request().postData() || '').slice(0, 300), body });
  });
  const snap = async (name, full = false) => {
    await page.waitForTimeout(1500);
    fs.writeFileSync(`${OUT}/${key}-${name}.html`, await page.content());
    await page.screenshot({ path: `${OUT}/${key}-${name}.png`, fullPage: full });
  };
  try {
    await page.goto('https://www.classkok.com', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('a', { hasText: label.split('\n')[1] }).first().click({ timeout: 8000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.goto('https://www.classkok.com/', { waitUntil: 'networkidle' });
    await page.locator('button:has-text("클래스검색")').first().click({ timeout: 8000 });
    await page.waitForTimeout(1500);
    await snap('search-open');
    const input = page.locator('input#search:visible, input[placeholder*="검색"]:visible').first();
    await input.fill('키즈와플', { timeout: 8000 }); await input.press('Enter');
    await page.waitForLoadState('networkidle').catch(() => {});
    await snap('list');
    const items = await page.$$eval('#ulViewThumbnail li', (lis) => lis.map((li) => {
      const a = li.querySelector('a[onclick*=fn_moveLctrDetail]');
      const m = a && a.getAttribute('onclick').match(/L\d+/);
      return { no: m && m[0], title: (li.querySelector('img') || {}).alt, text: li.innerText.replace(/\s+/g, ' ').slice(0, 160) };
    }));
    fs.writeFileSync(`${OUT}/${key}-items.json`, JSON.stringify(items, null, 1));
    log.push(`${key}: ${items.length} items, store ${await page.locator('button:has-text("점")').first().innerText().catch(() => '?')}`);
    // open the first detail page
    if (items[0] && items[0].no) {
      await page.evaluate((no) => fn_moveLctrDetail(no), items[0].no);
      await page.waitForLoadState('networkidle').catch(() => {});
      await snap('detail', true);
      const tabs = await page.$$eval('a,button,li', (els) => els.map((e) => (e.innerText || '').trim().slice(0, 40)).filter((t) => /후기|리뷰/.test(t)));
      log.push(`${key} review-ish labels: ${JSON.stringify([...new Set(tabs)].slice(0, 10))}`);
      const tab = page.getByText(/수강후기|후기|리뷰/).first();
      if (await tab.count()) { await tab.click({ timeout: 5000 }).catch(() => {}); await snap('detail-reviews', true); }
    }
  } catch (e) { log.push(`${key} ERROR ${e.message}`); }
  fs.writeFileSync(`${OUT}/${key}-network.json`, JSON.stringify(net, null, 1));
  await ctx.close();
}
fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
await browser.close();
