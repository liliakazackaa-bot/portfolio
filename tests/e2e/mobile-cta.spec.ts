import { test, expect } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile);

test('mobile CTA appears after hero and hides at contact', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('[data-mobile-cta]');
  await expect(cta).toBeHidden();
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();
  await expect(cta.locator('a')).toHaveAttribute('href', '#contact');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(cta).toBeHidden();
});
