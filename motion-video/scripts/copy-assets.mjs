// Copies the site's own images and fonts into public/ so the video always uses the same files.
import { cp, mkdir } from 'node:fs/promises';

const site = new URL('../../', import.meta.url);
const pub = new URL('../public/', import.meta.url);
const files = {
  'logo.png': 'src/assets/logo.png',
  'waple.webp': 'src/assets/characters/waple-drop-in.webp',
  'mongle.webp': 'src/assets/hero/mongle.webp',
  'dugeuni.webp': 'src/assets/hero/dugeuni.webp',
  'ttoto.webp': 'src/assets/hero/ttoto.webp',
  'theme-persimmon.webp': 'src/assets/seasons/persimmon.webp',
  'theme-taiyaki.webp': 'src/assets/seasons/taiyaki.webp',
  'theme-christmas.webp': 'src/assets/seasons/christmas.webp',
  'fonts/NanumSquareRoundEB.woff2': 'src/assets/fonts/NanumSquareRoundEB.woff2',
  'fonts/NanumSquareRoundB.woff2': 'src/assets/fonts/NanumSquareRoundB.woff2'
};
await mkdir(new URL('fonts/', pub), { recursive: true });
for (const [to, from] of Object.entries(files)) await cp(new URL(from, site), new URL(to, pub));
console.log('assets: copied ' + Object.keys(files).length + ' files into motion-video/public');
