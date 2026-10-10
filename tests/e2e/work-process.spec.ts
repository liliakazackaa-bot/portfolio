import { test, expect } from '@playwright/test';

test('real project first, demo projects labelled honestly', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work [data-project]');
  await expect(cards).toHaveCount(3);
  await expect(cards.locator('h3')).toHaveText([
    'Сайт по ведической астрологии',
    'Онлайн-запись для студии',
    'ИИ-агент для онлайн-школы',
  ]);
  // Реальный проект: бейдж «в работе у клиентов» не нужен — просто «проект» и живая ссылка.
  const real = cards.nth(0);
  await expect(real.locator('[data-badge]')).toHaveText('проект');
  await expect(real.locator('a[data-demo-link]')).toHaveText('открыть сайт ↗');
  await expect(real.locator('a[data-demo-link]')).toHaveAttribute('href', 'http://vedastrologld.ru/');
  // Демо остаются честно подписанными.
  for (const i of [1, 2]) {
    await expect(cards.nth(i).locator('[data-badge]')).toHaveText('демо');
    await expect(cards.nth(i).locator('[data-demo-link]')).toHaveText('демо скоро');
  }
  await expect(page.locator('#work')).not.toContainText('// демо-проекты:');
  await expect(page.locator('#work a.btn--primary[href="#contact"]')).toHaveText('[ обсудить проект ]');
});

test('about text speaks about beauty and creativity', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  await expect(about).toContainText('Я Лилия');
  await expect(about).toContainText('красот');
  await expect(about).toContainText(/творчеств/i);
  await expect(about).not.toContainText('Начинала с сайтов');
});

test('process steps, guarantees and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#process [data-step-tag]')).toHaveText(['бриф', 'оценка', 'договор', 'разработка', 'запуск']);
  await expect(page.locator('#process [data-guarantee]')).toHaveCount(3);
  const cta = page.locator('#process a.btn--primary');
  await expect(cta).toHaveText('[ начать с бесплатной оценки ]');
  await expect(cta).toHaveAttribute('href', '#contact');
});
