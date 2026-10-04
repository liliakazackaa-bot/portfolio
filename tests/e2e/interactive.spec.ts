import { test, expect } from '@playwright/test';

test('back-to-top appears after hero and returns to top', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('[data-to-top]');
  await expect(btn).toBeHidden();
  await expect(btn).toHaveAttribute('aria-label', 'Наверх');
  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(btn).toBeVisible();
  await btn.click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBeLessThan(5);
  await expect(btn).toBeHidden();
});

test('counters roll up to their final values when visible', async ({ page }) => {
  await page.goto('/');
  const counters = page.locator('[data-counter]');
  await expect(counters).toHaveCount(4);
  // До появления на экране значение сброшено в 0.
  await expect(counters.first().locator('[data-count-value]')).toHaveText('0');
  await page.locator('[data-stats]').scrollIntoViewIfNeeded();
  await expect(counters.locator('[data-count-value]')).toHaveText(['3', '2', '30', '24'], { timeout: 4000 });
  await expect(counters.nth(3)).toContainText('24/7');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('counters show final values immediately', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-count-value]')).toHaveText(['3', '2', '30', '24']);
  });
});

test.describe('form fields and demo success', () => {
  test('form has name, email and message fields', async ({ page }) => {
    await page.goto('/#contact');
    await expect(page.locator('label[for="f-name"]')).toContainText('Имя');
    await expect(page.locator('label[for="f-contact"]')).toContainText('Email');
    await expect(page.locator('label[for="f-task"]')).toContainText('Сообщение');
  });

  test('placeholder key → visual success without any network request', async ({ page }) => {
    const reqs: string[] = [];
    page.on('request', (r) => r.url().includes('web3forms') && reqs.push(r.url()));
    await page.goto('/#contact');
    await page.locator('#f-name').fill('Анна');
    await page.locator('#f-contact').fill('anna@mail.ru');
    await page.locator('label:has(input[name="service"][value="app"])').click();
    await page.locator('#f-task').fill('Нужна онлайн-запись');
    await page.locator('input[name="consent"]').check();
    await page.locator('[data-form] button[type="submit"]').click();
    const ok = page.locator('[data-form-success]');
    await expect(ok).toBeVisible();
    await expect(ok.locator('[data-success-check]')).toBeVisible();
    await expect(ok).toContainText('✓ заявка принята');
    expect(reqs).toHaveLength(0);
  });
});

test.describe('hamburger menu', () => {
  test.skip(({ isMobile }) => !isMobile);
  test('icon button toggles into a cross and opens the menu', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-menu-toggle]');
    await expect(toggle).toHaveAttribute('aria-label', 'Открыть меню');
    await expect(toggle.locator('[data-burger] span')).toHaveCount(3);
    await toggle.click();
    await expect(page.locator('[data-menu]')).toBeVisible();
    await expect(page.locator('[data-menu-close]')).toHaveAttribute('aria-label', 'Закрыть меню');
    await page.locator('[data-menu-close]').click();
    await expect(page.locator('[data-menu]')).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});
