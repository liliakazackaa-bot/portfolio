# Лендинг-портфолио «Кислотный терминал»

Одностраничный сайт на Astro: сайты, приложения и ИИ-агенты для экспертов и бизнеса.
ТЗ — `docs/superpowers/specs/2026-10-04-portfolio-landing-design.md`, исследование — `docs/research.md`.

## Что заменить перед публикацией

Все тексты и личные данные лежат в **`src/content/site.ts`**. Строки с пометкой `// ЗАГЛУШКА` — то, что нужно заменить:

| Что | Где |
|---|---|
| Месяц, с которого вы свободны | `availableFrom` |
| Почта, Telegram, GitHub | `email`, `telegram`, `telegramUrl`, `github` |
| Сколько лет в разработке | `yearsOfExperience` |
| Цены «от» | `price` в каждой из трёх услуг |
| Ключ формы | `web3formsKey` (см. ниже) |
| Адрес сайта | `siteUrl`, а также `site` в `astro.config.mjs` и строка `Sitemap` в `public/robots.txt` |

Фото — `src/assets/photo.png` (замените файлом с тем же именем). Демо-проектам можно добавить `demoUrl` — метка «демо скоро» сама превратится в ссылку.

## Форма заявки (Web3Forms)

1. Откройте https://web3forms.com, укажите почту, на которую должны приходить заявки.
2. Скопируйте Access Key из письма и вставьте в `web3formsKey`.

Пока стоит заглушка `YOUR_ACCESS_KEY`, форма работает в демо-режиме: показывает анимацию успеха, но ничего не отправляет.

## Команды

```bash
npm install          # установка
npm run dev          # разработка: http://localhost:4321
npm run build        # сборка сайта в dist/
npm run preview      # просмотр собранной версии
npm run single       # один файл index.html со всем внутри — для отправки в мессенджер
npm test             # юнит- и браузерные тесты
node scripts/make-og.mjs   # пересобрать картинку для соцсетей (при запущенном preview)
```

## Публикация

Папка `dist/` после `npm run build` — готовый статический сайт:

- **Netlify:** перетащите `dist/` на app.netlify.com/drop.
- **Vercel:** `npx vercel --prod` в папке проекта (фреймворк Astro определится сам).
- **GitHub Pages:** загрузите содержимое `dist/` в ветку `gh-pages`.

Файл из `npm run single` (`dist-single/index.html`) — для показа: открывается двойным кликом или из мессенджера, без интернета.
