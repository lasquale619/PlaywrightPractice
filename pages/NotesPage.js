// @ts-check

const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

export class NotesPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.addNewNoteButton = page.getByTestId('add-new-note');
        this.noteCategorySelect = page.getByTestId('note-category');
        this.noteTitleInput = page.getByTestId('note-title');
        this.noteDescriptionInput = page.getByTestId('note-description');
        this.noteSubmitButton = page.getByTestId('note-submit');
        this.noteDeleteButton = page.getByTestId('note-delete');
        this.noteDeleteConfirmButton = page.getByTestId('note-delete-confirm');
        this.noNotesMessage = page.getByTestId('no-notes-message');
        this.noteCardTitle = page.getByTestId('note-card-title');
    }

    async closeCookieBanner() {
        // Fermer une éventuelle bannière de cookies
        const cookieButton = this.page.getByRole('button', { name: /accept|ok|got it/i });
        if (await cookieButton.isVisible().catch(() => false)) {
            await cookieButton.click();
        }
    }

    /**
     * @param {string} category
     * @param {string} title
     * @param {string} description
     */
    async createNote(category, title, description) {
        await this.addNewNoteButton.click();
        await this.noteCategorySelect.selectOption(category);
        await this.noteTitleInput.fill(title);
        await this.noteDescriptionInput.fill(description);
        await this.noteSubmitButton.click();
    }

    async getFirstNoteTitle() {
        return await this.noteCardTitle.first().innerText();
    }

    async deleteFirstNote() {
        await this.noteDeleteButton.first().click();
        await this.noteDeleteConfirmButton.click();
    }

    async getNoNotesMessage() {
        return await this.noNotesMessage.innerText();
    }

}
