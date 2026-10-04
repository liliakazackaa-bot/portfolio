import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';

// Автономный файл для мессенджеров: открывается по file://, всё внутри.
const FILE = pathToFileURL(resolve('dist-single/index.html')).href;

test.skip(({ isMobile }) => !isMobile, 'проверяем на мобильном размере');

test('single file loads with zero external requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith('data:') && !u.startsWith('file:') && !u.startsWith('blob:')) external.push(u);
  });
  const failed: string[] = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto(FILE);
  await page.waitForLoadState('load');
  expect(external).toEqual([]);
  expect(failed).toEqual([]);
  await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Собираю сайты, приложения и ИИ-агентов');
  // Шрифты встроены и загружены.
  const fonts = await page.evaluate(async () => {
    const onest = await document.fonts.load('800 40px "Onest Variable"', 'Собираю');
    const mono = await document.fonts.load('400 14px "JetBrains Mono Variable"', 'статус');
    return [...onest, ...mono].map((f) => f.status);
  });
  expect(fonts.length).toBeGreaterThanOrEqual(2);
  expect(fonts.every((s) => s === 'loaded')).toBe(true);
  // Фото встроено.
  const photo = page.locator('#about img');
  await photo.scrollIntoViewIfNeeded(); // у фото loading="lazy"
  await expect
    .poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  expect(await photo.getAttribute('src')).toMatch(/^data:image\//);
  expect(statSync('dist-single/index.html').size).toBeLessThan(1_500_000);
});

test('single file: interactive elements work on mobile', async ({ page }) => {
  await page.goto(FILE);
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('[data-menu]')).toBeVisible();
  await page.locator('[data-menu] a[href="#faq"]').click();
  await expect(page.locator('[data-menu]')).toBeHidden();
  await expect(page.locator('[data-to-top]')).toBeVisible();
  await page.locator('[data-stats]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count-value]').nth(2)).toHaveText('30', { timeout: 4000 });
  await page.locator('#f-name').fill('Анна');
  await page.locator('#f-contact').fill('anna@mail.ru');
  await page.locator('label:has(input[name="service"][value="site"])').click();
  await page.locator('input[name="consent"]').check();
  await page.locator('[data-form] button[type="submit"]').click();
  await expect(page.locator('[data-form-success]')).toBeVisible();
});

test('single file: privacy link works inside the file', async ({ page }) => {
  await page.goto(FILE);
  const link = page.locator('footer a', { hasText: 'политика конфиденциальности' });
  await expect(link).toHaveAttribute('href', '#privacy');
  await link.click();
  await expect(page.locator('#privacy h2').first()).toBeVisible();
});

test.describe('without JavaScript (preview in messenger)', () => {
  test.use({ javaScriptEnabled: false });
  test('all content is readable', async ({ page }) => {
    await page.goto(FILE);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#services')).toContainText('ИИ-агенты, которые берут рутину на себя');
    await expect(page.locator('[data-count-value]')).toHaveText(['3', '2', '30', '24']);
    await expect(page.locator('#faq details')).toHaveCount(7);
  });
});
