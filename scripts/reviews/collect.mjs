// Monthly review refresh. Reads the current auto reviews, fetches new candidates, has Claude screen them,
// keeps the newest few per source (existing ones stay unless pushed out by newer ones) and writes
// src/data/reviews-auto.json plus pr-body.md (what to approve). Prints nothing to change when nothing is new.
import fs from 'node:fs';
import { chromium } from 'playwright';
import { fetchClasskok } from './classkok.mjs';
import { fetchBlogs } from './naver.mjs';
import { judgeClasskok, judgeBlogs } from './judge.mjs';
import { savePhotos, removePhotos } from './photos.mjs';

const DRY = process.argv.includes('--dry');
if (DRY) { // test runs keep their log in the repo so it can be read without GitHub's UI
  fs.mkdirSync('dryrun', { recursive: true });
  for (const k of ['log', 'error']) { const o = console[k]; console[k] = (...a) => { fs.appendFileSync('dryrun/log.txt', a.join(' ') + '\n'); o(...a); }; }
}
const FILE = 'src/data/reviews-auto.json';
const HOLD_DAYS = 3; // keep in step with .github/workflows/reviews-publish.yml
const CAPS = { blog: 5, suwon: 3, unjeong: 3 };
const GROUPS = { blog: (r) => r.source === 'blog', suwon: (r) => r.store === 'suwon', unjeong: (r) => r.store === 'unjeong' };

const current = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const have = new Set(current.items.map((r) => r.id));
const browser = await chromium.launch();
let classkok = [], blogs = [];
try { classkok = await fetchClasskok(browser); blogs = await fetchBlogs(browser); } finally { await browser.close(); }

if (DRY) {
  fs.mkdirSync('dryrun', { recursive: true });
  fs.writeFileSync('dryrun/classkok.json', JSON.stringify(classkok.slice(0, 40), null, 1));
  fs.writeFileSync('dryrun/blogs.json', JSON.stringify(blogs, null, 1));
  console.log(`dry run: ${classkok.length} classkok reviews, ${blogs.length} blog posts`);
}

// only judge what is new
const freshC = classkok.filter((r) => !have.has(r.id) && r.body.length >= 60);
const freshB = blogs.filter((r) => !have.has(r.id));
const verdict = new Map();
for (let i = 0; i < freshC.length; i += 15) for (const [k, v] of await judgeClasskok(freshC.slice(i, i + 15))) verdict.set(k, v);
for (let i = 0; i < freshB.length; i += 8) for (const [k, v] of await judgeBlogs(freshB.slice(i, i + 8))) verdict.set(k, v);

const toItem = (r) => {
  const v = verdict.get(r.id) || {};
  const base = { id: r.id, source: r.source, date: r.date, score: v.score || 0, reason: v.reason || '' };
  return r.source === 'blog'
    ? { ...base, title: v.title || r.title, body: v.summary || '', author: r.author, place: '네이버 블로그', url: r.url }
    : { ...base, title: (r.title || v.title || '수강 후기'), body: r.body, author: r.author, place: r.place, store: r.store };
};
const accepted = [...freshC, ...freshB].filter((r) => verdict.get(r.id) && verdict.get(r.id).include === true && (r.source !== 'blog' || verdict.get(r.id).summary)).map(toItem);

const next = [], added = [], removed = [];
for (const [g, test] of Object.entries(GROUPS)) {
  const old = current.items.filter(test);
  const fresh = accepted.filter((r) => (g === 'blog' ? r.source === 'blog' : r.store === g));
  const pool = [...fresh, ...old].sort((a, b) => b.date.localeCompare(a.date) || b.score - a.score);
  const keep = pool.slice(0, CAPS[g]);
  next.push(...keep);
  added.push(...keep.filter((r) => !have.has(r.id)));
  removed.push(...old.filter((r) => !keep.includes(r)));
}
// photos: new items get theirs; items published earlier without any get them once (backfill)
const urlsOf = new Map(classkok.map((r) => [r.id, r.photoUrls || []]));
const backfilled = [];
if (!DRY) {
  for (const r of next) {
    if (r.source !== 'classkok' || r.photos !== undefined) continue;
    r.photos = await savePhotos(r.id, urlsOf.get(r.id));
    if (have.has(r.id) && r.photos.length) backfilled.push(r);
  }
  for (const r of removed) removePhotos(r.photos);
}
console.log(`checked by rules: ${verdict.size} checked, ${[...verdict.values()].filter((v) => v.include).length} fit, new: ${added.length}, photos added to existing: ${backfilled.length}, dropped: ${removed.length}`);
if (added.length === 0 && backfilled.length === 0) { console.log('NOTHING_NEW'); process.exit(0); }
const how = 'AI 없이 규칙으로 1차 거름 — 아래 내용을 직접 확인해 주세요';

const month = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 7);
fs.writeFileSync(FILE, JSON.stringify({ updated: month, items: next }, null, 2) + '\n');

const photoMd = (r) => (r.photos && r.photos.length ? '\n' + r.photos.map((p) => `<img src="https://raw.githubusercontent.com/{{REPO}}/{{BRANCH}}/public${p}" width="220">`).join(' ') + '\n' : '');
const line = (r, i) => `### ${i + 1}. ${r.source === 'blog' ? '네이버 블로그' : r.place} · ${r.date}\n**${r.title}**${r.author ? ` — ${r.author}` : ''}\n\n${r.body.split('\n').map((l) => '> ' + l).join('\n')}\n${r.url ? `\n원문: ${r.url}\n` : ''}${photoMd(r)}\n_1차 확인: ${r.reason || '-'}_\n`;
const body = `## 홈페이지 후기 ${month} 업데이트 승인 요청\n\n새 후기 **${added.length}건**이 추가되고, 오래된 **${removed.length}건**이 빠집니다.${backfilled.length ? ` 이미 올라간 후기 ${backfilled.length}건에는 사진이 추가됩니다.` : ''} (${how})\n\n${[...added, ...backfilled].some((r) => r.photos && r.photos.length) ? '- **사진이 있어서 자동 게시되지 않습니다.** 얼굴을 이모티콘으로 가렸지만 자동 감지는 놓칠 수 있습니다. 아래 사진을 확인하고, 괜찮으면 `Merge pull request` 를 누르세요. 가려지지 않은 얼굴이 있으면 Claude에게 "N번 사진 얼굴 더 가려줘"라고 말해 주세요.' : `- **아무것도 안 하셔도 됩니다.** ${HOLD_DAYS}일 뒤에 자동으로 게시됩니다.`}\n- **게시하지 않으려면:** ${HOLD_DAYS}일 안에 \`Close pull request\` 를 누르세요. 그대로 유지됩니다.\n- **바로 게시하려면:** \`Merge pull request\` → \`Confirm merge\` 를 누르세요.\n- 일부만 올리고 싶으면 \`Files changed\` 탭에서 \`reviews-auto.json\`의 빼고 싶은 항목을 지우고(연필 아이콘) 저장하세요. Claude에게 \"N번 빼고 게시\"라고 말해도 됩니다.\n\n---\n\n${added.length ? `## 추가되는 후기\n\n${added.map(line).join('\n')}\n` : ''}${backfilled.length ? `## 사진이 추가되는 기존 후기\n\n${backfilled.map(line).join('\n')}\n` : ''}${removed.length ? `---\n\n## 빠지는 후기\n${removed.map((r) => `- ${r.date} ${r.place} · ${r.title}`).join('\n')}\n` : ''}`;
fs.writeFileSync('pr-body.md', body);
if (DRY) fs.writeFileSync('dryrun/preview.md', body);
const withPhotos = [...added, ...backfilled].some((r) => r.photos && r.photos.length);
fs.writeFileSync('pr-title.txt', `${withPhotos ? '[사진 확인 필요] ' : ''}후기 업데이트 ${month}: 새 후기 ${added.length}건${backfilled.length ? `, 사진 ${backfilled.length}건 추가` : ''} 승인 요청`);
