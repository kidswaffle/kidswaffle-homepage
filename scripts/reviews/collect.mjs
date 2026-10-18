// Monthly review refresh. Reads the current auto reviews, fetches new candidates, has Claude screen them,
// keeps the newest few per source (existing ones stay unless pushed out by newer ones) and writes
// src/data/reviews-auto.json plus pr-body.md (what to approve). Prints nothing to change when nothing is new.
import fs from 'node:fs';
import { chromium } from 'playwright';
import { fetchClasskok } from './classkok.mjs';
import { fetchBlogs } from './naver.mjs';
import { judgeClasskok, judgeBlogs } from './judge.mjs';

const DRY = process.argv.includes('--dry');
if (DRY) { // test runs keep their log in the repo so it can be read without GitHub's UI
  fs.mkdirSync('dryrun', { recursive: true });
  for (const k of ['log', 'error']) { const o = console[k]; console[k] = (...a) => { fs.appendFileSync('dryrun/log.txt', a.join(' ') + '\n'); o(...a); }; }
}
const FILE = 'src/data/reviews-auto.json';
const CAPS = { blog: 5, suwon: 3, unjeong: 3 };
const GROUPS = { blog: (r) => r.source === 'blog', suwon: (r) => r.store === 'suwon', unjeong: (r) => r.store === 'unjeong' };
const hasAI = !!process.env.ANTHROPIC_API_KEY;

const current = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const have = new Set(current.items.map((r) => r.id));
const browser = await chromium.launch();
let classkok = [], blogs = [];
try { classkok = await fetchClasskok(browser); blogs = await fetchBlogs(browser); } finally { await browser.close(); }

if (DRY) {
  fs.mkdirSync('dryrun', { recursive: true });
  fs.writeFileSync('dryrun/classkok.json', JSON.stringify(classkok.slice(0, 40), null, 1));
  fs.writeFileSync('dryrun/blogs.json', JSON.stringify(blogs, null, 1));
  console.log(`dry run: ${classkok.length} classkok reviews, ${blogs.length} blog posts, AI ${hasAI ? 'on' : 'off'}`);
  if (!hasAI) process.exit(0);
}
if (!hasAI) { console.error('ANTHROPIC_API_KEY is missing'); process.exit(1); }

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
console.log(`new: ${added.length}, dropped: ${removed.length}, judged: ${verdict.size}`);
if (added.length === 0) { console.log('NOTHING_NEW'); process.exit(0); }

const month = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 7);
fs.writeFileSync(FILE, JSON.stringify({ updated: month, items: next }, null, 2) + '\n');

const line = (r, i) => `### ${i + 1}. ${r.source === 'blog' ? '네이버 블로그' : r.place} · ${r.date}\n**${r.title}**${r.author ? ` — ${r.author}` : ''}\n\n${r.body.split('\n').map((l) => '> ' + l).join('\n')}\n${r.url ? `\n원문: ${r.url}\n` : ''}\n_AI 판단: ${r.reason || '-'} (점수 ${r.score}/10)_\n`;
const body = `## 홈페이지 후기 ${month} 업데이트 승인 요청\n\n새 후기 **${added.length}건**이 추가되고, 오래된 **${removed.length}건**이 빠집니다.\n\n- **게시하려면:** 아래쪽 \`Merge pull request\` → \`Confirm merge\` 를 누르세요. 몇 분 뒤 홈페이지에 반영됩니다.\n- **게시하지 않으려면:** \`Close pull request\` 를 누르세요. 그대로 유지됩니다.\n- 일부만 올리고 싶으면 이 알림에 답장하거나 Claude에게 "N번 빼고 게시"라고 말해 주세요.\n\n---\n\n## 추가되는 후기\n\n${added.map(line).join('\n')}\n${removed.length ? `---\n\n## 빠지는 후기\n${removed.map((r) => `- ${r.date} ${r.place} · ${r.title}`).join('\n')}\n` : ''}`;
fs.writeFileSync('pr-body.md', body);
fs.writeFileSync('pr-title.txt', `후기 업데이트 ${month}: 새 후기 ${added.length}건 승인 요청`);
