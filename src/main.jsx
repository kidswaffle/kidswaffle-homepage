import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App.jsx';

const root = document.getElementById('root');
// The production build ships pre-rendered HTML inside #root: hydrate it. (Dev server: render fresh.)
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
// Phones show nothing until the page is hydrated (see index.html), so the desktop-layout HTML
// that was pre-rendered is never visible there.
requestAnimationFrame(() => requestAnimationFrame(() => root.setAttribute('data-ready', '')));
