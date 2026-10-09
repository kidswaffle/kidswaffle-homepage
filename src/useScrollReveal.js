import React from 'react';

// Fades each section's blocks up 32px as they scroll into view. Rows of 3+ grid/flex
// children stagger item by item; everything else staggers block by block (0.09s steps).
// The classes are removed after the transition so component hover transforms keep working.
export function useScrollReveal(rootRef, layoutKey) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const units = (box, depth) => [...box.children]
      .filter((ch) => !/^(STYLE|SCRIPT)$/.test(ch.tagName))
      .map((ch) => {
        const cs = getComputedStyle(ch);
        const row = ch.children.length >= 3 && (cs.display === 'grid' || (cs.display === 'flex' && cs.flexDirection === 'row'));
        return row && depth < 2 && !ch.matches('.kw-season-rail') ? { group: true, els: [...ch.children] } : { els: [ch] };
      });

    const timers = [];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      el.classList.add('kw-in');
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      timers.push(setTimeout(() => el.classList.remove('kw-r', 'kw-in'), 1500 + delay * 1000));
    }), { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    // The hero (<header>) stays visible from the first paint.
    [...root.children].filter((el) => /^(SECTION|FOOTER|DIV)$/.test(el.tagName)).forEach((sec) => {
      const box = sec.firstElementChild;
      if (!box) return;
      units(box, 0).forEach((u, k) => u.els.forEach((el, i) => {
        el.classList.add('kw-r');
        el.style.setProperty('--d', ((u.group ? i : k) * 0.09).toFixed(2) + 's');
        io.observe(el);
      }));
    });
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [rootRef, layoutKey]);
}
