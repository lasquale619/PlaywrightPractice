import { test as base } from '@playwright/test';

// Pubs, analytics et websockets ralentissent l'app et cachent parfois les boutons.
const BLOCKED_URLS = /ads|doubleclick|googlesyndication|pagead|adservice|admanager|adframe|socket\.io|analytics/i;

export const test = base.extend<{ blockAds: void }>({
  // Fixture automatique : s'applique à chaque test qui importe ce fichier.
  blockAds: [async ({ page }, use) => {
    await page.route(BLOCKED_URLS, route => route.abort());
    await use();
  }, { auto: true }],
});

export { expect } from '@playwright/test';
