import { faker } from '@faker-js/faker';
import { test, expect } from '../../fixtures/test.fixture';
import { LoginPage } from '../../pages/LoginPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login - negative cases', () => {
    test.beforeEach(async ({ page }) => {
        await new LoginPage(page).open();
    });

    test('shows an error with a wrong password', { tag: '@CT-CNX-02' }, async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(process.env.USER1_EMAIL!, 'wrong-password');

        await loginPage.verifyErrorMessage(/incorrect email address or password/i);
        await expect(page).toHaveURL(/login/);
    });

    test('shows an error with an unknown email', { tag: '@CT-CNX-03' }, async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(faker.internet.email(), faker.internet.password({ length: 10 }));

        await loginPage.verifyErrorMessage(/incorrect email address or password/i);
    });
});
