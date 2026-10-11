import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

test('meta, open graph, canonical and JSON-LD', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Разрабатываю сайты, веб-приложения и ИИ-агентов под ключ: от идеи до запуска и поддержки. Фиксированная смета, работа по договору.',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Лилия/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'http://portfolio.liliakdy.beget.tech/og.png');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://portfolio.liliakdy.beget.tech/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const graph = JSON.parse(raw!)['@graph'] as Array<Record<string, any>>;
  const person = graph.find((n) => n['@type'] === 'Person')!;
  expect(person.name).toBe('Лилия');
  const service = graph.find((n) => n['@type'] === 'ProfessionalService')!;
  expect(service.hasOfferCatalog.itemListElement).toHaveLength(3);
});

test('robots and sitemap are published', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap: http://portfolio.liliakdy.beget.tech/sitemap-index.xml');
  expect((await request.get('/sitemap-index.xml')).ok()).toBeTruthy();
  expect((await request.get('/og.png')).ok()).toBeTruthy();
});

test('privacy page', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('h1')).toHaveText('Политика обработки персональных данных');
  await expect(page.locator('main')).toContainText('Telegram');
  await expect(page.locator('main')).toContainText('liliakazackaa@gmail.com');
});

test('404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.locator('main')).toContainText('error 404');
  await expect(page.locator('main a[href="/"]')).toHaveText('[ вернуться на главную ]');
});

for (const path of ['/', '/privacy', '/404']) {
  test(`axe: no serious or critical violations on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}

test.describe('responsive', () => {
  test.skip(({ isMobile }) => isMobile);

  for (const width of [320, 360, 768, 1440]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(sw).toBeLessThanOrEqual(iw);
    });
  }

  for (const width of [320, 360]) test(`no horizontal scroll at ${width}px with 200% font size (Review Focus 5)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(sw).toBeLessThanOrEqual(iw);
  });

  test('screenshots for manual review', async ({ page }) => {
    mkdirSync('test-results/screens', { recursive: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.screenshot({ path: `test-results/screens/home-${width}.png`, fullPage: true });
    }
  });
});
