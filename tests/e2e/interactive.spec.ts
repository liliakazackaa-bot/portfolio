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
  // Фокус уходит в начало страницы, но плашка «перейти к содержимому» не всплывает.
  const skipTop = await page.locator('.skip-link').evaluate((el) => el.getBoundingClientRect().bottom);
  expect(skipTop).toBeLessThanOrEqual(0);
  await expect(page.locator('#top')).toBeFocused();
});

test('agent demo plays even when it is taller than the screen (large font)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  const demo = page.locator('[data-agent-demo]');
  await demo.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.evaluate(async () => {
    for (let i = 0; i < 12; i++) {
      window.scrollBy({ top: 200, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await expect(demo.locator('[data-line]').last()).toBeVisible({ timeout: 9000 });
});

test('production build never fakes success: demo mode is off on the site', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-form]')).toHaveAttribute('data-demo', 'false');
});

test('counters roll up to their final values when visible', async ({ page }) => {
  await page.goto('/');
  const counters = page.locator('[data-counter]');
  await expect(counters).toHaveCount(4);
  // До появления на экране значение сброшено в 0.
  await expect(counters.first().locator('[data-count-value]')).toHaveText('0');
  // «24/7» — не счётчик: при накрутке читалось бы как дата («12/7»), поэтому статично.
  await expect(counters.nth(3)).toContainText('24/7');
  await expect(counters.nth(3).locator('[data-count-value]')).toHaveCount(0);
  await page.locator('[data-stats]').scrollIntoViewIfNeeded();
  await expect(counters.locator('[data-count-value]')).toHaveText(['3', '2', '30'], { timeout: 4000 });
  // Срок первой версии — «от 2 недель», как в ТЗ, а не обещание ровно двух недель.
  await expect(counters.nth(1)).toContainText('от 2 нед.');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('counters show final values immediately', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-count-value]')).toHaveText(['3', '2', '30']);
  });
});

test.describe('form fields and demo success', () => {
  test('form has name, email and message fields', async ({ page }) => {
    await page.goto('/#contact');
    await expect(page.locator('label[for="f-name"]')).toContainText('Имя');
    await expect(page.locator('label[for="f-contact"]')).toContainText('Email');
    await expect(page.locator('label[for="f-task"]')).toContainText('Сообщение');
  });

  test('demo mode → visual success without any network request', async ({ page }) => {
    const reqs: string[] = [];
    page.on('request', (r) => r.url().includes('web3forms') && reqs.push(r.url()));
    await page.goto('/#contact');
    await page.evaluate(() => (document.querySelector<HTMLFormElement>('[data-form]')!.dataset.demo = 'true'));
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
