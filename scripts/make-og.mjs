// Снимает первый экран в 1200×630 и сохраняет в public/og.png (запускать при работающем preview).
import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
const local = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch(existsSync(local) ? { executablePath: local } : {});
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.emulateMedia({ reducedMotion: 'reduce' });
await p.goto(process.argv[2] ?? 'http://localhost:4321');
await p.addStyleTag({ content: '[data-header]{display:none}.hero{padding-top:56px}' });
await p.waitForTimeout(300);
await p.screenshot({ path: 'public/og.png' });
await b.close();
