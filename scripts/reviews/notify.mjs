// Emails the approval request (the same text as the pull request). Needs SMTP_USER, SMTP_PASS and NOTIFY_TO;
// without them it does nothing (GitHub's own pull-request email still reaches the repository owner).
import fs from 'node:fs';
import nodemailer from 'nodemailer';

const { SMTP_USER, SMTP_PASS, NOTIFY_TO, PR_URL } = process.env;
if (!SMTP_USER || !SMTP_PASS || !NOTIFY_TO) { console.log('mail: SMTP not configured, skipped'); process.exit(0); }
const title = fs.readFileSync('pr-title.txt', 'utf8').trim();
const body = fs.readFileSync('pr-body.md', 'utf8');
const tx = nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } });
await tx.sendMail({
  from: `키즈와플 홈페이지 <${SMTP_USER}>`, to: NOTIFY_TO, subject: `[키즈와플] ${title}`,
  text: `승인 페이지: ${PR_URL}\n(링크를 열어 맨 아래 "Merge pull request"를 누르면 게시됩니다.)\n\n${body}`
});
console.log('mail: sent');
