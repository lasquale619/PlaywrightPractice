import { faker } from '@faker-js/faker';
import { test } from '../../fixtures/test.fixture';
import { RegisterPage } from '../../pages/RegisterPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigateToApp();
    await registerPage.openRegisterView();
});

test('successfully create a user account', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.createUser(faker.internet.email(), faker.internet.password({ length: 10 }), faker.person.fullName());
    await registerPage.verifySuccessMessage();
});

test.describe('Register - negative cases', () => {
    test('shows an error when passwords do not match', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.createUser(faker.internet.email(), 'password123', faker.person.fullName(), 'different123');
        await registerPage.verifyErrorMessage(/passwords don.t match/i);
    });

    test('shows an error when the email is already used', async ({ page }) => {
        const registerPage = new RegisterPage(page);

        await registerPage.createUser(process.env.USER1_EMAIL!, faker.internet.password({ length: 10 }), faker.person.fullName());
        await registerPage.verifyErrorMessage(/account already exists/i);
    });
});
