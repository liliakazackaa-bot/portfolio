import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateName,
  validateContact,
  validateService,
  validateTask,
  validateConsent,
  validateForm,
  buildPayload,
  type FormValues,
} from '../../src/scripts/form-validate.ts';

const base: FormValues = {
  name: 'Анна',
  contact: '@anna_k',
  service: 'site',
  agentPlace: null,
  task: '',
  budget: null,
  consent: true,
};

test('name: trimmed 2–60 chars', () => {
  assert.equal(validateName('  Ан '), null);
  assert.equal(validateName('А'), 'Укажите имя (от 2 символов)');
  assert.equal(validateName('   '), 'Укажите имя (от 2 символов)');
  assert.notEqual(validateName('x'.repeat(61)), null);
});

test('contact: accepts email, @username and t.me links with surrounding spaces', () => {
  for (const ok of ['  Me@Mail.RU ', '@user_name', 'https://t.me/User_name', 't.me/username', ' http://t.me/abcde ']) {
    assert.equal(validateContact(ok), null, ok);
  }
});

test('contact: rejects malformed values', () => {
  for (const bad of ['@abc', 'mail@', '', 'просто текст', 't.me/ab']) {
    assert.equal(validateContact(bad), 'Укажите email или Telegram (@username)', bad);
  }
});

test('service: one of the four ids', () => {
  assert.equal(validateService(null), 'Выберите, что нужно');
  assert.equal(validateService('other'), 'Выберите, что нужно');
  assert.equal(validateService('agent'), null);
});

test('task: up to 1000 chars', () => {
  assert.equal(validateTask('x'.repeat(1000)), null);
  assert.equal(validateTask('x'.repeat(1001)), 'Не больше 1000 символов');
});

test('consent: must be true', () => {
  assert.equal(validateConsent(false), 'Нужно согласие на обработку данных');
  assert.equal(validateConsent(true), null);
});

test('validateForm: empty form has four errors', () => {
  const r = validateForm({ ...base, name: '', contact: '', service: null, consent: false });
  assert.ok(r.name && r.contact && r.service && r.consent);
  assert.equal(r.task, null);
});

test('buildPayload: drops agentPlace unless service is agent', () => {
  const p = buildPayload({ ...base, service: 'site', agentPlace: 'crm' }, 'K');
  assert.equal('agentPlace' in p, false);
  assert.equal(p.subject, 'Заявка с сайта: Сайт');
  assert.equal(p.access_key, 'K');
  assert.equal(p.from_name, 'Сайт-портфолио');
});

test('buildPayload: keeps agentPlace for agent and trims values', () => {
  const p = buildPayload({ ...base, name: '  Анна ', contact: ' @anna_k ', service: 'agent', agentPlace: 'crm' }, 'K');
  assert.equal(p.agentPlace, 'crm');
  assert.equal(p.name, 'Анна');
  assert.equal(p.contact, '@anna_k');
  assert.equal(p.subject, 'Заявка с сайта: ИИ-агент');
});

import { buildTelegramText, telegramLink } from '../../src/scripts/form-validate.ts';

test('buildTelegramText: readable request with only filled fields', () => {
  const t = buildTelegramText({ ...base, name: ' Анна ', contact: '@anna_k', service: 'agent', agentPlace: 'crm', task: ' Нужна запись ', budget: '50–150 тыс' });
  assert.equal(
    t,
    ['Здравствуйте! Заявка с сайта.', 'Имя: Анна', 'Контакт: @anna_k', 'Что нужно: ИИ-агент', 'Где будет работать агент: CRM', 'Бюджет: 50–150 тыс', 'Задача: Нужна запись'].join('\n'),
  );
  const short = buildTelegramText({ ...base, service: 'site', agentPlace: 'crm' });
  assert.equal(short.includes('Где будет работать агент'), false);
  assert.equal(short.includes('Бюджет'), false);
  assert.equal(short.includes('Задача'), false);
});

test('telegramLink: t.me link with encoded text', () => {
  assert.equal(telegramLink('https://t.me/LiliyaKazatskaya', 'Имя: А & Б'), 'https://t.me/LiliyaKazatskaya?text=' + encodeURIComponent('Имя: А & Б'));
});
