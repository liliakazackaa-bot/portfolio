// Печать заголовка по символам. Без JS и при reduced motion текст виден сразу.

export const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initTypewriter(el: HTMLElement, msPerChar = 35): void {
  if (reducedMotion()) return;
  const root = el.querySelector<HTMLElement>('[data-type-text]');
  if (!root) return;

  const chars: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const frag = document.createDocumentFragment();
    // Слова оборачиваем в .w (для эффекта веса), символы — в .ch.
    for (const part of (node.textContent ?? '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'w';
      for (const c of part) {
        const ch = document.createElement('span');
        ch.className = 'ch is-pending';
        ch.textContent = c;
        word.append(ch);
        chars.push(ch);
      }
      frag.append(word);
    }
    node.replaceWith(frag);
  }

  let i = 0;
  const tick = () => {
    chars[i]?.classList.remove('is-pending');
    i += 1;
    if (i < chars.length) window.setTimeout(tick, msPerChar);
  };
  window.setTimeout(tick, 200);
}
