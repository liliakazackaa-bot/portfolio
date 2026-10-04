# Исследование: лендинг-портфолио «Сайты · Приложения · ИИ-агенты»

*Октябрь 2026. Три параллельных исследования: конкуренты, структура, тренды.*

---

## TL;DR — что делать

1. **Стиль:** тёмная основа + 1–2 насыщенных акцента (OKLCH), огромная кинетическая типографика, бенто-сетка услуг.
2. **Шрифты (с кириллицей):** Unbounded + Manrope, или Geist + Geist Mono.
3. **Структура:** Hero → Услуги (3 направления с ценой «от») → Кейсы → Процесс → Обо мне + отзывы → FAQ → Форма-бриф.
4. **Главная фишка:** живой ИИ-агент прямо на лендинге («Спросите моего агента») — на Awwwards ниша «сайты + агенты» почти пуста.
5. **Конверсия:** цены «от», статус «свободен с …», две кнопки («Обсудить проект» / «Посчитать стоимость»), короткая форма 3–4 поля.

---

## 1. Конкуренты и примеры

> Behance вернул 403, Dribbble — пустую страницу, поэтому примеры собраны с Awwwards (Portfolio, Sites of the Day). Шрифты подтверждены только у wodniack.dev и noth.in, у остальных — рекомендация под стиль.

| # | Сайт | Что цепляет | Стиль / цвета | Шрифты | Что взять |
|---|---|---|---|---|---|
| 1 | [wodniack.dev](https://wodniack.dev/) — Antoine Wodniack (SOTD, дек. 2024) | Крупное «Creative Developer», статус «доступен», кнопка Hire me и QR-код; «солнце» из линий | Ретро, монохром + красный `#F21A4E` на `#160000` | Bigger Display + PP Editorial New + PP Fraktion Mono ✅ | Один яркий акцент; три шрифта (акцидент/антиква/моно); статус на первом экране |
| 2 | [elliott.mangham.dev](https://elliott.mangham.dev) (SOTD, дек. 2025) | **Вилки цен прямо на лендинге**, «23× SOTD», логотипы Disney | Тёмный `#121212`, текст проявляется при скролле, GSAP | → Geist / Inter Tight | Цены «от», две CTA: «Записаться на звонок» и «Рассчитать стоимость» |
| 3 | [bruno-simon.com](https://bruno-simon.com) (SOTM, янв. 2026) | Портфолио-игра: машинка ездит по 3D-острову | Three.js, WebGPU, сезоны, лидерборд | → Unbounded / Tektur | Один «игрушечный» интерактив (демо агента) вместо целой игры |
| 4 | [noth.in](https://www.noth.in) — Nothin', Париж (SOTD, авг. 2026) | Живой меняющийся логотип, шоурил на весь экран, в услугах — **AI systems** | Ч/б `#000/#FFF`, шейдеры от мыши, ИИ-видео | PP Neue Montreal Bold ✅ | Манифест вместо «я делаю сайты»; разметка для ИИ-ассистентов |
| 5 | [fiddle.digital](https://fiddle.digital) (SOTD, мар. 2025) | «Design-Led Engineering»; **услуга-продукт f-Project с кнопкой «Try it Live»** | Тёмный `#101214` + лаванда `#C8C2CF`, кинетическая типографика | → Geist / Onest | Пакет с фиксированным составом + живое демо; таймлайн опыта; один сильный отзыв |
| 6 | [phantom.land](https://www.phantom.land/) (SOTD, июн. 2025) | Бесконечная 3D-сетка работ, «сканирование лица» в команде | Тёмный `#202020`, жесты | → Inter Tight | Hero из одного предложения; архив работ по годам |
| 7 | [olhalazarieva.com](https://www.olhalazarieva.com/) (SOTD, окт. 2025) | Элегантный минимализм, высокая скорость | Светлый `#F7F7F7` / `#101010`, React + GSAP | → Oswald / Unbounded + Manrope | Продуманная страница «Спасибо»; скорость как аргумент |
| 8 | [romanjeanelie.com](https://www.romanjeanelie.com/) (SOTD, нояб. 2025) | Полноэкранный сторителлинг, 3D, бесконечный скролл | Next.js, Three.js, GSAP | — | Кейс = история «задача → решение → результат» с видео |
| 9 | [ashwingupta.dev](https://www.ashwingupta.dev/) — портфолио **ИИ-инженера** (номинант, июн. 2026) | Космический фон, курсор-МКС, HUD с таймером и компасом скролла | Astro, React | — | Метафора «приборной панели»; таймлайн в виде диаграммы Ганта |
| 10 | [madebynull.com](https://www.madebynull.com/) — Studio Null (SOTD, май 2025) | 3D + звук, интерфейс в виде «окон» ОС | Белый минимализм | → Geist / Geist Mono | «Окно чата» с живым агентом |

### Общие закономерности
- **Первый экран = одно предложение + доказательство** (роль, для кого, статус «доступен», одна цифра).
- **Тёмная тема + один акцент** — 6 из 10. Светлые — монохромный минимализм.
- **Типографика вместо иллюстраций**; моноширинный шрифт для техподписей — норма у разработчиков.
- **Движение:** почти все — GSAP + плавный скролл, половина — WebGL/3D; прелоадер и креативная 404.
- **ИИ:** у Nothin' и Phantom уже в услугах. Живого демо агента на лендинге почти ни у кого нет — это ваше окно.

### Шрифтовые пары с кириллицей (проверено по METADATA google/fonts)

| Заголовки | Текст / UI | Характер |
|---|---|---|
| **Unbounded** 700–900 | **Manrope** 400–600 | Широкий дерзкий техно-гротеск — тёмная тема, бенто |
| **Geist** 600–800 | **Geist Mono** | Инженерный, в духе Vercel — минимализм, ИИ |
| **Onest** 700 | **JetBrains Mono** | Отличная кириллица + «терминал» — HUD, демо агента |
| **Cormorant Garamond** 500–600 | **Inter Tight** 400–500 | Редакционный контраст — премиальная подача |

⚠️ **Без кириллицы:** Space Grotesk, Instrument Serif. Платные PP Neue Montreal / PP Editorial New — вероятно, тоже без неё.

---

## 2. Структура продающего лендинга

> Источники: Tilda Education («Анатомия лендинга»), шаблон «Сайт-портфолио» Tilda, каталоги onepagelove (Portfolio/Personal/Agency), NN/g, CXL, Unbounce.

### Из каких блоков состоит продающий лендинг
Формула Tilda — пять смысловых групп: **внимание → что предлагаем → выгоды → доверие → действие**. Каждая секция отвечает на один вопрос посетителя.

| Группа | Блоки |
|---|---|
| Внимание | Первый экран (hero), навигация 5–7 пунктов |
| Предложение | Оффер, услуги, целевая аудитория, выгоды, этапы работы, цены |
| Доверие | Кейсы, отзывы, клиенты, цифры, обо мне, гарантии, FAQ |
| Действие | CTA-блоки, форма, контакты, страница «Спасибо» |

На onepagelove чаще всего встречаются: соцдоказательство, сбор контактов, отзывы, логотипы клиентов, формы, «Как это работает».

**Принципы:** одна страница — одна цель; 90% основного цвета / 10% акцентов; анимировать не более 20–30% элементов; одна иконочная библиотека; реальные изображения вместо стока; решение «остаться/уйти» — первые 10 секунд (NN/g).

### Идеальная структура — 7 блоков

**Ключевая мысль:** три направления не должны читаться как «делаю всё». Объединяющий оффер — *«превращаю задачу бизнеса в работающий цифровой продукт»*, где сайт, приложение и агент — три инструмента.

#### 1. Hero
- **Заголовок-результат:** «Сайты, приложения и ИИ-агенты, которые приводят клиентов и снимают рутину».
- **Подзаголовок:** «Проектирую, разрабатываю и запускаю под ключ. Первая версия — от 2 недель».
- Строка-индикатор `Сайты · Приложения · ИИ-агенты`, статус «Свободен с …».
- Визуал: фото + коллаж реальных работ (сайт, экран приложения, окно чата).
- **CTA:** «Обсудить проект» + ссылка «Смотреть кейсы ↓». Под кнопкой — «Отвечаю в течение 2 часов».

#### 2. Услуги — три направления через задачи клиента

| Направление | Боль клиента | Результат |
|---|---|---|
| Сайты | «Нужны заявки из интернета» | Лендинг/многостраничник с аналитикой, 2–3 недели, от N ₽ |
| Приложения | «Процесс живёт в Excel и чатах» | Веб/мобильное: запись, кабинет, CRM-функции. MVP 4–6 недель, от N ₽ |
| ИИ-агенты | «Менеджеры тонут в однотипных вопросах» | Ассистент в Telegram/на сайте: отвечает, квалифицирует, передаёт в CRM. Пилот 1–2 недели, от N ₽ |

CTA в каждой карточке («Нужен сайт» / «Обсудить приложение» / «Хочу ИИ-агента») → форма с уже выбранным направлением. Плюс строка: «Не уверены, что вам нужно? Опишите задачу — подскажу формат бесплатно».

#### 3. Кейсы (главный блок)
3–5 кейсов, минимум по одному на направление. Карточка: **заголовок с результатом** → тип клиента → задача → решение (2–3 предложения) → результат с числом → стек-теги → «Подробнее» / «Открыть демо» → цитата клиента. Для агентов — GIF диалога, метрики и обязательно: где агент передаёт разговор человеку.

#### 4. Как я работаю
5 шагов со сроками: Заявка и бриф (15 мин) → Созвон и оценка (1–2 дня, фиксированная смета) → Договор и предоплата → Разработка с демо каждую неделю → Запуск + 30 дней бесплатных правок. Плюс тезисы: один исполнитель от идеи до запуска, код и доступы — ваши, работа по договору. **CTA:** «Начать с бесплатной оценки».

#### 5. Обо мне + соцдоказательство
Реальное фото, 3–4 предложения истории, 3 честные цифры, 2–4 отзыва (фото, имя, должность, ссылка, конкретный результат), ссылки на GitHub / Telegram-канал / профили бирж. **CTA:** «Написать в Telegram».

#### 6. FAQ
Цена и от чего зависит · Что если не понравится · Можно ли начать с пилота · Чем ИИ-агент отличается от чат-бота · Кому принадлежат код и данные · Договор и оплата · Поддержка после запуска.

#### 7. Финальный CTA + форма-бриф
«Расскажите о задаче — через день пришлю план и оценку. Первая консультация бесплатно». Форма + Telegram/почта/календарь. Согласие на обработку ПДн (152-ФЗ). Страница «Спасибо» с объяснением, что будет дальше.

**Сквозное:** закреплённая кнопка «Обсудить проект», один `h1`, якорное меню, быстрая загрузка.

### Форма заявки
- **Два уровня:** на сайте 3–4 поля (Имя · Telegram или email · чипы «Сайт / Приложение / ИИ-агент / Не знаю» · задача в 1–2 фразах, необязательно), подробный бриф — после первого контакта.
- Условная логика: выбрали «ИИ-агент» → поле «Где будет работать: Telegram / сайт / CRM».
- Бюджет — необязательный, диапазонами.
- Кнопка — результат: «Получить оценку», не «Отправить». Обязательный телефон резко снижает конверсию.

### Соцдоказательство без громких клиентов
- Конкретные результаты вместо неизвестных логотипов.
- Отзывы с фото, именем и ссылкой; 30-секундные видеоотзывы.
- Внешние площадки (Kwork, FL.ru, Хабр Фриланс, Profi.ru) — проверяемо.
- Открытая работа: GitHub, статьи на Хабре/vc.ru, Telegram-канал.
- Честно подписанные демо: «Демо-агент для записи в барбершоп — попробуйте».
- 1–2 пилота за символическую цену в обмен на кейс и отзыв.
- ❌ Не делать: фейковые отзывы/счётчики, блок из 1–2 слабых отзывов, стену неизвестных логотипов.

### Кейсы под NDA
Категория клиента вместо имени («сеть стоматологий, 5 филиалов»), относительные цифры («−30% обращений»), пункт о праве на анонимное упоминание в договоре. Нет метрик — пишите качественный результат, цифры не выдумывайте.

---

## 3. Тренды 2026 — пять для применения

> Источники: Awwwards SOTD/SOTM 2026, CSS-Tricks (2026), Smashing Magazine, WebKit/Chrome blogs, web.dev Baseline 2026, обзоры Figma, Envato, Muzli.

### Тренд 1. Анимации на скролле нативным CSS + View Transitions
Scroll-driven animations и View Transitions вошли в Interop 2026, работают вне основного потока и не портят INP.

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}
@keyframes reveal { from { opacity: 0; translate: 0 2rem; } }

/* плавные переходы между страницами кейсов */
@view-transition { navigation: auto; }
.case-cover { view-transition-name: case-hero; }
```

| Функция | Chrome | Safari | Firefox |
|---|---|---|---|
| Scroll-driven animations | 115+ | 26+ | ❌ |
| View Transitions (одна страница) | 111+ | 18+ | 144+ |
| View Transitions (между страницами) | 126+ | 18.2+ | ❌ |

Фолбэк и сложные сцены: **GSAP ScrollTrigger + Lenis** (GSAP с 3.13 полностью бесплатен, включая SplitText). Анимировать только `transform`/`opacity`; переход отменяется, если страница не отрисовалась за 4 с.
Пример: [scroll-driven-animations.style](https://scroll-driven-animations.style/), [jesperlandberg.com](http://jesperlandberg.com).

### Тренд 2. Кинетическая вариативная типографика
Огромный заголовок как главный визуал, насыщенность реагирует на скролл/курсор, буквы появляются по одной.

```css
@property --wght { syntax: "<number>"; inherits: true; initial-value: 300; }
.hero-title {
  font-family: "Unbounded", sans-serif;
  font-variation-settings: "wght" var(--wght);
  font-size: clamp(3rem, 12vw, 11rem);
  text-wrap: balance;
  transition: --wght .4s;
}
.hero-title:hover { --wght: 800; }
```
JS: `SplitText.create(".hero-title", { type: "chars,words", autoSplit: true })` + `gsap.from(split.chars, { yPercent: 100, stagger: 0.02 })`.
⚠️ Проверить на 360px, что «приложения» влезает; сохранить `aria-label` после SplitText; анимировать вес только у заголовков.
Пример: [matvoyce.tv](https://matvoyce.tv).

### Тренд 3. Смелая палитра на тёмной основе в OKLCH
«Goodbye Beige, Hello Bold» (Muzli). OKLCH во всех браузерах с ноября 2025, `contrast-color()` — в Baseline 2026.

```css
:root {
  color-scheme: light dark;
  --accent: oklch(0.70 0.14 285);
  --bg: light-dark(oklch(0.97 0.01 270), oklch(0.16 0.02 270));
  --accent-soft: oklch(from var(--accent) l c h / 0.15);
  --accent-hover: color-mix(in oklch, var(--accent), white 15%);
}
.btn { background: var(--accent); color: white; color: contrast-color(var(--accent)); }
```
⚠️ Насыщенный акцент — для крупных элементов, не для мелкого текста; при C > 0.18 цвет может выйти за sRGB.
Примеры: [landonorris.com](https://landonorris.com), [lusion.co](https://lusion.co).

### Тренд 4. Бенто-сетка на container queries
Три направления + стек + метрики + отзывы в модульной сетке; размер карточки = приоритет.

```css
.bento {
  display: grid; gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  grid-auto-flow: dense;
}
.bento > .card { container-type: inline-size; }
.card--agents { grid-column: span 2; grid-row: span 2; }
@container (width > 32rem) {
  .card__body { display: grid; grid-template-columns: 1fr 1fr; }
}
```
Подсветка за курсором: `--x/--y` из `pointermove` → `radial-gradient(at var(--x) var(--y), …)`.
⚠️ `dense` меняет визуальный порядок — проверить навигацию с клавиатуры; бенто легко становится шаблоном — нужна живая деталь (мини-демо агента).
Пример: [create.video](https://www.create.video).

### Тренд 5. ИИ-агент как интерфейс + сайт, понятный машинам
Блок «Спросите моего агента» с готовыми вопросами-кнопками («Сколько стоит лендинг?», «Покажи кейсы с агентами»), потоковые ответы со ссылками на кейсы. Параллельно — семантичный HTML и JSON-LD (`Person`, `Service`, `CreativeWork`), тренд «UX → MX» (Muzli).

```css
.chat[open] {
  opacity: 1; translate: 0 0;
  transition: opacity .25s, translate .25s, display .25s allow-discrete;
}
@starting-style { .chat[open] { opacity: 0; translate: 0 1rem; } }
```
- Сервер: SSE-эндпоинт или Vercel AI SDK, ключ API только на сервере, rate limit.
- Клиент: `<dialog>`, поток через `fetch` + `ReadableStream`, `aria-live="polite"`.
- Опционально: WebMCP (`document.modelContext.registerTool`) — пока только Origin Trial в Chrome 149–156.
- ⚠️ Ограничить ответы базой знаний («точную оценку дам лично»), согласие на ПДн, чат — дополнение к форме, а не замена.

### Палитры

**A. «Нейросеть ночью»** — технологичная
| Роль | OKLCH | HEX |
|---|---|---|
| Фон | oklch(0.16 0.02 270) | `#0A0D16` |
| Поверхность | oklch(0.22 0.025 270) | `#161A26` |
| Текст | oklch(0.96 0.01 270) | `#EFF2F9` |
| Вторичный | oklch(0.70 0.02 270) | `#999EAB` |
| Агенты | oklch(0.70 0.14 285) | `#9690F1` |
| Приложения | oklch(0.85 0.17 165) | `#2FF0B2` |
| Сайты | oklch(0.80 0.15 75) | `#F5AE39` |

**B. «Тёплый редакционный»** — светлая, против ИИ-клише
| Роль | OKLCH | HEX |
|---|---|---|
| Фон | oklch(0.97 0.01 90) | `#F8F5EE` |
| Текст | oklch(0.20 0.02 60) | `#1D140D` |
| Вторичный | oklch(0.50 0.02 60) | `#6C6158` |
| Акцент | oklch(0.56 0.19 35) | `#CB380D` |
| Ссылки | oklch(0.50 0.12 250) | `#2266A4` |
| Карточки | oklch(0.90 0.03 90) | `#E6DEC8` |

**C. «Кислотный терминал»** — дерзкая
| Роль | OKLCH | HEX |
|---|---|---|
| Фон | oklch(0.14 0.01 160) | `#060A08` |
| Поверхность | oklch(0.20 0.015 160) | `#101814` |
| Текст | oklch(0.93 0.02 130) | `#E3EBDD` |
| Лайм | oklch(0.88 0.21 130) | `#A8F145` |
| Циан | oklch(0.74 0.12 220) | `#39BCDF` |
| Маджента | oklch(0.68 0.20 330) | `#D961D2` |

💡 Закрепите за каждым направлением свой цвет (палитра A) и повторяйте его в карточках и тегах кейсов — цвет становится навигацией.

---

## Ограничения исследования
- Behance (403) и Dribbble (пустая страница) не открылись; примеры — с Awwwards.
- Шрифты подтверждены только у двух сайтов; остальные — рекомендации.
- Поддержка anchor positioning в источниках расходится — проверить на caniuse.
- Цифры о формах (HubSpot, ImageScape) взяты из вторичных источников (Cobloom, Unbounce).

## Источники

**Конкуренты:** [Awwwards Portfolio](https://www.awwwards.com/websites/winner_category_portfolio/) · [wodniack.dev](https://wodniack.dev/) · [GitHub AW-2025](https://github.com/AntoineW/AW-2025-Portfolio) · [elliott.mangham.dev](https://elliott.mangham.dev) · [bruno-simon.com](https://bruno-simon.com) · [Bruno case study](https://www.awwwards.com/brunos-portfolio-case-study.html) · [noth.in](https://www.noth.in) · [fiddle.digital](https://fiddle.digital) · [phantom.land](https://www.phantom.land/) · [olhalazarieva.com](https://www.olhalazarieva.com/) · [romanjeanelie.com](https://www.romanjeanelie.com/) · [ashwingupta.dev](https://www.ashwingupta.dev/) · [madebynull.com](https://www.madebynull.com/) · [Lapa Ninja: wodniack](https://www.lapa.ninja/post/wodniack/) · [Lapa Ninja: nothin](https://www.lapa.ninja/post/nothin/) · [Muzli Top 100 portfolios 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/) · [google/fonts](https://github.com/google/fonts)

**Структура:** [onepagelove Portfolio](https://onepagelove.com/portfolio) · [Personal](https://onepagelove.com/personal) · [Agency](https://onepagelove.com/agency) · [7 SEO tips](https://onepagelove.com/7-practical-seo-tips-for-one-page-websites) · [Tilda: Анатомия лендинга](https://tilda.education/courses/landing-page/anatomiya-landing-page/) · [Tilda: Принципы дизайна](https://tilda.education/courses/landing-page/design-landing-page/) · [Блог Tilda: ЦА](https://blog.tilda.cc/tpost/uahxr2aukp-bloki-lendinga-tselevaya-auditoriya) · [Tilda: шаблон портфолио](https://tilda.cc/ru/tpls/sait-portfolio/) · [NN/g: время на странице](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) · [NN/g: доверие](https://www.nngroup.com/articles/trustworthy-design/) · [NN/g: соцдоказательство](https://www.nngroup.com/articles/social-proof-ux/) · [CXL: лендинг](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/) · [CXL: social proof](https://cxl.com/blog/is-social-proof-really-that-important/) · [Unbounce: выбор](https://unbounce.com/conversion-rate-optimization/psychology-of-choice-conversion-rates/) · [Cobloom: поля форм](https://www.cobloom.com/blog/form-fields-and-conversion-rates-is-less-really-more) · [9am.works: кейсы](https://www.9am.works/freelancer-academy/blog/freelance-case-studies-portfolio-that-wins-projects)

**Тренды:** [Awwwards SOTM](https://www.awwwards.com/websites/sites_of_the_month/) · [CSS-Tricks: scroll & view transitions](https://css-tricks.com/scroll-driven-scroll-triggered-scroll-states-and-view-transitions/) · [CSS-Tricks: Interop 2026](https://css-tricks.com/interop-2026/) · [CSS-Tricks: GSAP free](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) · [Smashing: CSS Wrapped 2025](https://www.smashingmagazine.com/2025/12/state-logic-native-power-css-wrapped-2025/) · [WebKit: Interop 2026](https://webkit.org/blog/17818/announcing-interop-2026/) · [web.dev Baseline 2026](https://web.dev/baseline/2026) · [Chrome: scroll-triggered](https://developer.chrome.com/blog/scroll-triggered-animations) · [Figma trends](https://www.figma.com/resource-library/web-design-trends/) · [Envato trends](https://elements.envato.com/learn/web-design-trends) · [Muzli 2026](https://muz.li/blog/web-design-trends-2026/) · [Select Interactive](https://www.select-interactive.com/news/web-design-trends-2026-that-survive-performance-and-ai-agents) · [SaaSFrame: бенто](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide) · [State of WebMCP](https://www.spronta.com/blog/state-of-webmcp-july-2026/) · [Lenis](https://github.com/darkroomengineering/lenis) · [oryzo.ai](https://oryzo.ai) · [landonorris.com](https://landonorris.com) · [lusion.co](https://lusion.co) · [matvoyce.tv](https://matvoyce.tv) · [create.video](https://www.create.video)
