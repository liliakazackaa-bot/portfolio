import { test, expect } from '@playwright/test';

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('everything is visible immediately', async ({ page }) => {
    await page.goto('/');
    const states = await page.locator('.reveal').evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, transform: s.transform };
      }),
    );
    expect(states.length).toBeGreaterThan(10);
    for (const s of states) {
      expect(s.opacity).toBe('1');
      expect(s.transform).toBe('none');
    }
  });
});

test('reveal elements become visible after scrolling through the page', async ({ page }) => {
  await page.goto('/');
  // Плавно проходим страницу, чтобы каждый блок побывал в экране.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(800);
  // Все блоки, прошедшие верхние 70% экрана (в т.ч. ушедшие выше), должны быть полностью видимы.
  const notVisible = await page.locator('.reveal').evaluateAll((els) =>
    els
      .filter((el) => el.getBoundingClientRect().bottom < window.innerHeight * 0.7)
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
  );
  expect(notVisible).toBe(0);
});

test('budgets: JS, fonts, no external requests', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const entries = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((e) => {
      const r = e as PerformanceResourceTiming;
      return { name: r.name, size: r.transferSize, type: r.initiatorType };
    }),
  );
  const js = entries.filter((e) => e.name.endsWith('.js')).reduce((a, e) => a + e.size, 0);
  const fonts = entries.filter((e) => e.name.endsWith('.woff2')).reduce((a, e) => a + e.size, 0);
  expect(js).toBeLessThanOrEqual(15_360);
  expect(fonts).toBeLessThanOrEqual(122_880);
  for (const e of entries) expect(new URL(e.name).origin).toBe('http://localhost:4321');
});
