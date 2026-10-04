// Единая точка инициализации поведения страницы.
import { initHeader } from './header';
import { initMobileMenu } from './mobile-menu';
import { initTypewriter } from './typewriter';

initHeader();
initMobileMenu();
document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => initTypewriter(el));
