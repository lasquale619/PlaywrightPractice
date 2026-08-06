const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
 
export class RegisterPage extends BasePage {
 
    /**
       * @param {import('@playwright/test').Page} page
       */
 
    constructor(page) {
        super(page);
 
        this.createAccountButton = page.getByTestId("open-register-view");
        this.emailInput = page.getByTestId('register-email');
        this.passwordInput = page.getByTestId('register-password');
        this.nameInput = page.getByTestId('register-name');
        this.confirmPasswordInput = page.getByTestId('register-confirm-password');
        this.submitButton = page.getByTestId('register-submit');
        this.successMessage = page.getByText('User account created successfully');
 
 
    };
 
    async openRegisterView() {
        await this.createAccountButton.click();
    };
 
    async createUser(email, password, name) {
 
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.nameInput.fill(name);
        await this.confirmPasswordInput.fill(password);
        await this.submitButton.click();
 
    };
 
    async verifySuccessMessage() {
        await expect(this.successMessage).toContainText("User account created successfully");
    };
 
 
 
 
};