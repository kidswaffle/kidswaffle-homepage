// Review photos: download, strip metadata (incl. GPS), shrink to web size and store under public/reviews/auto.
import fs from 'node:fs';
import sharp from 'sharp';

const DIR = 'public/reviews/auto';
const MAX_PHOTOS = 3;

export async function savePhotos(id, urls) {
  fs.mkdirSync(DIR, { recursive: true });
  const out = [];
  let n = 0;
  for (const u of (urls || []).slice(0, MAX_PHOTOS)) {
    try {
      const res = await fetch(u);
      if (!res.ok) { console.error('photo', res.status, u); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 25e6) continue;
      const name = `${id.replace(/[^a-z0-9-]/gi, '')}-${++n}.webp`;
      // rotate() applies the EXIF orientation; sharp drops all metadata on output
      await sharp(buf).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${DIR}/${name}`);
      out.push('/reviews/auto/' + name);
    } catch (e) { console.error('photo failed', u, e.message); }
  }
  return out;
}

export function removePhotos(paths) {
  for (const p of paths || []) fs.rmSync('public' + p, { force: true });
}
