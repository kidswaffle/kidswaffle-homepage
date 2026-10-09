import React from 'react';
import { useIsMobile } from '../lib.js';

// Counters grow over time: +30 kids per month and +1 year per year from this base.
const STATS_BASE = { year: 2026, month: 10, kids: 23425, years: 15 };

function statsNow() {
  const d = new Date();
  const months = Math.max(0, (d.getFullYear() - STATS_BASE.year) * 12 + (d.getMonth() + 1 - STATS_BASE.month));
  return { kids: STATS_BASE.kids + months * 30, years: STATS_BASE.years + Math.max(0, d.getFullYear() - STATS_BASE.year) };
}

function useCountLoop(target, run, decimals = 0, ms = 2200, hold = 3200) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf, timer, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else timer = setTimeout(() => { t0 = 0; raf = requestAnimationFrame(tick); }, hold);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [run, target]);
  return decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US');
}

function StatItem({ label, value, unit, decimals, run, last, mobile }) {
  const text = useCountLoop(value, run, decimals);
  return (
    <div style={mobile
      ? { textAlign: 'center', padding: '20px 0', borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }
      : { textAlign: 'center', padding: '8px 24px', borderRight: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ font: 'var(--type-h4)', color: 'var(--text-body)' }}>{label}</div>
      <div style={{ marginTop: mobile ? 10 : 16, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(44px,5vw,68px)', lineHeight: 1, letterSpacing: '-.02em', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{text}</span>
        <span style={{ font: 'var(--type-h4)', color: 'var(--text-strong)' }}>{unit}</span>
      </div>
    </div>
  );
}

export function Stats() {
  const ref = React.useRef(null);
  const [run, setRun] = React.useState(false);
  const mobile = useIsMobile();
  const n = statsNow();
  const items = [
    { label: '누적 체험 유아', value: n.kids, unit: '명' },
    { label: '운영 기간', value: n.years, unit: '년' },
    { label: '학부모 만족도', value: 9.8, decimals: 1, unit: '점 / 10점' }
  ];
  React.useEffect(() => {
    const io = new IntersectionObserver((es) => setRun(es[0].isIntersecting), { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} style={{ marginTop: 'var(--section-y-sm)', background: 'var(--surface-band)', padding: mobile ? '16px 0' : '44px 0' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,minmax(0,1fr))', gap: mobile ? 0 : 28 }}>
        {items.map((s, i) => <StatItem key={s.label} {...s} run={run} mobile={mobile} last={i === items.length - 1} />)}
      </div>
    </section>
  );
}
