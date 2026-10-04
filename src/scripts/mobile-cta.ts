// Закреплённая снизу кнопка на мобильных: видна, когда ни hero, ни #contact не на экране.
export function initMobileCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const hero = document.querySelector<HTMLElement>('#top');
  const contact = document.querySelector<HTMLElement>('#contact');
  if (!bar || !hero || !contact) return;

  const seen = new Map<Element, boolean>([
    [hero, true],
    [contact, false],
  ]);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    bar.hidden = Boolean(seen.get(hero) || seen.get(contact));
  });
  io.observe(hero);
  io.observe(contact);
}
