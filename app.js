// Логика экранов, каталог данных и интеграция с Telegram WebApp API.
(() => {
  "use strict";

  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  const app = document.getElementById("app");
  const navButtons = Array.from(document.querySelectorAll("[data-nav]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Цены, сроки и концепты ниже — демонстрационное наполнение, его нужно согласовать перед публикацией.
  const services = [
    {
      id: "website",
      category: "sites",
      title: "Сайт, который приводит клиентов",
      shortTitle: "Сайт",
      subtitle: "Лендинг, сайт-визитка или страница услуги",
      icon: "✦",
      visual: "visual-site",
      price: "от 35 000 ₽",
      time: "от 2 недель",
      lead: "Понятно рассказывает о вашем деле и помогает клиенту сделать следующий шаг.",
      outcomes: ["Структура и дизайн под вашу задачу", "Адаптация для телефона", "Публикация и базовая настройка"],
      scope: ["Обсуждаем цель и содержание", "Собираем дизайн и согласуем", "Разрабатываем и запускаем"],
      concept: "Лендинг для студии йоги",
      caseId: "yoga"
    },
    {
      id: "miniapp",
      category: "mini",
      title: "Telegram Mini App для бизнеса",
      shortTitle: "Mini App",
      subtitle: "Каталог, заявки или запись в Telegram",
      icon: "▦",
      visual: "visual-mini",
      price: "от 55 000 ₽",
      time: "от 3 недель",
      lead: "Приложение внутри Telegram: клиент выбирает услугу и оставляет заявку, не уходя в браузер.",
      outcomes: ["Интерфейс в стиле Telegram", "Каталог и карточки услуг", "Заявка с переходом в чат"],
      scope: ["Проектируем короткий путь клиента", "Собираем адаптивный Mini App", "Подключаем Telegram и проверяем на телефоне"],
      concept: "Каталог услуг мастера",
      caseId: "catalog"
    },
    {
      id: "ai-agent",
      category: "ai",
      title: "AI-ассистент для ваших клиентов",
      shortTitle: "AI-агент",
      subtitle: "Ответы по вашим материалам и правилам",
      icon: "✳",
      visual: "visual-ai",
      price: "от 45 000 ₽",
      time: "от 2 недель",
      lead: "Помогает быстро отвечать на повторяющиеся вопросы на основе информации о вашем бизнесе.",
      outcomes: ["Настройка под частые вопросы", "Подготовка базы материалов", "Тестирование на примерах"],
      scope: ["Определяем задачи и границы ответов", "Готовим и структурируем источники", "Настраиваем сценарий и проверяем"],
      concept: "AI-помощник для онлайн-школы",
      caseId: "assistant"
    }
  ];

  const cases = {
    yoga: {
      title: "Лендинг для студии йоги",
      icon: "🧘",
      service: "website",
      task: "Показать занятия и помочь новичку записаться на первое посещение.",
      solution: "Концепт мобильной страницы с расписанием, направлениями и ясным действием.",
      outcome: "Все важные детали собраны в одном коротком сценарии.",
      tag: "Демо-концепт"
    },
    catalog: {
      title: "Каталог услуг мастера",
      icon: "📱",
      service: "miniapp",
      task: "Помочь клиенту выбрать цифровую услугу и быстро описать задачу.",
      solution: "Концепт Mini App с карточками услуг, примерами и коротким брифом.",
      outcome: "Путь от выбора до обращения проходит внутри Telegram.",
      tag: "Демо-концепт"
    },
    assistant: {
      title: "AI-помощник для онлайн-школы",
      icon: "🤖",
      service: "ai-agent",
      task: "Сократить повторяющиеся вопросы о программе и формате обучения.",
      solution: "Концепт ассистента, отвечающего на основе материалов школы и FAQ.",
      outcome: "Сложные и нестандартные вопросы передаются человеку.",
      tag: "Демо-концепт"
    }
  };

  const state = {
    screen: "home",
    stack: [],
    category: "all",
    serviceId: null,
    caseId: null,
    draft: { serviceId: "", description: "", timing: "", budget: "", contact: "" },
    consents: { personal: false, transfer: false },
    formError: "",
    sendError: "",
    leadId: "",
    busy: false
  };

  const categoryLabels = { all: "Все", sites: "Сайты", mini: "Mini App", ai: "AI-агенты" };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const byService = (id) => services.find((service) => service.id === id);
  const byCase = (id) => cases[id];
  // Заявку можно отправить на сервер только из Telegram: сервер проверяет подпись initData.
  const CONSENT_VERSION = "2026-10-22";
  const LEAD_ENDPOINT = "api/lead.php";
  const POLICY_URL = "privacy/";
  const canSubmit = () => Boolean(tg && tg.initData);
  const tgUsername = () => (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.username) || "";
  const sendErrors = {
    consent_required: "Отметьте оба согласия, чтобы отправить заявку.",
    contact_required: "Укажите контакт для ответа.",
    too_many_requests: "Слишком много заявок подряд. Попробуйте позже или напишите в чат.",
    telegram_expired: "Сессия устарела. Закройте и снова откройте приложение.",
    delivery_not_configured: "Приём заявок через форму в процессе доработки и скоро заработает. Нажмите «Лучше напишу в чат сам(а)» — текст заявки подготовится автоматически.",
    network: "Нет связи с сервером. Проверьте интернет или напишите в чат."
  };
  // Фирменная тёмная тема, как в портфолио: цвета Telegram не подменяют оформление.
  const BRAND_BG = "#060a08";

  function initTelegram() {
    document.documentElement.dataset.theme = "dark";
    if (!tg) return;
    tg.ready();
    tg.expand();
    if (tg.isVersionAtLeast && tg.isVersionAtLeast("6.1")) {
      try { tg.setHeaderColor(BRAND_BG); tg.setBackgroundColor(BRAND_BG); } catch (e) { /* старый клиент */ }
    }
    if (tg.isVersionAtLeast && tg.isVersionAtLeast("7.10") && tg.setBottomBarColor) {
      try { tg.setBottomBarColor(BRAND_BG); } catch (e) { /* не поддерживается */ }
    }
    if (tg.BackButton && tg.isVersionAtLeast("6.1")) tg.BackButton.onClick(goBack);
  }

  function setScreen(screen, params = {}, push = true) {
    if (push && state.screen !== screen) state.stack.push({ screen: state.screen, category: state.category, serviceId: state.serviceId, caseId: state.caseId });
    state.screen = screen;
    Object.assign(state, params);
    state.formError = "";
    render();
  }

  function goBack() {
    if (state.screen === "review") {
      state.screen = "form";
      if (state.stack.length && state.stack[state.stack.length - 1].screen === "form") state.stack.pop();
    } else if (state.stack.length) {
      const previous = state.stack.pop();
      state.screen = previous.screen;
      state.category = previous.category;
      state.serviceId = previous.serviceId;
      state.caseId = previous.caseId;
    } else {
      state.screen = "home";
    }
    state.formError = "";
    render();
  }

  function homeTemplate() {
    const firstName = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
      ? tg.initDataUnsafe.user.first_name
      : "";
    const greeting = firstName
      ? `Привет, ${escapeHtml(firstName)}`
      : "Идея → цифровой продукт";
    return `
      <section class="hero">
        <span class="eyebrow"><i class="eyebrow-dot"></i> ${greeting}</span>
        <h1>Создаю цифровое,<br><span>которое работает</span></h1>
        <p class="hero-copy">Сайты, Mini App и AI-агенты для вашего проекта — от идеи до запуска.</p>
        <div class="hero-art" aria-label="Иллюстрация цифрового продукта">
          <span class="art-label">Ваш следующий проект</span>
          <div class="art-orbit" aria-hidden="true">✦</div>
          <div class="art-window" aria-hidden="true">
            <div class="window-dots"><i></i><i></i><i></i></div>
            <div class="window-title"></div><div class="window-subtitle"></div>
            <div class="window-grid"><i></i><i></i><i></i></div>
          </div>
        </div>
        <div class="section-heading"><h2>Чем помочь?</h2><button class="text-button" data-action="catalog">Все услуги</button></div>
        <div class="direction-grid">
          <button class="direction-card" data-action="category" data-category="sites"><span class="direction-icon">✦</span><strong>Сайт</strong><small>Больше клиентов</small></button>
          <button class="direction-card" data-action="category" data-category="mini"><span class="direction-icon">▦</span><strong>Mini App</strong><small>Внутри Telegram</small></button>
          <button class="direction-card" data-action="category" data-category="ai"><span class="direction-icon">✳</span><strong>AI-агент</strong><small>Меньше рутины</small></button>
        </div>
        <button class="profile-strip" data-action="about" type="button">
          <span class="profile-photo">✦</span><span><strong>О мастере</strong><small>Разработка с вниманием к вашей задаче</small></span><span class="profile-arrow">›</span>
        </button>
        <div class="button-stack"><button class="primary-button" data-action="form">Обсудить проект <span aria-hidden="true">→</span></button></div>
      </section>`;
  }

  function catalogTemplate() {
    const filtered = services.filter((service) => state.category === "all" || service.category === state.category);
    return `
      <section class="page-head"><span class="eyebrow">Под задачу</span><h1>Услуги</h1><p>Выберите формат — покажу, что в него входит.</p></section>
      <div class="filter-row" role="tablist" aria-label="Категории услуг">
        ${Object.entries(categoryLabels).map(([key, label]) => `<button class="filter-chip ${state.category === key ? "is-selected" : ""}" role="tab" aria-selected="${state.category === key}" data-action="filter" data-category="${key}">${label}</button>`).join("")}
      </div>
      <div class="service-list">
        ${filtered.map((service) => serviceCard(service)).join("")}
      </div>
      <div class="button-stack"><button class="primary-button" data-action="form">Обсудить проект <span aria-hidden="true">→</span></button></div>`;
  }

  function serviceCard(service) {
    return `<button class="service-card" data-action="service" data-id="${service.id}" type="button">
      <span class="service-visual ${service.visual}" aria-hidden="true">${service.icon}</span>
      <span class="service-info"><span class="demo-tag">Примерные условия</span><h3>${service.shortTitle}</h3><p>${service.subtitle}</p>
        <span class="service-meta"><strong class="service-price">${service.price}</strong><span>${service.time}</span></span>
      </span><span class="profile-arrow" aria-hidden="true">›</span>
    </button>`;
  }

  function serviceTemplate() {
    const service = byService(state.serviceId);
    if (!service) return emptyTemplate("Не удалось найти услугу.");
    return `
      <section class="page-head"><span class="eyebrow">Услуга · примерные условия</span><h1>${service.shortTitle}</h1><p>${service.subtitle}</p></section>
      <div class="service-hero ${service.visual}"><span class="service-hero-icon">${service.icon}</span></div>
      <p class="detail-lead">${service.lead}</p>
      <div class="price-panel"><span><small>Ориентир по стоимости</small><strong>${service.price}</strong></span><span><small>Срок</small><strong>${service.time}</strong></span></div>
      <section class="detail-section"><h3>Что получите</h3><ul class="check-list">${service.outcomes.map((item) => `<li><span class="check">✓</span><span>${item}</span></li>`).join("")}</ul></section>
      <section class="detail-section"><h3>Как работаем</h3><ul class="check-list">${service.scope.map((item, index) => `<li><span class="check">${index + 1}</span><span>${item}</span></li>`).join("")}</ul></section>
      <section class="detail-section"><h3>Пример</h3><button class="case-preview" data-action="case" data-id="${service.caseId}">
        <span class="case-thumb">${byCase(service.caseId).icon}</span><span><strong>${service.concept}</strong><small>Демо-концепт · посмотреть идею</small></span><span class="profile-arrow">›</span>
      </button></section>
      <p class="button-hint">Стоимость и сроки ориентировочные — точный объём обсудим по вашей задаче.</p>
      <div class="button-stack"><button class="primary-button" data-action="form" data-service="${service.id}">Обсудить эту услугу <span aria-hidden="true">→</span></button></div>`;
  }

  function caseTemplate() {
    const item = byCase(state.caseId);
    if (!item) return emptyTemplate("Не удалось найти пример.");
    return `
      <section class="page-head"><span class="eyebrow">${item.tag}</span><h1>${item.title}</h1><p>Визуальная идея для возможного проекта.</p></section>
      <div class="case-art" aria-label="Иллюстрация демо-концепта">
        <div class="case-mock" aria-hidden="true"><div class="window-dots"><i></i><i></i><i></i></div><div class="case-mock-top"></div><div class="case-mock-row"></div><div class="case-mock-row short"></div><div class="case-mock-cards"><i></i><i></i><i></i></div></div>
      </div>
      <div class="case-points">
        <article class="case-point"><small>Задача</small><p>${item.task}</p></article>
        <article class="case-point"><small>Идея решения</small><p>${item.solution}</p></article>
        <article class="case-point"><small>Результат сценария</small><p>${item.outcome}</p></article>
      </div>
      <div class="notice-card">Это демонстрационный концепт, а не опубликованный проект клиента. Реальные кейсы появятся после добавления подтверждённых работ.</div>
      <div class="button-stack"><button class="primary-button" data-action="form" data-service="${item.service}">Обсудить похожую задачу <span aria-hidden="true">→</span></button></div>`;
  }

  function formTemplate() {
    return `
      <section class="page-head"><span class="eyebrow">Первый шаг</span><h1>Расскажите о задаче</h1><p>Пара деталей — и продолжим в Telegram.</p></section>
      <form class="form-card" id="requestForm" novalidate>
        <div class="field"><label for="serviceSelect">Что нужно сделать?</label>
          <select id="serviceSelect" name="serviceId" required>
            <option value="">Выберите направление</option>
            ${services.map((service) => `<option value="${service.id}" ${state.draft.serviceId === service.id ? "selected" : ""}>${service.shortTitle}</option>`).join("")}
          </select><span class="field-error" id="serviceError">${state.formError === "service" ? "Выберите направление." : ""}</span>
        </div>
        <div class="field"><label for="description">Коротко о проекте</label><span class="field-hint">Что хотите улучшить или запустить?</span>
          <textarea id="description" name="description" maxlength="700" placeholder="Например: нужен сайт, чтобы клиенты могли записаться на консультацию.">${escapeHtml(state.draft.description)}</textarea>
          <span class="field-error" id="descriptionError">${state.formError === "description" ? "Добавьте пару слов о задаче." : ""}</span>
        </div>
        <div class="field"><label>Когда планируете начать?</label><div class="choice-row" data-choice-group="timing">
          ${["Можно обсудить", "В течение месяца", "Позже"].map((choice) => `<button type="button" class="choice-chip ${state.draft.timing === choice ? "is-selected" : ""}" data-action="choice" data-group="timing" data-value="${choice}">${choice}</button>`).join("")}
        </div></div>
        <div class="field"><label>Бюджет проекта</label><div class="choice-row" data-choice-group="budget">
          ${["Нужна оценка", "до 50 тыс.", "50–100 тыс.", "от 100 тыс."].map((choice) => `<button type="button" class="choice-chip ${state.draft.budget === choice ? "is-selected" : ""}" data-action="choice" data-group="budget" data-value="${choice}">${choice}</button>`).join("")}
        </div></div>
        ${canSubmit() ? `<div class="field"><label for="contact">Как с вами связаться?</label><span class="field-hint">${tgUsername() ? `Необязательно — мастер ответит вам в Telegram (@${escapeHtml(tgUsername())}).` : "Телефон, почта или @username — чтобы мастер мог ответить."}</span>
          <input id="contact" name="contact" maxlength="160" autocomplete="off" placeholder="${tgUsername() ? "Например, удобное время для связи" : "Например: +7 900 000-00-00"}" value="${escapeHtml(state.draft.contact)}">
          <span class="field-error" id="contactError">${state.formError === "contact" ? "Укажите, как с вами связаться." : ""}</span>
        </div>` : ""}
      </form>
      <div class="notice-card">${canSubmit() ? "На следующем шаге вы проверите заявку и отправите её мастеру одной кнопкой." : "Контакт и дополнительные данные не нужны. После проверки откроется чат с мастером, где вы сможете отправить подготовленный текст."}</div>
      <div class="button-stack"><button class="primary-button" data-action="review">Проверить заявку <span aria-hidden="true">→</span></button></div>`;
  }

  function reviewTemplate() {
    const service = byService(state.draft.serviceId);
    return `
      <section class="page-head"><span class="eyebrow">Проверьте детали</span><h1>Всё верно?</h1><p>${canSubmit() ? "Заявка придёт мастеру сразу после отправки." : "Дальше откроется Telegram с готовым сообщением."}</p></section>
      <div class="summary-list">
        <div class="summary-row"><div><strong>Направление</strong><p>${escapeHtml(service ? service.shortTitle : "Не выбрано")}</p></div><button class="edit-button" data-action="edit-form">Изменить</button></div>
        <div class="summary-row"><div><strong>Задача</strong><p>${escapeHtml(state.draft.description)}</p></div><button class="edit-button" data-action="edit-form">Изменить</button></div>
        <div class="summary-row"><div><strong>Срок</strong><p>${escapeHtml(state.draft.timing || "Не указан")}</p></div><button class="edit-button" data-action="edit-form">Изменить</button></div>
        <div class="summary-row"><div><strong>Бюджет</strong><p>${escapeHtml(state.draft.budget || "Не указан")}</p></div><button class="edit-button" data-action="edit-form">Изменить</button></div>
        ${canSubmit() ? `<div class="summary-row"><div><strong>Связь</strong><p>${escapeHtml([tgUsername() ? "@" + tgUsername() : "", state.draft.contact].filter(Boolean).join(" · ") || "Не указана")}</p></div><button class="edit-button" data-action="edit-form">Изменить</button></div>` : ""}
      </div>
      ${canSubmit() ? submitBlock() : `
      <div class="button-stack"><button class="primary-button" data-action="prepare-chat" ${state.busy ? "disabled" : ""}>${state.busy ? "Открываем Telegram…" : "Продолжить в Telegram"} <span aria-hidden="true">↗</span></button></div>
      <p class="button-hint">Заявка не отправится автоматически — проверьте и отправьте сообщение в чате.</p>`}`;
  }

  function submitBlock() {
    return `
      <div class="consent-list">
        <label class="consent-item"><input type="checkbox" data-consent="personal" ${state.consents.personal ? "checked" : ""}><span>Даю <a href="consent/" class="inline-link" data-action="open-policy" data-doc="consent/">согласие на обработку персональных данных</a> для ответа на заявку</span></label>
        <label class="consent-item"><input type="checkbox" data-consent="transfer" ${state.consents.transfer ? "checked" : ""}><span>Согласен(на) на передачу заявки через Telegram-бота и на почту Gmail (возможна обработка за пределами России)</span></label>
      </div>
      <p class="button-hint"><a href="privacy/" class="inline-link" data-action="open-policy" data-doc="privacy/">Политика обработки персональных данных</a></p>
      <p class="field-error" role="alert">${escapeHtml(state.sendError)}</p>
      <div class="button-stack">
        <button class="primary-button" data-action="submit-lead" ${state.busy ? "disabled" : ""}>${state.busy ? "Отправляем…" : "Отправить заявку"}</button>
        <button class="secondary-button" data-action="prepare-chat" ${state.busy ? "disabled" : ""}>Лучше напишу в чат сам(а)</button>
      </div>`;
  }

  function sentTemplate() {
    return `
      <section class="page-head"><span class="eyebrow">Готово</span><h1>Заявка отправлена</h1><p>Мастер получил вашу заявку и ответит вам в Telegram${state.draft.contact ? " или по указанному контакту" : ""}.</p></section>
      <div class="success-hero"><span class="success-icon" aria-hidden="true">✓</span></div>
      <div class="notice-card">Номер заявки: <strong>${escapeHtml(state.leadId)}</strong>. Обычно ответ приходит в течение одного-двух дней.</div>
      <div class="button-stack"><button class="primary-button" data-action="catalog">Вернуться к услугам</button><button class="secondary-button" data-action="open-chat">Написать мастеру в Telegram</button></div>`;
  }

  function confirmationTemplate() {
    return `
      <section class="page-head"><span class="eyebrow">Следующий шаг</span><h1>Сообщение готово</h1><p>Откройте чат с мастером, проверьте текст и нажмите «Отправить».</p></section>
      <div class="success-hero"><span class="success-icon" aria-hidden="true">✓</span></div>
      <div class="notice-card">Сообщение не отправляется автоматически. Если текст не появился в чате, скопируйте его ниже и вставьте вручную.</div>
      <div class="field message-preview"><label for="preparedMessage">Текст заявки</label><textarea id="preparedMessage" readonly rows="9">${escapeHtml(buildMessage())}</textarea></div>
      <button class="secondary-button" data-action="copy-message" type="button">Скопировать заявку</button>
      <div class="button-stack"><button class="primary-button" data-action="open-chat">Открыть чат <span aria-hidden="true">↗</span></button><button class="secondary-button" data-action="catalog">Вернуться к услугам</button></div>`;
  }

  function aboutTemplate() {
    return `
      <section class="page-head"><span class="eyebrow">Знакомство</span><h1>О мастере</h1><p>Работаю от вашей задачи — к простому и понятному цифровому решению.</p></section>
      <div class="about-art"><span class="profile-photo">ЦМ</span><span><strong>Цифровая мастерская</strong><small>Сайты · Telegram Mini Apps · AI</small></span></div>
      <section class="detail-section"><h3>Как строится работа</h3>
        <div class="steps">
          <div class="step"><span class="step-number">1</span><span><strong>Обсуждаем задачу</strong><small>Цель, аудитория и нужный результат</small></span></div>
          <div class="step"><span class="step-number">2</span><span><strong>Согласуем план</strong><small>Объём, сроки и ориентир по стоимости</small></span></div>
          <div class="step"><span class="step-number">3</span><span><strong>Создаём и запускаем</strong><small>Проверяем на телефоне и улучшаем по обратной связи</small></span></div>
        </div>
      </section>
      <div class="notice-card">Портфолио и условия сейчас представлены демо-примерами. Перед заказом согласуем состав работ, срок и точную стоимость.</div>
      <div class="button-stack"><button class="primary-button" data-action="form">Обсудить проект <span aria-hidden="true">→</span></button><button class="secondary-button" data-action="open-chat">Написать в Telegram</button></div>`;
  }

  function emptyTemplate(message) {
    return `<div class="empty-state">${escapeHtml(message)}<br><button class="text-button" data-action="catalog">Вернуться к услугам</button></div>`;
  }

  function templateForScreen() {
    const templates = {
      home: homeTemplate,
      catalog: catalogTemplate,
      service: serviceTemplate,
      case: caseTemplate,
      form: formTemplate,
      review: reviewTemplate,
      confirmation: confirmationTemplate,
      sent: sentTemplate,
      about: aboutTemplate
    };
    return (templates[state.screen] || homeTemplate)();
  }

  function render() {
    const nativeBack = tg && tg.initData && tg.BackButton && tg.isVersionAtLeast("6.1");
    const back = state.screen !== "home" && !nativeBack
      ? '<button class="text-button" data-action="back" type="button">← Назад</button>' : '';
    app.innerHTML = back + templateForScreen();
    app.scrollTop = 0;
    app.classList.remove("is-transitioning", "screen-enter");
    void app.offsetWidth;
    app.classList.add("screen-enter");
    updateNavigation();
    if (tg && tg.BackButton && tg.isVersionAtLeast("6.1")) {
      if (state.screen === "home") tg.BackButton.hide();
      else tg.BackButton.show();
    }
  }

  function updateNavigation() {
    const active = state.screen === "home" ? "home" :
      state.screen === "about" ? "about" :
      ["catalog", "service", "case"].includes(state.screen) ? "catalog" : "";
    navButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.nav === active);
    });
  }

  function animateThen(callback) {
    if (reduceMotion) { callback(); return; }
    app.classList.add("is-transitioning");
    window.setTimeout(() => {
      app.classList.remove("is-transitioning");
      callback();
    }, 120);
  }

  function buildMessage() {
    const service = byService(state.draft.serviceId);
    return [
      "Здравствуйте! Хочу обсудить проект.",
      `Направление: ${service ? service.shortTitle : "пока не выбрано"}.`,
      `Задача: ${state.draft.description}.`,
      `Срок: ${state.draft.timing || "не указан"}.`,
      `Бюджет: ${state.draft.budget || "не указан"}.`
    ].join("\n");
  }

  function openChat() {
    const url = `https://t.me/LiliyaKazatskaya?text=${encodeURIComponent(buildMessage())}`;
    try {
      if (tg && tg.initData && typeof tg.openTelegramLink === "function") tg.openTelegramLink(url);
      else window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      showToast("Не удалось открыть Telegram. Скопируйте заявку и откройте чат вручную.");
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(buildMessage());
      showToast("Заявка скопирована");
    } catch {
      const field = document.getElementById("preparedMessage");
      if (field) { field.focus(); field.select(); }
      showToast("Выделите текст заявки и выберите «Копировать».");
    }
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function collectForm() {
    const serviceId = document.getElementById("serviceSelect").value;
    const description = document.getElementById("description").value.trim();
    state.draft.serviceId = serviceId;
    state.draft.description = description;
    if (!serviceId) {
      state.formError = "service";
      render();
      document.getElementById("serviceSelect").focus();
      return false;
    }
    if (description.length < 8) {
      state.formError = "description";
      render();
      document.getElementById("description").focus();
      return false;
    }
    if (canSubmit()) {
      const contactField = document.getElementById("contact");
      state.draft.contact = String((contactField && contactField.value) || "").trim();
      if (!tgUsername() && !state.draft.contact) {
        state.formError = "contact";
        render();
        document.getElementById("contact").focus();
        return false;
      }
    }
    state.formError = "";
    return true;
  }

  async function submitLead() {
    if (state.busy) return;
    if (!state.consents.personal || !state.consents.transfer) {
      state.sendError = sendErrors.consent_required;
      render();
      return;
    }
    state.busy = true;
    state.sendError = "";
    render();
    let result = null;
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initData: tg.initData,
          serviceId: state.draft.serviceId,
          description: state.draft.description,
          timing: state.draft.timing,
          budget: state.draft.budget,
          contact: state.draft.contact,
          consentPersonal: "yes",
          consentTransfer: "yes",
          consentVersion: CONSENT_VERSION
        })
      });
      result = await response.json().catch(() => null);
    } catch {
      result = { ok: false, error: "network" };
    }
    state.busy = false;
    if (result && result.ok) {
      state.leadId = String(result.id || "");
      state.stack = [];
      if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("success");
      setScreen("sent", {}, false);
      return;
    }
    const code = result && result.error;
    state.sendError = sendErrors[code] || "Не удалось отправить заявку. Нажмите «Лучше напишу в чат сам(а)» — текст заявки подготовится автоматически.";
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred("error");
    render();
  }

  function openPolicy(doc) {
    const url = new URL(doc === "consent/" ? "consent/" : POLICY_URL, window.location.href).href;
    try {
      if (tg && typeof tg.openLink === "function") tg.openLink(url);
      else window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = url;
    }
  }

  function handleAction(target) {
    const action = target.dataset.action;
    if (!action) return;

    if (action === "back") {
      goBack();
    } else if (action === "copy-message") {
      return copyMessage();
    } else if (action === "catalog") {
      state.category = "all";
      setScreen("catalog");
    } else if (action === "category") {
      state.category = target.dataset.category || "all";
      setScreen("catalog");
    } else if (action === "filter") {
      state.category = target.dataset.category || "all";
      render();
    } else if (action === "service") {
      setScreen("service", { serviceId: target.dataset.id });
    } else if (action === "case") {
      setScreen("case", { caseId: target.dataset.id });
    } else if (action === "about") {
      setScreen("about");
    } else if (action === "form") {
      const categoryService = state.screen === "catalog" && state.category !== "all"
        ? services.find((service) => service.category === state.category) : null;
      const preset = target.dataset.service || (categoryService && categoryService.id);
      if (preset) state.draft.serviceId = preset;
      state.formError = "";
      setScreen("form");
    } else if (action === "choice") {
      const group = target.dataset.group;
      if (group === "timing" || group === "budget") {
        state.draft[group] = state.draft[group] === target.dataset.value ? "" : target.dataset.value;
        render();
      }
    } else if (action === "review") {
      if (collectForm()) setScreen("review");
    } else if (action === "edit-form") {
      if (state.stack.length && state.stack[state.stack.length - 1].screen === "form") state.stack.pop();
      animateThen(() => setScreen("form", {}, false));
    } else if (action === "prepare-chat") {
      setScreen("confirmation");
      openChat();
    } else if (action === "open-chat") {
      openChat();
    } else if (action === "submit-lead") {
      return submitLead();
    } else if (action === "open-policy") {
      openPolicy(target.dataset.doc);
    }
  }

  app.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    if (target.tagName === "A") event.preventDefault();
    handleAction(target);
  });

  app.addEventListener("input", (event) => {
    if (event.target.id === "description") state.draft.description = event.target.value;
    if (event.target.id === "contact") state.draft.contact = event.target.value;
  });

  app.addEventListener("change", (event) => {
    if (event.target.id === "serviceSelect") state.draft.serviceId = event.target.value;
    const consent = event.target.dataset && event.target.dataset.consent;
    if (consent === "personal" || consent === "transfer") {
      state.consents[consent] = event.target.checked;
      if (state.consents.personal && state.consents.transfer) state.sendError = "";
    }
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const destination = button.dataset.nav;
      if (destination === "home") {
        state.stack = [];
        setScreen("home", {}, false);
      } else if (destination === "catalog") {
        state.category = "all";
        setScreen("catalog");
      } else if (destination === "about") {
        setScreen("about");
      }
    });
  });

  document.getElementById("brandHome").addEventListener("click", () => {
    state.stack = [];
    setScreen("home", {}, false);
  });
  document.getElementById("aboutShortcut").addEventListener("click", () => setScreen("about"));

  initTelegram();
  render();
})();
