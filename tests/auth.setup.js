import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const authFile2 = path.join(__dirname, '../playwright/.auth/user2.json');

setup.beforeEach(async ({ page }) => {
    // Bloquer les ressources inutiles
    await page.route("**/*", (route) => {
        const url = route.request().url();
        if (
            url.includes("ads") ||
            url.includes("socket.io") ||
            url.includes("analytics")
        ) {
            route.abort();
        } else {
            route.continue();
        }
    });
});

setup('authenticate withe user', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/notes/app/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByTestId('login-email').fill('playwright_test1@gmail.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('home')).toBeVisible();

    await page.context().storageState({ path: authFile });
});

setup('authenticate withe user2', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/notes/app/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByTestId('login-email').fill('testlogiciel@gmail.com');
    await page.getByTestId('login-password').fill('123456');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('home')).toBeVisible();

    await page.context().storageState({ path: authFile2 });
});