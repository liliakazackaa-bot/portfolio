import { test, expect } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile);

test('mobile CTA appears after hero and hides at contact', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('[data-mobile-cta]');
  await expect(cta).toBeHidden();
  // Hero стал короче — прокручиваем к проектам, чтобы первый экран полностью ушёл.
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();
  await expect(cta.locator('a')).toHaveAttribute('href', '#contact');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(cta).toBeHidden();
});
