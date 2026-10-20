import { faker } from '@faker-js/faker';
import { test } from './fixtures/test';
import { RegisterPage } from '../pages/RegisterPage';

test.use({ storageState: { cookies: [], origins: [] } });

test('successfully create a user account', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.navigateToApp();
    await registerPage.openRegisterView();
    await registerPage.createUser(faker.internet.email(), faker.internet.password({ length: 10 }), faker.person.fullName());
    await registerPage.verifySuccessMessage();
});
