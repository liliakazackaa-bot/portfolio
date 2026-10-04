// Единая точка инициализации поведения страницы.
import { initHeader } from './header';
import { initMobileMenu } from './mobile-menu';
import { initTypewriter } from './typewriter';
import { initAgentDemo } from './agent-demo';
import { initSpotlight } from './spotlight';

initHeader();
initMobileMenu();
document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => initTypewriter(el));
document.querySelectorAll<HTMLElement>('[data-agent-demo]').forEach((el) => initAgentDemo(el));
initSpotlight();
