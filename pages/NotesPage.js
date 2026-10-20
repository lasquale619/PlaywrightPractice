// @ts-check
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
        this.noteCardTitle = page.getByTestId('note-card-title');
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

    /**
     * @param {string} title
     */
    noteTitle(title) {
        return this.noteCardTitle.filter({ hasText: title });
    }

    /**
     * Supprime la note qui porte ce titre, sans dépendre de sa position dans la liste.
     * @param {string} title
     */
    async deleteNote(title) {
        // Le plus petit bloc qui contient à la fois ce titre et un bouton supprimer = la carte de la note.
        const card = this.page.locator('div')
            .filter({ has: this.noteTitle(title) })
            .filter({ has: this.noteDeleteButton })
            .last();
        await card.getByTestId('note-delete').click();
        await this.noteDeleteConfirmButton.click();
    }

    /**
     * @param {string} title
     */
    async verifyNoteIsVisible(title) {
        await expect(this.noteTitle(title)).toBeVisible();
    }

    /**
     * @param {string} title
     */
    async verifyNoteIsDeleted(title) {
        await expect(this.noteTitle(title)).toHaveCount(0);
    }
}
