// Единая точка инициализации поведения страницы.
import { initHeader } from './header';
import { initMobileMenu } from './mobile-menu';
import { initTypewriter } from './typewriter';
import { initAgentDemo } from './agent-demo';
import { initSpotlight } from './spotlight';
import { initForm } from './form';
import { initMobileCta } from './mobile-cta';
import { initReveal } from './reveal';
import { initToTop } from './to-top';
import { initCounters } from './counters';

initHeader();
initMobileMenu();
document.querySelectorAll<HTMLElement>('[data-typewriter]').forEach((el) => initTypewriter(el));
document.querySelectorAll<HTMLElement>('[data-agent-demo]').forEach((el) => initAgentDemo(el));
initSpotlight();
document.querySelectorAll<HTMLFormElement>('[data-form]').forEach((f) => initForm(f));
initMobileCta();
initReveal();
initToTop();
initCounters();
