// Screens reviews and writes blog summaries. Free by default:
//   1. GEMINI_API_KEY (Google AI Studio free tier)  2. ANTHROPIC_API_KEY (paid)  3. plain rules (no AI, no key).
// If an AI call fails the rules take over, so the monthly run never stops. `mode` says which one judged.
export const mode = { name: 'rules' };
const GEMINI_MODEL = process.env.REVIEW_MODEL || 'gemini-2.5-flash';
const CLAUDE_MODEL = process.env.REVIEW_MODEL || 'claude-haiku-5-5';

function parse(text) {
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('no JSON in the answer: ' + text.slice(0, 200));
  return JSON.parse(m[0]);
}
async function askGemini(system, user) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } })
  });
  if (!res.ok) throw new Error(`Gemini API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  return parse(((j.candidates || [])[0]?.content?.parts || []).map((p) => p.text || '').join(''));
}
async function askClaude(system, user) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content: user }] })
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return parse(((await res.json()).content || []).map((b) => b.text || '').join(''));
}
async function ask(system, user) {
  if (process.env.GEMINI_API_KEY) { mode.name = 'gemini'; return askGemini(system, user); }
  if (process.env.ANTHROPIC_API_KEY) { mode.name = 'claude'; return askClaude(system, user); }
  throw new Error('no AI key');
}

// --- rules (no AI) ---
const NEGATIVE = /환불|불만|불편|실망|별로|최악|비추|다쳤|다치|울었|부족했|아쉬운 점|불친절|지연|위생이 안|더러/;
const PERSONAL = /\d{2,3}-\d{3,4}-\d{4}|[\w.+-]+@[\w-]+\.[\w.]+|010\d{7,8}|카톡\s*id|인스타\s*@?\w+|@\w{4,}/i;
const SPONSORED = /협찬|원고료|제공받|체험단|소정의|광고|서포터즈|#ad/;
const POSITIVE = /좋|만족|추천|재밌|재미|즐거|행복|감사|최고|웃|귀여|예쁘|알차|친절|따뜻|세심/;
const sentences = (t) => t.replace(/\s+/g, ' ').split(/(?<=[.!?。]|요|다)\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
function ruleClasskok(r) {
  const bad = NEGATIVE.test(r.title + ' ' + r.body) || PERSONAL.test(r.body);
  const pos = (r.body.match(new RegExp(POSITIVE.source, 'g')) || []).length;
  const include = !bad && pos >= 2 && (r.rating == null || r.rating >= 4.5);
  return { id: r.id, include, score: Math.min(10, pos + Math.round(r.body.length / 120)), title: r.title || '수강 후기', reason: include ? '규칙 판별: 긍정 표현 ' + pos + '개' : '규칙 판별: 제외' };
}
function ruleBlog(r) {
  const text = r.title + ' ' + r.body;
  const include = /키즈와플/.test(text) && !SPONSORED.test(text) && !NEGATIVE.test(text) && !PERSONAL.test(r.body) && !/키즈와플|kidswaffle/i.test(r.author) && POSITIVE.test(r.body);
  const picked = sentences(r.body).filter((x) => POSITIVE.test(x) && !/^#|http/.test(x)).slice(0, 2).join(' ').slice(0, 150);
  return { id: r.id, include: include && picked.length > 20, score: 4, title: r.title.slice(0, 24), summary: picked || r.snippet.slice(0, 120), reason: '규칙 판별(요약은 본문 일부 발췌)' };
}
async function withFallback(rows, aiCall, rule) {
  try { return new Map((await aiCall(rows)).map((o) => [o.id, o])); }
  catch (e) { if (e.message !== 'no AI key') console.error('AI judging failed, using rules:', e.message); mode.name = 'rules'; return new Map(rows.map((r) => [r.id, rule(r)])); }
}

const RULES = `You screen parent reviews for the website of 키즈와플 오감팡팡, a sensory-play class for babies (5~24 months) held at department-store culture centers.
Set "include": true ONLY if ALL of these hold:
- the text is clearly positive about the 키즈와플 오감팡팡 class, its teacher or its programme (not just a neutral note or a question)
- it contains no complaint, no negative comparison, no mention of a refund, injury or safety problem
- it holds no personal data (phone numbers, email, SNS ids, a child's full name, an address)
- it is not an advertisement, sponsored post or promotion of another business
Also give "score" 1-10 for how persuasive and specific the review is (concrete details beat generic praise).`;

async function aiClasskok(rows) {
  const input = rows.map((r) => ({ id: r.id, title: r.title, body: r.body.slice(0, 1200) }));
  const out = await ask(RULES + '\nAnswer with ONLY a JSON array: [{"id":"...","include":true|false,"score":1-10,"title":"if the review has no title, a short Korean title (max 20 chars) taken from its own words, else keep it","reason":"max 15 words"}]',
    JSON.stringify(input));
  return out;
}

async function aiBlogs(rows) {
  const input = rows.map((r) => ({ id: r.id, blogger: r.author, title: r.title, body: r.body.slice(0, 3000) }));
  const out = await ask(RULES + `
Extra rules for blog posts: set include false when the post is written by 키즈와플 itself, is sponsored (협찬, 원고료, 제공받아, 체험단), is mostly about something else, or the writer did not attend the class.
For included posts write "summary": 2-3 Korean sentences (about 90-140 characters) in polite 해요체/합니다체, covering only what the writer actually said (never invent facts, prices or claims), and "title": a short Korean headline (max 24 chars) in the same spirit.
Answer with ONLY a JSON array: [{"id":"...","include":true|false,"score":1-10,"title":"...","summary":"...","reason":"max 15 words"}]`,
    JSON.stringify(input));
  return out;
}

export const judgeClasskok = (rows) => withFallback(rows, aiClasskok, ruleClasskok);
export const judgeBlogs = (rows) => withFallback(rows, aiBlogs, ruleBlog);
