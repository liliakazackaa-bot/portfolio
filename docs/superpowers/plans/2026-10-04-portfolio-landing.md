# Portfolio Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать одностраничный лендинг-портфолио «Кислотный терминал» на Astro по утверждённому ТЗ, с формой заявки на Web3Forms, анимациями и тестами.

**Architecture:** Статический сайт Astro без клиентского фреймворка. Весь контент и заглушки — в `src/content/site.ts`; секции — Astro-компоненты, получающие данные через props; поведение — маленькие независимые TS-модули в `src/scripts/`, каждый инициализируется по своему `data-*`-атрибуту. Логика валидации формы — чистые функции с юнит-тестами.

**Tech Stack:** Astro 5 (последняя стабильная), TypeScript, ванильный CSS, `@fontsource-variable/onest`, `@fontsource-variable/jetbrains-mono`, `@astrojs/sitemap`, Playwright, `@axe-core/playwright`, `tsx` + `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-04-portfolio-landing-design.md` — тексты, цвета, размеры и поведение брать оттуда дословно.

## Global Constraints

- Язык страницы `ru`, все тексты — дословно из раздела 4 ТЗ; заглушки — только значения из раздела 2 ТЗ, только в `src/content/site.ts`, каждая с комментарием `// ЗАГЛУШКА`.
- Только тёмная тема, `color-scheme: dark`; цвета — только токены из 5.2 ТЗ.
- Шрифты: Onest (заголовки 700/800, текст 400/500) и JetBrains Mono (служебное), self-hosted, `latin` + `cyrillic`, `font-display: swap`.
- Без GSAP, Lenis, React/Vue на клиенте; JS на странице ≤ 15 КБ gzip.
- Все анимации — внутри `@media (prefers-reduced-motion: no-preference)`; анимируются только `transform`, `opacity`, `@property`.
- Ни одной выдуманной цифры, отзыва, клиента; демо-проекты помечены `демо`.
- Нет внешних запросов при загрузке страницы.
- Ширины проверки: 360, 768, 1440 px; брейкпоинты 600 / 900 / 1200 px.
- Lighthouse мобильный ≥ 95 по всем четырём категориям; axe — 0 нарушений serious/critical.

## Review Focus

1. Контакт с пробелами по краям, заглавными буквами или в виде `https://t.me/User_name` — должен приниматься (обрезка пробелов, ссылка t.me валидна). → тест в Task 2.
2. Двойной клик по кнопке отправки — уходит ровно один запрос. → тест в Task 7.
3. Web3Forms отвечает HTTP 200 с `success: false` (например, ключ-заглушка `YOUR_ACCESS_KEY`) — показывается ошибка, а не «заявка принята». → тест в Task 7.
4. Пользователь выбрал «ИИ-агент», заполнил поле «Где будет работать», затем сменил на «Сайт» — поле скрывается и его значение не уходит в заявку. → тест в Task 7.
5. Шрифт браузера увеличен до 200% (или ширина 320 px) — H1 и карточки не дают горизонтального скролла. → тест в Task 9.

---

## File Structure

```
astro.config.mjs  package.json  tsconfig.json  playwright.config.ts  README.md
src/content/site.ts            — типы и все данные страницы
src/styles/tokens.css          — CSS-переменные
src/styles/global.css          — база, .container, .btn, .tag, .card, .reveal, .section-label
src/layouts/Base.astro         — head, мета, OG, JSON-LD, шрифты, skip-link, Footer
src/components/*.astro         — по компоненту на секцию (список в ТЗ 7.2)
src/scripts/*.ts               — по модулю на поведение (список в ТЗ 7.2)
src/pages/index.astro  privacy.astro  404.astro
public/favicon.svg  og.png  robots.txt
tests/unit/form-validate.test.ts
tests/e2e/*.spec.ts
```

---

### Task 1: Каркас проекта, токены, базовый layout, данные

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`, `src/content/site.ts`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/SectionLabel.astro`, `src/pages/index.astro`, `public/favicon.svg`
- Test: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces:
  - `site.ts` экспортирует `site: Site` и типы:
    `type ServiceId = 'site' | 'app' | 'agent' | 'unknown'`;
    `interface Service { id: Exclude<ServiceId,'unknown'>; num: string; label: string; pain: string; title: string; text: string; price: string; term: string; cta: string; color: 'cyan'|'magenta'|'lime' }`;
    `interface Project { title: string; service: Exclude<ServiceId,'unknown'>; task: string; solution: string; outcome: string; stack: string[]; demoUrl?: string }`;
    `interface Step { num: string; tag: string; title: string; text: string }`;
    `interface Faq { q: string; a: string }`;
    `interface ChatLine { from: 'client'|'agent'|'system'; text: string }`;
    `Site` содержит `name, logo, availableFrom, email, telegram, telegramUrl, github, yearsOfExperience, web3formsKey, siteUrl, services: Service[], agentDemo: ChatLine[], projects: Project[], steps: Step[], guarantees: string[], about: string[], stack: string[], faq: Faq[]`.
  - `Base.astro` props: `{ title: string; description: string }`; рендерит `<slot />` внутри `<main id="main">`.
  - `SectionLabel.astro` props: `{ num: string; text: string }` → `<p class="section-label">// {num} — {text}</p>`.
  - CSS-классы: `.container`, `.section`, `.btn`, `.btn--primary`, `.btn--secondary`, `.tag`, `.card`, `.mark` (лаймовая плашка), `.cursor` (мигающий `▊`), `.mono`, `.dim`, `.reveal`.

- [ ] **Step 1:** Инициализировать Astro (`npm create astro@latest . -- --template minimal --typescript strict --no-git --install`), добавить зависимости `@fontsource-variable/onest @fontsource-variable/jetbrains-mono @astrojs/sitemap` и dev-зависимости `@playwright/test @axe-core/playwright tsx`; `npx playwright install chromium`. Скрипты: `test:unit` = `node --import tsx --test tests/unit/*.test.ts`, `test:e2e` = `playwright test`, `test` = оба, `check` = `astro check`.
- [ ] **Step 2:** `playwright.config.ts`: `webServer` — `npm run build && npm run preview -- --port 4321`, `baseURL` `http://localhost:4321`, проекты `desktop` (1440×900) и `mobile` (360×740, `hasTouch`).
- [ ] **Step 3: Failing test** `tests/e2e/smoke.spec.ts`:
```ts
test('base document', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle('Имя Фамилия — сайты, приложения и ИИ-агенты для экспертов и бизнеса');
  await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(6, 10, 8)');
});
```
- [ ] **Step 4:** Run `npx playwright test smoke` → FAIL.
- [ ] **Step 5:** Реализовать `site.ts` со всеми данными из ТЗ (разделы 2 и 4, дословно), `tokens.css` (5.2–5.4), `global.css`, `Base.astro` (мета description из 6.4, `color-scheme`, импорт шрифтов, skip-link), `favicon.svg` (`▊` `#A8F145` на `#060A08`), `index.astro` с пустым `Base`.
- [ ] **Step 6:** Run `npx playwright test smoke` and `npm run check` → PASS, 0 errors.
- [ ] **Step 7:** Commit `feat: scaffold astro project, tokens, base layout, content`.

---

### Task 2: Валидация формы (чистые функции)

**Files:**
- Create: `src/scripts/form-validate.ts`
- Test: `tests/unit/form-validate.test.ts`

**Interfaces:**
- Produces:
  - `type FieldError = string | null`
  - `validateName(v: string): FieldError` — после `trim()` 2–60 символов; иначе `'Укажите имя (от 2 символов)'`.
  - `validateContact(v: string): FieldError` — после `trim()`: email `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, или `@` + `[A-Za-z0-9_]{5,32}`, или `(https?://)?t.me/[A-Za-z0-9_]{5,32}`; иначе `'Укажите email или Telegram (@username)'`.
  - `validateService(v: string | null): FieldError` — один из `site|app|agent|unknown`; иначе `'Выберите, что нужно'`.
  - `validateTask(v: string): FieldError` — ≤ 1000 символов; иначе `'Не больше 1000 символов'`.
  - `validateConsent(v: boolean): FieldError` — `true`; иначе `'Нужно согласие на обработку данных'`.
  - `interface FormValues { name: string; contact: string; service: string | null; agentPlace: string | null; task: string; budget: string | null; consent: boolean }`
  - `validateForm(v: FormValues): Record<'name'|'contact'|'service'|'task'|'consent', FieldError>`
  - `buildPayload(v: FormValues, accessKey: string): Record<string, string>` — обрезает пробелы; `agentPlace` включается только при `service === 'agent'`; `subject` = `Заявка с сайта: ` + русская метка услуги (`Сайт`/`Приложение`/`ИИ-агент`/`Не знаю`); `access_key`, `from_name` = `Сайт-портфолио`.

- [ ] **Step 1: Failing tests** (`node:test` + `assert`), минимум:
  - `validateName('  Ан ')` → `null`; `validateName('А')` → ошибка.
  - `validateContact('  Me@Mail.RU ')`, `'@user_name'`, `'https://t.me/User_name'`, `'t.me/username'` → `null`; `'@abc'`, `'mail@'`, `''` → ошибка. *(Review Focus 1)*
  - `validateService(null)` → ошибка; `'agent'` → `null`.
  - `validateTask('x'.repeat(1001))` → ошибка.
  - `buildPayload({...service:'site', agentPlace:'crm'}, 'K')` не содержит `agentPlace`; с `service:'agent'` — содержит; `subject === 'Заявка с сайта: Сайт'`. *(Review Focus 4)*
- [ ] **Step 2:** Run `npm run test:unit` → FAIL.
- [ ] **Step 3:** Реализовать функции по сигнатурам выше.
- [ ] **Step 4:** Run `npm run test:unit` → PASS.
- [ ] **Step 5:** Commit `feat: form validation and payload builder`.

---

### Task 3: Шапка, мобильное меню, Hero

**Files:**
- Create: `src/components/Header.astro`, `src/components/Hero.astro`, `src/scripts/header.ts`, `src/scripts/mobile-menu.ts`, `src/scripts/typewriter.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/header-hero.spec.ts`

**Interfaces:**
- Consumes: `site`, `Base`.
- Produces: все CTA на странице — `<a href="#contact" class="btn ..." data-service="site|app|agent|unknown">` (атрибут опционален); Task 7 читает `data-service`.
  - `header.ts`: `initHeader(): void` — `[data-header]` получает класс `is-scrolled` после 40px (сторож-элемент + IntersectionObserver).
  - `mobile-menu.ts`: `initMobileMenu(): void` — кнопка `[data-menu-toggle]` с `aria-expanded`, панель `[data-menu]`, фокус-ловушка, Esc, закрытие по клику на ссылку, возврат фокуса.
  - `typewriter.ts`: `initTypewriter(el: HTMLElement, msPerChar = 35): void` — H1 с `aria-label` полного текста; дочерние символы в `span[aria-hidden]`; при reduced motion или без JS текст виден целиком.

- [ ] **Step 1: Failing tests:**
  - desktop: 5 ссылок меню с href `#services #work #process #about #faq`; ровно один `h1`; `h1` имеет `aria-label="Собираю сайты, приложения и ИИ-агентов"`; `.mark` внутри h1 содержит `ИИ-агентов`; статус содержит `available: ноябрь 2026`.
  - desktop: после `page.mouse.wheel(0, 200)` у `[data-header]` класс `is-scrolled`.
  - mobile: клик `[data-menu-toggle]` → `aria-expanded="true"`, панель видима; `Escape` → закрыта, фокус на кнопке.
  - reduced motion (`test.use({ reducedMotion: 'reduce' })`): сразу после загрузки `innerText` h1 содержит весь текст.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать компоненты и модули; разметка, тексты и стили — ТЗ 4.0, 4.1, 5.5; hover-вес H1 (`@property --wght`, 800→900) только под `(hover: hover) and (min-width: 900px)`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: header, mobile menu and hero`.

---

### Task 4: Услуги, бенто-сетка, демо-диалог агента

**Files:**
- Create: `src/components/Services.astro`, `src/components/ServiceCard.astro`, `src/components/AgentDemo.astro`, `src/scripts/agent-demo.ts`, `src/scripts/spotlight.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/services.spec.ts`

**Interfaces:**
- Consumes: `site.services`, `site.agentDemo`, `SectionLabel`.
- Produces:
  - `ServiceCard.astro` props: `{ service: Service; large?: boolean }`; цвет направления через `data-color`.
  - `agent-demo.ts`: `initAgentDemo(root: HTMLElement): void` — строки `[data-line]` получают `is-shown` по очереди (индикатор «печатает…» 900 мс между ними), старт при входе в экран, один раз; кнопка `[data-replay]` перезапускает; при reduced motion все строки показаны сразу.
  - `spotlight.ts`: `initSpotlight(selector = '.card'): void` — `pointermove` пишет `--x`/`--y` в стиль карточки.

- [ ] **Step 1: Failing tests:**
  - 3 карточки; кнопки CTA с `data-service` `site`, `app`, `agent` и текстами `[ нужен сайт ]`, `[ обсудить приложение ]`, `[ хочу ИИ-агента ]`; ссылка «написать →» с `data-service="unknown"`.
  - Цены выводятся как `от XX 000 ₽` во всех трёх карточках.
  - desktop: карточка агентов выше (`boundingBox().height`) любой из двух других; mobile: карточка агентов первая в DOM-порядке отображения (её `y` меньше остальных).
  - Демо: после скролла к карточке через ≤ 8 с видна системная строка `✓ запись создана · заявка передана специалисту`; клик `[data-replay]` скрывает строки и запускает заново.
  - Окно демо имеет `role="img"` и `aria-label` из ТЗ 6.5.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 4.2, 5.5, 6.3 (A4, A5); бенто — CSS grid + container queries.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: services bento and agent demo`.

---

### Task 5: Проекты и процесс

**Files:**
- Create: `src/components/Work.astro`, `src/components/ProjectCard.astro`, `src/components/Process.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/work-process.spec.ts`

**Interfaces:**
- Consumes: `site.projects`, `site.steps`, `site.guarantees`, `SectionLabel`.
- Produces: `ProjectCard.astro` props `{ project: Project }`; без `demoUrl` — `<span class="tag">демо скоро</span>`, с `demoUrl` — `<a href={demoUrl} target="_blank" rel="noopener">открыть демо ↗</a>`. Обложка — CSS-макет экрана, без внешних изображений.

- [ ] **Step 1: Failing tests:**
  - 3 карточки проектов, у каждой бейдж `демо` и текст `демо скоро`; пояснение `// демо-проекты` видно.
  - Заголовки проектов — дословно из ТЗ 4.3.
  - 5 шагов с метками `бриф оценка договор разработка запуск`; 3 гарантии; CTA `[ начать с бесплатной оценки ]` ведёт на `#contact`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 4.3, 4.4. Правило `demoUrl` проверяется вручную временной подстановкой в `site.ts` (не коммитить).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: demo projects and process sections`.

---

### Task 6: Обо мне, FAQ, подвал

**Files:**
- Create: `src/components/About.astro`, `src/components/Faq.astro`, `src/components/Footer.astro`, `src/assets/photo-placeholder.svg`
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro`
- Test: `tests/e2e/about-faq.spec.ts`

**Interfaces:**
- Consumes: `site.about`, `site.stack`, `site.faq`, контакты из `site`.
- Produces: `Footer` подключается в `Base.astro` (нужен на `/privacy` и `/404`).

- [ ] **Step 1: Failing tests:**
  - «Обо мне»: фото с непустым `alt`, 10 тегов стека, ссылки `github ↗`, `telegram ↗`, `email ↗` (`mailto:`).
  - FAQ: 7 `<details>`, все закрыты; клик по первому `summary` открывает его; `Tab` до второго `summary` + `Enter` открывает второй; ссылка «спросите в telegram ↗» ведёт на `site.telegramUrl`.
  - Подвал: ссылка `политика конфиденциальности` на `/privacy`; строка `$ exit — спасибо, что дочитали_`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 4.5, 4.6, подвал; раскрытие FAQ (A6) — `interpolate-size` + `::details-content` под `@supports`. Заглушка фото — монохромный SVG-силуэт 800×1000 через `astro:assets`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: about, faq and footer`.

---

### Task 7: Контакт, форма, мобильная CTA

**Files:**
- Create: `src/components/Contact.astro`, `src/components/ContactForm.astro`, `src/components/MobileCta.astro`, `src/scripts/form.ts`, `src/scripts/mobile-cta.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/form.spec.ts`, `tests/e2e/mobile-cta.spec.ts`

**Interfaces:**
- Consumes: `validateForm`, `buildPayload`, `FormValues` (Task 2); `data-service` на CTA (Tasks 3–5); `site.web3formsKey`.
- Produces:
  - `form.ts`: `initForm(form: HTMLFormElement, endpoint = 'https://api.web3forms.com/submit'): void`.
    Поведение: клик по `a[data-service]` выбирает чип `input[name=service][value=…]`; при `service=agent` показывается группа `[data-agent-place]`, иначе скрывается и её радио сбрасываются; валидация на `blur` и `submit`; ошибки в `#<field>-error`, `aria-invalid`, `aria-describedby`; фокус на первое поле с ошибкой; при отправке кнопка `disabled` с текстом `[ отправляю… ]`, повторные отправки игнорируются; успех только при `response.ok && json.success === true` → форма заменяется блоком `[data-form-success]`, фокус на нём; иначе `[data-form-error]` с текстом из ТЗ 6.1, данные сохраняются.
  - Без JS: `<form method="POST" action="https://api.web3forms.com/submit">` со скрытыми `access_key`, `redirect` = `site.siteUrl + '/#contact'`, `botcheck`.
  - `mobile-cta.ts`: `initMobileCta(): void` — показывает `[data-mobile-cta]` (< 900 px), когда hero вне экрана и `#contact` вне экрана.

- [ ] **Step 1: Failing tests** (`page.route('https://api.web3forms.com/**', …)` для мока):
  - Пустая отправка → 4 ошибки (имя, контакт, услуга, согласие), фокус в поле «Имя», запросов 0.
  - Клик `[ хочу ИИ-агента ]` → чип `agent` выбран, группа «Где будет работать» видима.
  - Выбрать `agent`, отметить `crm`, сменить на `site` → группа скрыта; в теле отправленного запроса нет `agentPlace`. *(Review Focus 4)*
  - Валидная форма, мок `{success:true}` → виден `✓ заявка принята`, `aria-live` блок содержит текст.
  - Двойной клик по кнопке отправки (мок с задержкой 500 мс) → ровно 1 запрос. *(Review Focus 2)*
  - Мок HTTP 200 `{success:false}` → видна ошибка `не удалось отправить`, введённое имя сохранено. *(Review Focus 3)*
  - Мок `route.abort()` → та же ошибка.
  - Скрытое поле `botcheck` присутствует и не видно.
  - mobile: на загрузке `[data-mobile-cta]` скрыт; после скролла за hero — видим; у `#contact` — скрыт.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 4.7, 6.1, 6.2.
- [ ] **Step 4:** Run → PASS; `npm run test:unit` тоже PASS.
- [ ] **Step 5:** Commit `feat: contact form with web3forms and mobile cta`.

---

### Task 8: Появление при скролле и reduced motion

**Files:**
- Create: `src/scripts/reveal.ts`
- Modify: `src/styles/global.css`, компоненты секций (добавить `.reveal` к заголовкам секций и карточкам), `src/layouts/Base.astro` (единая точка инициализации скриптов)
- Test: `tests/e2e/motion.spec.ts`

**Interfaces:**
- Produces: `initReveal(): void` — если `CSS.supports('animation-timeline: view()')`, ничего не делает (работает CSS); иначе IntersectionObserver добавляет `is-visible`. Единый `src/scripts/main.ts` вызывает все `init*` из Tasks 3–8.

- [ ] **Step 1: Failing tests:**
  - reduced motion: все `.reveal` имеют `opacity: 1` и `transform: none` сразу после загрузки; демо агента показывает все строки; H1 полный.
  - Обычный режим, после прокрутки до конца страницы: у всех `.reveal` `opacity` = `1`.
  - Размер JS: суммарный `transferSize` всех `script` ресурсов ≤ 15 360 байт (через `performance.getEntriesByType('resource')`).
  - Шрифты: суммарный `transferSize` ресурсов `.woff2` ≤ 122 880 байт.
  - Внешние запросы: все ресурсы страницы имеют origin `http://localhost:4321`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 6.3 (A3, A7, A8); keyframes под `@media (prefers-reduced-motion: no-preference)` и `@supports (animation-timeline: view())`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: scroll reveal and reduced-motion handling`.

---

### Task 9: Политика, 404, SEO, доступность, адаптив, README

**Files:**
- Create: `src/pages/privacy.astro`, `src/pages/404.astro`, `public/robots.txt`, `public/og.png`, `README.md`
- Modify: `src/layouts/Base.astro` (OG, Twitter, canonical, JSON-LD), `astro.config.mjs` (`site`, sitemap)
- Test: `tests/e2e/seo-a11y.spec.ts`

**Interfaces:**
- Consumes: `site`, `Base`.
- Produces: JSON-LD `@graph` из `Person` и `ProfessionalService` с тремя `Service` в `hasOfferCatalog`.

- [ ] **Step 1: Failing tests:**
  - `/`: meta `description` из ТЗ 6.4; `og:title`, `og:image` (`/og.png`), `link[rel=canonical]`; JSON-LD парсится и содержит `Person` с `name: 'Имя Фамилия'` и 3 `Service`.
  - `/privacy` содержит заголовок «Политика обработки персональных данных» и упоминание Web3Forms; `/404` (через `dist/404.html`) содержит `error 404` и ссылку на `/`.
  - axe на `/`, `/privacy`, `/404` → 0 нарушений `serious`/`critical`.
  - Ширины 320, 360, 768, 1440: `document.documentElement.scrollWidth <= window.innerWidth`. *(Review Focus 5)*
  - 360 px с `document.documentElement.style.fontSize = '200%'`: то же условие. *(Review Focus 5)*
  - Скриншоты `/` на 360 / 768 / 1440 сохраняются в `test-results/screens/` (артефакт для ручной проверки, не сравнение).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Реализовать по ТЗ 4 (privacy, 404), 6.4, 6.5, 6.7. `og.png` 1200×630 — снять скриншотом hero через Playwright-скрипт `scripts/make-og.ts` и сохранить в `public/`. README: замена заглушек в `site.ts`, получение ключа Web3Forms, `npm run build`, деплой на Netlify/Vercel/GitHub Pages, запуск тестов.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: privacy, 404, seo, a11y and responsive checks`.

---

### Task 10: Финальная проверка

**Files:** без изменений кода (только исправления найденного).

- [ ] **Step 1:** `npm run check && npm test` → 0 ошибок, все тесты PASS.
- [ ] **Step 2:** Lighthouse мобильный по `npm run preview`: `npx lighthouse http://localhost:4321 --preset=perf --form-factor=mobile` и полный прогон всех категорий → все ≥ 95. Если ниже — исправить и повторить.
- [ ] **Step 3:** Сверка со ТЗ: пройти разделы 4–6 ТЗ, отметить каждый пункт; `grep -rn "ЗАГЛУШКА" src/` — все заглушки только в `site.ts`.
- [ ] **Step 4:** Commit `chore: final verification` (если были исправления).
