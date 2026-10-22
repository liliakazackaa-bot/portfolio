import { test, expect } from '@playwright/test';

test('base document', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle('Цифровая мастерская — сайты, приложения и ИИ-агенты для экспертов и бизнеса');
  await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
  // Браузер отдаёт цвет в oklch — переводим в RGB через canvas.
  const [r, g, b] = await page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
  });
  for (const [got, want] of [[r, 6], [g, 10], [b, 8]]) expect(Math.abs(got - want)).toBeLessThanOrEqual(2);
});
