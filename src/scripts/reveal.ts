// Запасной вариант появления блоков для браузеров без animation-timeline: view() (Firefox).
export function initReveal(): void {
  if (CSS.supports('animation-timeline: view()')) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}
