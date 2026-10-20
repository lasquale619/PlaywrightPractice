import { type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigateToApp() {
    await this.page.goto('/notes/app/');
  }
}
