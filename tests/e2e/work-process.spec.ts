import { test, expect } from '@playwright/test';

test('two real projects first, agent demo labelled honestly', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work [data-project]');
  await expect(cards).toHaveCount(3);
  await expect(cards.locator('h3')).toHaveText([
    'Атма Джйотиш — сайт ведического астролога',
    'Среда — концепция интерьера',
    'ИИ-агент для онлайн-школы',
  ]);
  const links = [['https://vedastrologld.ru/'], ['http://liliakdy.beget.tech/']];
  for (const [i, [href]] of links.entries()) {
    await expect(cards.nth(i).locator('[data-badge]')).toHaveText('проект');
    await expect(cards.nth(i).locator('a[data-demo-link]')).toHaveText('открыть сайт ↗');
    await expect(cards.nth(i).locator('a[data-demo-link]')).toHaveAttribute('href', href);
  }
  await expect(cards.nth(2).locator('[data-badge]')).toHaveText('демо');
  await expect(cards.nth(2).locator('[data-demo-link]')).toHaveText('демо скоро');
  await expect(page.locator('#work a.btn--primary[href="#contact"]')).toHaveText('[ обсудить проект ]');
});

test('about text speaks about beauty and creativity', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  await expect(about).toContainText('Цифровая мастерская');
  await expect(about).not.toContainText('Лилия');
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
