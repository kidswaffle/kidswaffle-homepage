// One-off discovery run: records what classkok.com serves to a browser so the review collector can be written against it.
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = 'discovery';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: 'ko-KR', viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const net = [];
page.on('response', async (r) => {
  const ct = r.headers()['content-type'] || '';
  if (!/json/.test(ct)) return;
  let body = '';
  try { body = (await r.text()).slice(0, 400); } catch { /* streamed */ }
  net.push({ url: r.url(), status: r.status(), method: r.request().method(), body });
});

const log = [];
const snap = async (name) => {
  await page.waitForTimeout(1500);
  fs.writeFileSync(`${OUT}/${name}.html`, await page.content());
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  const links = await page.$$eval('a,button,input,select', (els) => els.map((e) => ({
    tag: e.tagName, text: (e.innerText || e.value || '').trim().slice(0, 60), href: e.getAttribute('href'), cls: (e.className || '').toString().slice(0, 60), ph: e.getAttribute('placeholder')
  })).filter((x) => x.text || x.href || x.ph));
  fs.writeFileSync(`${OUT}/${name}-elements.json`, JSON.stringify(links, null, 1));
  log.push(`${name}: ${page.url()}`);
};

try {
  await page.goto('https://www.classkok.com', { waitUntil: 'networkidle', timeout: 45000 });
  await snap('01-home');
  // try the region switcher (top right) and the search box
  const region = page.getByText(/지역|서울|경기|수원|전국/).first();
  if (await region.count()) { await region.click({ timeout: 5000 }).catch(() => {}); await snap('02-region-open'); }
  const search = page.locator('input[type=search], input[placeholder*="검색"], input[type=text]').first();
  if (await search.count()) {
    await search.fill('키즈와플', { timeout: 5000 }).catch(() => {});
    await search.press('Enter').catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await snap('03-search');
  }
} catch (e) {
  log.push('ERROR ' + e.message);
}
fs.writeFileSync(`${OUT}/network.json`, JSON.stringify(net, null, 1));
fs.writeFileSync(`${OUT}/log.txt`, log.join('\n'));
await browser.close();
