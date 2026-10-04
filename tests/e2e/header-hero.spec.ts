import { test, expect } from '@playwright/test';

const H1 = 'Собираю сайты, приложения и ИИ-агентов';

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile);

  test('menu links and hero content', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('[data-header] nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['#services', '#work', '#process', '#about', '#faq']);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveAttribute('aria-label', H1);
    await expect(page.locator('h1 .mark')).toContainText('ИИ-агентов');
    await expect(page.locator('[data-hero-status]')).toContainText('available: ноябрь 2026');
    await expect(page.locator('[data-header] a.btn--primary')).toHaveAttribute('href', '#contact');
  });

  test('header gets background after scroll', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-header]')).not.toHaveClass(/is-scrolled/);
    await page.mouse.wheel(0, 200);
    await expect(page.locator('[data-header]')).toHaveClass(/is-scrolled/);
  });

  test('typewriter finishes with full text', async ({ page }) => {
    await page.goto('/');
    // innerText не включает скрытые (ещё не напечатанные) символы.
    await expect
      .poll(async () => (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim(), { timeout: 5000 })
      .toBe(H1 + '▊');
  });
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile);

  test('menu opens, Escape closes and returns focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-menu-toggle]');
    await expect(page.locator('[data-menu]')).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-menu]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-menu]')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('menu link closes menu', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-menu-toggle]').click();
    await page.locator('[data-menu] a[href="#faq"]').click();
    await expect(page.locator('[data-menu]')).toBeHidden();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('h1 is complete immediately', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('h1').innerText();
    expect(text.replace(/\s+/g, ' ')).toContain(H1);
  });
});
