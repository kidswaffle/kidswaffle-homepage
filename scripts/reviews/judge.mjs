// Claude judges which reviews are fit to show and writes the blog summaries. Without ANTHROPIC_API_KEY
// nothing is judged (dry runs only).
const MODEL = process.env.REVIEW_MODEL || 'claude-haiku-5-5';

async function ask(system, user) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content: user }] })
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const text = ((await res.json()).content || []).map((b) => b.text || '').join('');
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('no JSON in the answer: ' + text.slice(0, 200));
  return JSON.parse(m[0]);
}

const RULES = `You screen parent reviews for the website of 키즈와플 오감팡팡, a sensory-play class for babies (5~24 months) held at department-store culture centers.
Set "include": true ONLY if ALL of these hold:
- the text is clearly positive about the 키즈와플 오감팡팡 class, its teacher or its programme (not just a neutral note or a question)
- it contains no complaint, no negative comparison, no mention of a refund, injury or safety problem
- it holds no personal data (phone numbers, email, SNS ids, a child's full name, an address)
- it is not an advertisement, sponsored post or promotion of another business
Also give "score" 1-10 for how persuasive and specific the review is (concrete details beat generic praise).`;

export async function judgeClasskok(rows) {
  const input = rows.map((r) => ({ id: r.id, title: r.title, body: r.body.slice(0, 1200) }));
  const out = await ask(RULES + '\nAnswer with ONLY a JSON array: [{"id":"...","include":true|false,"score":1-10,"title":"if the review has no title, a short Korean title (max 20 chars) taken from its own words, else keep it","reason":"max 15 words"}]',
    JSON.stringify(input));
  return new Map(out.map((o) => [o.id, o]));
}

export async function judgeBlogs(rows) {
  const input = rows.map((r) => ({ id: r.id, blogger: r.author, title: r.title, body: r.body.slice(0, 3000) }));
  const out = await ask(RULES + `
Extra rules for blog posts: set include false when the post is written by 키즈와플 itself, is sponsored (협찬, 원고료, 제공받아, 체험단), is mostly about something else, or the writer did not attend the class.
For included posts write "summary": 2-3 Korean sentences (about 90-140 characters) in polite 해요체/합니다체, covering only what the writer actually said (never invent facts, prices or claims), and "title": a short Korean headline (max 24 chars) in the same spirit.
Answer with ONLY a JSON array: [{"id":"...","include":true|false,"score":1-10,"title":"...","summary":"...","reason":"max 15 words"}]`,
    JSON.stringify(input));
  return new Map(out.map((o) => [o.id, o]));
}
