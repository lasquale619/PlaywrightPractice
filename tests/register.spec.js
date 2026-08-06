// @ts-check
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../pages/RegisterPage';
 
const { test, expect } = require("@playwright/test");
test.use({ storageState: { cookies: [], origins: [] } });
test('successfully create a user account', async ({ page }) => {
 
    const registerPage = new RegisterPage(page);
 
    await registerPage.navigateToApp();
    await registerPage.openRegisterView();
    await registerPage.createUser(faker.internet.email(), '123456', faker.person.fullName());
    await registerPage.verifySuccessMessage();
 
 
});