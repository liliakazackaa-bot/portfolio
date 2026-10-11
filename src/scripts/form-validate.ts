// Чистые функции валидации формы заявки — без DOM, покрыты юнит-тестами.

export type FieldError = string | null;

export interface FormValues {
  name: string;
  contact: string;
  service: string | null;
  agentPlace: string | null;
  task: string;
  budget: string | null;
  consent: boolean;
}

const SERVICES = ['site', 'app', 'agent', 'unknown'] as const;
const SERVICE_LABELS: Record<string, string> = {
  site: 'Сайт',
  app: 'Приложение',
  agent: 'ИИ-агент',
  unknown: 'Не знаю',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TG_HANDLE = /^@[A-Za-z0-9_]{5,32}$/;
const TG_LINK = /^(https?:\/\/)?t\.me\/[A-Za-z0-9_]{5,32}\/?$/i;

export function validateName(v: string): FieldError {
  const len = v.trim().length;
  return len >= 2 && len <= 60 ? null : 'Укажите имя (от 2 символов)';
}

export function validateContact(v: string): FieldError {
  const s = v.trim();
  return EMAIL.test(s) || TG_HANDLE.test(s) || TG_LINK.test(s) ? null : 'Укажите email или Telegram (@username)';
}

export function validateService(v: string | null): FieldError {
  return v !== null && (SERVICES as readonly string[]).includes(v) ? null : 'Выберите, что нужно';
}

export function validateTask(v: string): FieldError {
  return v.length <= 1000 ? null : 'Не больше 1000 символов';
}

export function validateConsent(v: boolean): FieldError {
  return v ? null : 'Нужно согласие на обработку данных';
}

export function validateForm(v: FormValues): Record<'name' | 'contact' | 'service' | 'task' | 'consent', FieldError> {
  return {
    name: validateName(v.name),
    contact: validateContact(v.contact),
    service: validateService(v.service),
    task: validateTask(v.task),
    consent: validateConsent(v.consent),
  };
}

export function buildPayload(v: FormValues, accessKey: string): Record<string, string> {
  const service = v.service ?? 'unknown';
  const payload: Record<string, string> = {
    access_key: accessKey,
    from_name: 'Сайт-портфолио',
    subject: `Заявка с сайта: ${SERVICE_LABELS[service] ?? 'Не знаю'}`,
    name: v.name.trim(),
    contact: v.contact.trim(),
    service: SERVICE_LABELS[service] ?? service,
  };
  if (service === 'agent' && v.agentPlace) payload.agentPlace = v.agentPlace;
  if (v.task.trim()) payload.task = v.task.trim();
  if (v.budget) payload.budget = v.budget;
  return payload;
}

const PLACE_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  site: 'Сайт',
  crm: 'CRM',
  unknown: 'Пока не знаю',
};

/** Текст заявки для отправки в Telegram — только заполненные поля. */
export function buildTelegramText(v: FormValues): string {
  const service = v.service ?? 'unknown';
  const lines = [
    'Здравствуйте, Лилия! Заявка с сайта.',
    `Имя: ${v.name.trim()}`,
    `Контакт: ${v.contact.trim()}`,
    `Что нужно: ${SERVICE_LABELS[service] ?? 'Не знаю'}`,
  ];
  if (service === 'agent' && v.agentPlace) lines.push(`Где будет работать агент: ${PLACE_LABELS[v.agentPlace] ?? v.agentPlace}`);
  if (v.budget) lines.push(`Бюджет: ${v.budget}`);
  if (v.task.trim()) lines.push(`Задача: ${v.task.trim()}`);
  return lines.join('\n');
}

/** Ссылка на чат в Telegram с готовым текстом сообщения. */
export function telegramLink(chatUrl: string, text: string): string {
  return `${chatUrl}?text=${encodeURIComponent(text)}`;
}
