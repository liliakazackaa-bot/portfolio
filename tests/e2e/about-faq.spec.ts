import { test, expect } from '@playwright/test';

test('about: photo, stack and links', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  const alt = await about.locator('img').getAttribute('alt');
  expect(alt && alt.length > 0).toBeTruthy();
  await expect(about.locator('[data-stack] li')).toHaveCount(10);
  await expect(about.locator('a', { hasText: 'github ↗' })).toHaveAttribute('href', 'https://github.com/username');
  await expect(about.locator('a', { hasText: 'telegram ↗' })).toHaveAttribute('href', 'https://t.me/LiliyaKazatskaya');
  await expect(about).not.toContainText('N лет');
  await expect(about.locator('a', { hasText: 'email ↗' })).toHaveAttribute('href', 'mailto:liliakazackaa@gmail.com');
});

test('faq: seven closed items, open by click and keyboard', async ({ page }) => {
  await page.goto('/');
  const items = page.locator('#faq details');
  await expect(items).toHaveCount(7);
  for (const d of await items.all()) await expect(d).not.toHaveAttribute('open', '');
  await items.nth(0).locator('summary').click();
  await expect(items.nth(0)).toHaveAttribute('open', '');
  await items.nth(1).locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(items.nth(1)).toHaveAttribute('open', '');
  await expect(page.locator('#faq a', { hasText: 'спросите в telegram ↗' })).toHaveAttribute('href', 'https://t.me/LiliyaKazatskaya');
});

test('footer: privacy link and closing line', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.locator('a', { hasText: 'политика конфиденциальности' })).toHaveAttribute('href', '/privacy');
  await expect(footer).toContainText('$ exit — спасибо, что дочитали_');
});
