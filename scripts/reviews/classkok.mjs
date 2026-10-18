// 클래스콕 (classkok.com): for each store, find the 키즈와플 classes, then read the newest reviews.
// Every class of the program shares one review pool, so the first listed class is enough.
const STORES = [
  { key: 'suwon', label: '수원', place: '클래스콕 수원점' },
  { key: 'unjeong', label: '운정', place: '클래스콕 파주운정점' }
];
const KEYWORD = '키즈와플';
const PAGES = 4; // newest ~40 reviews per store are judged

const clean = (s) => String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const fmtDate = (s) => { const d = String(s || '').replace(/\D/g, ''); return d.length >= 8 ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}` : ''; };

async function storeReviews(browser, store) {
  const ctx = await browser.newContext({ locale: 'ko-KR', viewport: { width: 430, height: 932 } });
  const page = await ctx.newPage();
  try {
    await page.goto('https://www.classkok.com', { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('a', { hasText: store.label }).first().click({ timeout: 10000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.goto('https://www.classkok.com/', { waitUntil: 'networkidle' });
    // the home page opens a promo popup that covers the search button
    await page.evaluate(() => { document.querySelectorAll('.main-popup-wrap').forEach((e) => e.remove()); document.querySelector('#popLctrSrch').click(); });
    const input = page.locator('input#search:visible, input[placeholder*="검색"]:visible').first();
    await input.fill(KEYWORD, { timeout: 10000 });
    await input.press('Enter');
    await page.waitForLoadState('networkidle').catch(() => {});
    const lctrNo = await page.$eval('#ulViewThumbnail a[onclick*=fn_moveLctrDetail]', (a) => a.getAttribute('onclick').match(/L\d+/)[0]);
    await page.evaluate((no) => fn_moveLctrDetail(no), lctrNo); // opens the class page (sets up the session)
    await page.waitForLoadState('networkidle').catch(() => {});
    const out = [];
    for (let p = 1; p <= PAGES; p++) {
      const res = await page.evaluate(async ({ no, p }) => {
        const r = await fetch('/mlt/selectLctrRvwList.do', {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
          body: new URLSearchParams({ currentPageNo: String(p), lctrNo: no, sortCd: '01', cstmrId: '' })
        });
        return r.json();
      }, { no: lctrNo, p });
      const list = (res && res.rvwList) || [];
      for (const r of list) {
        out.push({
          id: `classkok-${r.lctrNo}-${r.rvwSrnm}`, source: 'classkok', store: store.key, place: store.place,
          author: r.mshpNm || '', date: fmtDate(r.rgsttDt), title: clean(r.title), body: clean(r.cntnt), rating: Number(r.begAvg) || null
        });
      }
      if (list.length === 0) break;
    }
    return out;
  } finally { await ctx.close(); }
}

export async function fetchClasskok(browser) {
  const all = [];
  for (const store of STORES) {
    try {
      const rows = await storeReviews(browser, store);
      rows.sort((a, b) => b.date.localeCompare(a.date));
      console.log(`classkok ${store.key}: ${rows.length} reviews, newest ${rows[0] && rows[0].date}`);
      all.push(...rows);
    } catch (e) { console.error(`classkok ${store.key} failed: ${e.message}`); }
  }
  return all;
}
