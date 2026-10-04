// Собирает dist-single/index.html — один автономный файл для отправки в мессенджер.
// Всё встраивается внутрь: CSS, JS, шрифты, фото, favicon и страница политики (как раздел #privacy).
// Запуск после `astro build`: node scripts/build-single.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const OUT_DIR = 'dist-single';
const MIME = {
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const file = (url) => join(DIST, decodeURIComponent(url.split('?')[0]));
const dataUri = (url) => {
  const p = file(url);
  if (!existsSync(p)) throw new Error(`Нет файла для встраивания: ${url}`);
  return `data:${MIME[extname(p)] ?? 'application/octet-stream'};base64,${readFileSync(p).toString('base64')}`;
};

// url(/_astro/...) внутри CSS → data:
const inlineCssUrls = (css) => css.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_, q, u) => `url(${dataUri(u)})`);

function inlineAssets(html) {
  // Стили
  html = html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g, (_, href) => `<style>${inlineCssUrls(readFileSync(file(href), 'utf8'))}</style>`);
  html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => `<style>${inlineCssUrls(css)}</style>`);
  // Скрипты-модули
  html = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (_, src) => {
    const js = readFileSync(file(src), 'utf8');
    if (/\bimport\s*[("'{*]/.test(js)) throw new Error(`Скрипт ${src} импортирует другие файлы — встроить нельзя`);
    return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`;
  });
  // Предзагрузка больше не нужна — шрифты уже внутри.
  html = html.replace(/<link rel="preload"[^>]*>/g, '');
  // Favicon
  html = html.replace(/<link rel="icon" type="image\/svg\+xml" href="([^"]+)"[^>]*>/, (m, href) => m.replace(href, dataUri(href)));
  // Картинки: берём самый крупный вариант из srcset и встраиваем один файл.
  html = html.replace(/<img\b[^>]*>/g, (tag) => {
    let src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1];
    if (srcset) {
      const best = srcset
        .split(',')
        .map((s) => s.trim().split(/\s+/))
        .sort((a, b) => parseInt(b[1] ?? '0') - parseInt(a[1] ?? '0'))[0];
      if (best) src = best[0];
    }
    if (!src || src.startsWith('data:')) return tag;
    return tag
      .replace(/\ssrcset="[^"]*"/, '')
      .replace(/\ssizes="[^"]*"/, '')
      .replace(/\ssrc="[^"]*"/, ` src="${dataUri(src)}"`);
  });
  return html;
}

// Страница политики → скрытый раздел #privacy (открывается по ссылке через :target).
function privacySection() {
  const raw = readFileSync(join(DIST, 'privacy', 'index.html'), 'utf8');
  const styles = [...raw.matchAll(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g)].map((m) => m[1]);
  const head = raw.match(/<head>([\s\S]*?)<\/head>/)[1];
  const index = readFileSync(join(DIST, 'index.html'), 'utf8');
  // Свои <style> страницы политики (стили с data-astro-cid), которых нет на главной.
  const inlineStyles = [...head.matchAll(/<style>[\s\S]*?<\/style>/g)].map((m) => m[0]).filter((st) => !index.includes(st));
  const main = raw.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  const body = main.replace(/<h1/g, '<h2 class="privacy-title"').replace(/<\/h1>/g, '</h2>').replace(/href="\/"/g, 'href="#top"');
  return { styles, inlineStyles, html: `<section id="privacy" class="privacy-inline" aria-label="Политика обработки персональных данных">${body}</section>` };
}

let html = readFileSync(join(DIST, 'index.html'), 'utf8');
const privacy = privacySection();
const extraStyles = privacy.styles
  .filter((href) => !html.includes(`href="${href}"`))
  .map((href) => `<link rel="stylesheet" href="${href}">`)
  .join('') + privacy.inlineStyles.join('');

html = html
  .replace('</head>', `${extraStyles}<style>.privacy-inline{display:none;border-top:1px solid var(--line);margin-top:var(--section-gap)}.privacy-inline:target{display:block}.privacy-title{font-size:var(--fs-h2);line-height:1.1}</style></head>`)
  .replace('</main>', `${privacy.html}</main>`)
  .replace(/href="\/privacy"( target="_blank")?/g, 'href="#privacy"')
  .replace(/href="\/"/g, 'href="#top"');

// Файл для мессенджера: форма только показывает анимацию успеха, ничего не отправляет.
if (!html.includes('data-demo="false"')) throw new Error('Не найдена форма с data-demo');
html = html.replace('data-demo="false"', 'data-demo="true"');

html = inlineAssets(html);

const leftovers = html.match(/(?:src|href)="\/(?!\/)[^"]*"/g) ?? [];
if (leftovers.length) throw new Error(`Остались внешние ссылки: ${leftovers.join(', ')}`);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'index.html'), html);
console.log(`dist-single/index.html — ${(Buffer.byteLength(html) / 1024).toFixed(0)} КБ`);
