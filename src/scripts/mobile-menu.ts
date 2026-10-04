// Полноэкранное мобильное меню: фокус-ловушка, Esc, закрытие по ссылке, возврат фокуса.
export function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const closeBtn = menu.querySelector<HTMLButtonElement>('[data-menu-close]');

  const focusables = () =>
    Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

  const open = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    focusables()[0]?.focus();
  };

  const close = (restoreFocus = true) => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', () => close());
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => close(false)));

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
