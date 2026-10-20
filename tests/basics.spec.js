// @ts-check
import { test, expect } from './fixtures/test';

test.describe('testing home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notes/app/');
  });

  test('verify welcome message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Notes App' })).toBeVisible();
  });

  test('verify the redirection to the registration page', async ({ page }) => {
    await expect(page.getByTestId('open-register-view')).toBeVisible();
    await page.getByTestId('open-register-view').click();
    await expect(page).toHaveURL(/register/);
  });
});
