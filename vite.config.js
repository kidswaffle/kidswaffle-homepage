import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { FAQ } from './src/data/faq.js';
import { buildJsonLd } from './seo/jsonld.js';

// Fills the <!--JSONLD--> placeholder in index.html with structured data built from site data.
const jsonLd = () => ({
  name: 'kidswaffle-jsonld',
  transformIndexHtml: (html) => html.replace('<!--JSONLD-->', JSON.stringify(buildJsonLd(FAQ))),
});

export default defineConfig({
  plugins: [react(), jsonLd()],
  build: { assetsInlineLimit: 0 }
});
