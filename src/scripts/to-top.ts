// Кнопка «наверх»: видна, когда первый экран ушёл из вида; плавно прокручивает наверх.
import { reducedMotion } from './typewriter';

export function initToTop(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-to-top]');
  const hero = document.querySelector<HTMLElement>('#top');
  if (!btn || !hero) return;

  new IntersectionObserver(([e]) => {
    btn.hidden = e.isIntersecting;
  }).observe(hero);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    // Фокус — на начало страницы, чтобы клавиатурная навигация продолжилась сверху.
    document.querySelector<HTMLElement>('.skip-link')?.focus({ preventScroll: true });
  });
}
