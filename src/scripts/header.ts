// Шапка получает фон после 40px прокрутки.
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');
  if (!header || !sentinel) return;
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}
