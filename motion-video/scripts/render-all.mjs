// Renders every format to out/. Set REMOTION_BROWSER to a Chrome headless shell if Remotion
// should not download its own (this repo's cloud sandbox uses the preinstalled one).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const local = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = process.env.REMOTION_BROWSER || (existsSync(local) ? local : '');
const formats = ['HeroIntro-16x9', 'HeroIntro-9x16', 'HeroIntro-1x1'];
const only = process.argv[2];
for (const id of formats.filter((f) => !only || f === only)) {
  const args = ['remotion', 'render', 'src/index.jsx', id, `out/${id.toLowerCase()}.mp4`, '--codec=h264', '--crf=20'];
  if (browser) args.push(`--browser-executable=${browser}`);
  execFileSync('npx', args, { stdio: 'inherit' });
}
