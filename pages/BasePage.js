// @ts-check;
export class BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */

  constructor(page) {
    this.page = page;
  };

  async navigateToApp() {
        await this.page.goto('https://practice.expandtesting.com/notes/app/');
};
}