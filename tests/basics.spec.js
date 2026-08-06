// @ts-check
/// <reference types="node" />
import { test, expect } from '@playwright/test';

// test.use({ storageState: { cookies: [], origins: [] } });
test.describe('testing home page', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/notes/app/');
  });

test.afterEach(async ({ }) => {
    console.log('Test completed');
  });

  test.beforeAll(async ({ }) => {
    console.log('Starting test suite');
  });

  test.afterAll(async ({ }) => {
    console.log('Test suite completed');
  });


  test('verify welcome message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Notes App' })).toBeVisible();
  });

  test('verify the redirection to the inscription page', async ({ page }) => {
    await expect(page.getByTestId('open-register-view')).toBeVisible();
    await page.getByTestId('open-register-view').click();
    await expect(page).toHaveURL(/register/);
  });
});
