import path from 'path';
import { test as setup, expect } from './fixtures/test';

const users = [
    { name: 'user', email: process.env.USER1_EMAIL, password: process.env.USER1_PASSWORD, file: 'user.json' },
    { name: 'user2', email: process.env.USER2_EMAIL, password: process.env.USER2_PASSWORD, file: 'user2.json' },
];

for (const user of users) {
    setup(`authenticate with ${user.name}`, async ({ page }) => {
        if (!user.email || !user.password) {
            throw new Error(`Identifiants manquants pour ${user.name} : remplis le fichier .env (voir .env.example)`);
        }

        await page.goto('/notes/app/');
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByTestId('login-email').fill(user.email);
        await page.getByTestId('login-password').fill(user.password);
        await page.getByTestId('login-submit').click();
        await expect(page.getByTestId('home')).toBeVisible();

        await page.context().storageState({ path: path.join(__dirname, '../playwright/.auth', user.file) });
    });
}
