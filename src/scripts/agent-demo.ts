// Демо-диалог агента: реплики по очереди с индикатором «печатает…», один раз при входе в экран.
import { reducedMotion } from './typewriter';

const TYPING_MS = 900;

export function initAgentDemo(root: HTMLElement): void {
  if (reducedMotion()) return;
  const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line]'));
  const typing = root.querySelector<HTMLElement>('[data-typing]');
  // Кнопка лежит рядом с картинкой (role="img" не может содержать интерактивных элементов).
  const replay = root.parentElement?.querySelector<HTMLButtonElement>('[data-replay]');
  let timers: number[] = [];

  const reset = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers = [];
    lines.forEach((l) => l.classList.remove('is-shown'));
    if (typing) typing.hidden = true;
  };

  const play = () => {
    reset();
    lines.forEach((line, i) => {
      const at = i * (TYPING_MS + 300);
      if (typing && line.dataset.from === 'agent') {
        timers.push(window.setTimeout(() => (typing.hidden = false), Math.max(0, at - TYPING_MS)));
      }
      timers.push(
        window.setTimeout(() => {
          if (typing) typing.hidden = true;
          line.classList.add('is-shown');
        }, at),
      );
    });
  };

  root.classList.add('is-armed');
  replay?.addEventListener('click', play);

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        play();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(root);
}
