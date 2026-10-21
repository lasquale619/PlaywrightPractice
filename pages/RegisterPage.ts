import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
    readonly createAccountButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly nameInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.createAccountButton = page.getByTestId('open-register-view');
        this.emailInput = page.getByTestId('register-email');
        this.passwordInput = page.getByTestId('register-password');
        this.nameInput = page.getByTestId('register-name');
        this.confirmPasswordInput = page.getByTestId('register-confirm-password');
        this.submitButton = page.getByTestId('register-submit');
        this.successMessage = page.getByText('User account created successfully');
    }

    async openRegisterView() {
        await this.createAccountButton.click();
    }

    async createUser(email: string, password: string, name: string, confirmPassword = password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.nameInput.fill(name);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.submitButton.click();
    }

    async verifySuccessMessage() {
        await expect(this.successMessage).toBeVisible();
    }

    async verifyErrorMessage(message: RegExp) {
        await expect(this.page.getByText(message)).toBeVisible();
    }
}
