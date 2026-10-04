import { test, expect } from '@playwright/test';

test('three service cards with CTAs and prices', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#services [data-service-card]');
  await expect(cards).toHaveCount(3);
  for (const [id, text] of [
    ['site', '[ нужен сайт ]'],
    ['app', '[ обсудить приложение ]'],
    ['agent', '[ хочу ИИ-агента ]'],
  ]) {
    const cta = page.locator(`#services a[data-service="${id}"]`);
    await expect(cta).toHaveText(text);
    await expect(cta).toHaveAttribute('href', '#contact');
  }
  await expect(page.locator('#services a[data-service="unknown"]')).toHaveText('написать →');
  await expect(page.locator('#services [data-price]')).toHaveText(['от XX 000 ₽', 'от XX 000 ₽', 'от XX 000 ₽']);
});

test('bento layout: agents card is tallest on desktop, first on mobile', async ({ page, isMobile }) => {
  await page.goto('/');
  const box = async (id: string) => (await page.locator(`[data-service-card="${id}"]`).boundingBox())!;
  const [site, app, agent] = [await box('site'), await box('app'), await box('agent')];
  if (isMobile) {
    expect(agent.y).toBeLessThan(site.y);
    expect(agent.y).toBeLessThan(app.y);
  } else {
    expect(agent.height).toBeGreaterThan(site.height);
    expect(agent.height).toBeGreaterThan(app.height);
  }
});

test('agent demo plays to the end and replays', async ({ page }) => {
  await page.goto('/');
  const demo = page.locator('[data-agent-demo]');
  await expect(demo).toHaveAttribute('role', 'img');
  await expect(demo).toHaveAttribute('aria-label', 'Пример диалога ИИ-агента с клиентом: запись на консультацию');
  await demo.scrollIntoViewIfNeeded();
  const last = demo.locator('[data-line]').last();
  await expect(last).toHaveText('✓ запись создана · заявка передана специалисту');
  await expect(last).toBeVisible({ timeout: 9000 });
  await page.locator('[data-replay]').click();
  await expect(last).toBeHidden();
  await expect(last).toBeVisible({ timeout: 9000 });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('agent demo shows all lines immediately', async ({ page }) => {
    await page.goto('/');
    const lines = page.locator('[data-agent-demo] [data-line]');
    await expect(lines).toHaveCount(6);
    for (const l of await lines.all()) await expect(l).toBeVisible();
  });
});
