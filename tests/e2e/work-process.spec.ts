import { test, expect } from '@playwright/test';

test('demo projects are labelled honestly', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work [data-project]');
  await expect(cards).toHaveCount(3);
  await expect(page.locator('#work')).toContainText('// демо-проекты');
  await expect(cards.locator('h3')).toHaveText([
    'Лендинг для психолога',
    'Онлайн-запись для студии',
    'ИИ-агент для онлайн-школы',
  ]);
  for (const card of await cards.all()) {
    await expect(card.locator('[data-badge]')).toHaveText('демо');
    await expect(card.locator('[data-demo-link]')).toHaveText('демо скоро');
    await expect(card.locator('a[data-demo-link]')).toHaveCount(0);
  }
  await expect(page.locator('#work a.btn--primary[href="#contact"]')).toHaveText('[ обсудить проект ]');
});

test('process steps, guarantees and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#process [data-step-tag]')).toHaveText(['бриф', 'оценка', 'договор', 'разработка', 'запуск']);
  await expect(page.locator('#process [data-guarantee]')).toHaveCount(3);
  const cta = page.locator('#process a.btn--primary');
  await expect(cta).toHaveText('[ начать с бесплатной оценки ]');
  await expect(cta).toHaveAttribute('href', '#contact');
});
