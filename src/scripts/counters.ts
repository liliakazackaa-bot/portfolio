// Счётчики: число «накручивается» от 0 до data-count-to при появлении на экране.
// В HTML сразу стоит итоговое значение — без JS и при reduced motion оно видно как есть.
import { reducedMotion } from './typewriter';

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function initCounters(): void {
  if (reducedMotion()) return;
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-count-value]'));
  if (!items.length) return;

  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.countTo ?? el.textContent ?? 0);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = String(Math.round(to * easeOut(t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          run(e.target as HTMLElement);
        }
      });
    },
    { threshold: 0.6 },
  );

  items.forEach((el) => {
    el.textContent = '0';
    io.observe(el);
  });
}
