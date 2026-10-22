import { test, expect } from '@playwright/test';

test('site form sends the request to Telegram with a prefilled message', async ({ page, context }) => {
  const web3: string[] = [];
  page.on('request', (r) => r.url().includes('web3forms') && web3.push(r.url()));
  await page.goto('/#contact');
  await expect(page.locator('[data-form]')).toHaveAttribute('data-channel', 'telegram');
  await page.locator('#f-name').fill('Анна');
  await page.locator('#f-contact').fill('anna@mail.ru');
  await page.locator('label:has(input[name="service"][value="site"])').click();
  await page.locator('#f-task').fill('Нужен лендинг');
  await page.locator('input[name="consent"]').check();
  await expect(page.locator('[data-form] button[type="submit"]')).toHaveText('[ отправить в telegram ]');

  // Тестовая среда без интернета: отвечаем за t.me сами.
  await context.route('https://t.me/**', (r) => r.fulfill({ body: 'telegram' }));
  const popupPromise = context.waitForEvent('page');
  await page.locator('[data-form] button[type="submit"]').click();
  const popup = await popupPromise;
  await popup.waitForURL(/t\.me/);
  const url = new URL(popup.url());
  expect(url.origin + url.pathname).toBe('https://t.me/LiliyaKazatskaya');
  const text = url.searchParams.get('text')!;
  expect(text).toContain('Имя: Анна');
  expect(text).toContain('Контакт: anna@mail.ru');
  expect(text).toContain('Что нужно: Сайт');
  expect(text).toContain('Задача: Нужен лендинг');

  const done = page.locator('[data-form-telegram]');
  await expect(done).toBeVisible();
  await expect(done).toContainText('нажмите «Отправить» в Telegram');
  await expect(done.locator('a')).toHaveAttribute('href', popup.url());
  await expect(page.locator('[data-form-success]')).toBeHidden();
  expect(web3).toHaveLength(0);
});

test('privacy page describes Telegram delivery', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('main')).toContainText('Telegram');
  await expect(page.locator('main')).toContainText('за пределами Российской Федерации');
  await expect(page.locator('main')).toContainText('Чугунов Сергей Владимирович');
});
