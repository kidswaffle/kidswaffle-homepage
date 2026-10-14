// Build step: renders <App /> to HTML and writes it into dist/index.html so crawlers that do not
// run JavaScript (Naver, AI crawlers) get the full page. The browser then hydrates it.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'dist', 'index.html');
const { render } = await import(pathToFileURL(path.join(root, '.ssr', 'entry-server.js')).href);

const html = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('prerender: ' + marker + ' not found in dist/index.html');
const body = render();
if (body.length < 5000) throw new Error('prerender: rendered HTML is suspiciously short (' + body.length + ' chars)');
await writeFile(htmlPath, html.replace(marker, '<div id="root">' + body + '</div>'));
console.log('prerender: wrote ' + body.length + ' chars of HTML into dist/index.html');
