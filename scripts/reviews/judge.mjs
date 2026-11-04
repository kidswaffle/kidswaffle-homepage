// Plain-rule pre-screen (no AI). It only removes the obvious: complaints, personal data, sponsored posts and
// weak text. The owner reads every candidate in the approval request before anything is published.
export const mode = { name: 'rules' };

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

export const judgeClasskok = async (rows) => new Map(rows.map((r) => [r.id, ruleClasskok(r)]));
export const judgeBlogs = async (rows) => new Map(rows.map((r) => [r.id, ruleBlog(r)]));
