import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';

// Used only at build time (scripts/prerender.mjs) to put the page's HTML into index.html.
export const render = () => renderToString(<App />);
