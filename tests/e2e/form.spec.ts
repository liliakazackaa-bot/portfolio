import { test, expect, type Page, type Request } from '@playwright/test';

const API = 'https://api.web3forms.com/**';

async function fillValid(page: Page) {
  await page.locator('#f-name').fill('Анна');
  await page.locator('#f-contact').fill('@anna_k');
  await page.locator('label:has(input[name="service"][value="site"])').click();
  await page.locator('input[name="consent"]').check();
}

function track(page: Page) {
  const reqs: Request[] = [];
  page.on('request', (r) => {
    if (r.url().startsWith('https://api.web3forms.com')) reqs.push(r);
  });
  return reqs;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/#contact');
  // Ключ на сайте — заглушка (демо-режим). Здесь проверяем настоящую отправку.
  await page.evaluate(() => (document.querySelector<HTMLFormElement>('[data-form]')!.dataset.demo = 'false'));
});

test('empty submit shows four errors, focuses name, sends nothing', async ({ page }) => {
  const reqs = track(page);
  await page.locator('[data-form] button[type="submit"]').click();
  for (const f of ['name', 'contact', 'service', 'consent']) {
    await expect(page.locator(`#${f}-error`)).not.toBeEmpty();
  }
  await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#f-name')).toBeFocused();
  expect(reqs).toHaveLength(0);
});

test('service CTA preselects chip and reveals agent place', async ({ page }) => {
  await page.goto('/');
  await page.locator('#services a[data-service="agent"]').click();
  await expect(page.locator('input[name="service"][value="agent"]')).toBeChecked();
  await expect(page.locator('[data-agent-place]')).toBeVisible();
});

test('switching away from agent hides and clears agent place (Review Focus 4)', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: { success: true } }));
  const reqs = track(page);
  await fillValid(page);
  await page.locator('label:has(input[name="service"][value="agent"])').click();
  await page.locator('label:has(input[name="agentPlace"][value="crm"])').click();
  await page.locator('label:has(input[name="service"][value="site"])').click();
  await expect(page.locator('[data-agent-place]')).toBeHidden();
  await page.locator('[data-form] button[type="submit"]').click();
  await expect(page.locator('[data-form-success]')).toBeVisible();
  const body = reqs[0].postDataJSON();
  expect(body.agentPlace).toBeUndefined();
  expect(body.subject).toBe('Заявка с сайта: Сайт');
});

test('successful submit replaces form with confirmation', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: { success: true } }));
  await fillValid(page);
  await page.locator('[data-form] button[type="submit"]').click();
  const ok = page.locator('[data-form-success]');
  await expect(ok).toBeVisible();
  await expect(ok).toContainText('✓ заявка принята');
  await expect(ok).toBeFocused();
  await expect(page.locator('[data-form]')).toBeHidden();
  await expect(page.locator('[data-form-status]')).toContainText(/заявка принята/i);
});

test('double click sends exactly one request (Review Focus 2)', async ({ page }) => {
  await page.route(API, async (r) => {
    await new Promise((res) => setTimeout(res, 500));
    await r.fulfill({ json: { success: true } });
  });
  const reqs = track(page);
  await fillValid(page);
  await page.locator('[data-form] button[type="submit"]').dblclick();
  await expect(page.locator('[data-form-success]')).toBeVisible();
  expect(reqs).toHaveLength(1);
});

test('HTTP 200 with success:false shows error and keeps data (Review Focus 3)', async ({ page }) => {
  await page.route(API, (r) => r.fulfill({ json: { success: false, message: 'Invalid access key' } }));
  await fillValid(page);
  await page.locator('[data-form] button[type="submit"]').click();
  await expect(page.locator('[data-form-error]')).toContainText('не удалось отправить');
  await expect(page.locator('[data-form-success]')).toBeHidden();
  await expect(page.locator('#f-name')).toHaveValue('Анна');
  await expect(page.locator('[data-form] button[type="submit"]')).toBeEnabled();
});

test('network failure shows the same error', async ({ page }) => {
  await page.route(API, (r) => r.abort());
  await fillValid(page);
  await page.locator('[data-form] button[type="submit"]').click();
  await expect(page.locator('[data-form-error]')).toContainText('не удалось отправить');
});

test('honeypot is present and hidden; no-JS fallback attributes set', async ({ page }) => {
  const form = page.locator('[data-form]');
  await expect(form).toHaveAttribute('method', /post/i);
  await expect(form).toHaveAttribute('action', 'https://api.web3forms.com/submit');
  await expect(form.locator('input[name="botcheck"]')).toBeHidden();
  await expect(form.locator('input[name="access_key"]')).toHaveValue('YOUR_ACCESS_KEY');
  await expect(form.locator('input[name="redirect"]')).toHaveValue('https://liliya-kazatskaya.netlify.app/#contact');
});

test('contact error appears on blur', async ({ page }) => {
  await page.locator('#f-contact').fill('abc');
  await page.locator('#f-name').focus();
  await expect(page.locator('#contact-error')).toHaveText('Укажите email или Telegram (@username)');
  await page.locator('#f-contact').fill('abc@mail.ru');
  await page.locator('#f-name').focus();
  await expect(page.locator('#contact-error')).toBeEmpty();
});
