import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NotesPage extends BasePage {
    readonly addNewNoteButton: Locator;
    readonly noteCategorySelect: Locator;
    readonly noteTitleInput: Locator;
    readonly noteDescriptionInput: Locator;
    readonly noteSubmitButton: Locator;
    readonly noteDeleteButton: Locator;
    readonly noteDeleteConfirmButton: Locator;
    readonly noteCardTitle: Locator;

    constructor(page: Page) {
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

    async createNote(category: string, title: string, description: string) {
        await this.addNewNoteButton.click();
        await this.noteCategorySelect.selectOption(category);
        await this.noteTitleInput.fill(title);
        await this.noteDescriptionInput.fill(description);
        await this.noteSubmitButton.click();
    }

    noteTitle(title: string) {
        return this.noteCardTitle.filter({ hasText: title });
    }

    /**
     * Supprime la note qui porte ce titre, sans dépendre de sa position dans la liste.
     */
    async deleteNote(title: string) {
        // Le plus petit bloc qui contient à la fois ce titre et un bouton supprimer = la carte de la note.
        const card = this.page.locator('div')
            .filter({ has: this.noteTitle(title) })
            .filter({ has: this.noteDeleteButton })
            .last();
        await card.getByTestId('note-delete').click();
        await this.noteDeleteConfirmButton.click();
    }

    async verifyNoteIsVisible(title: string) {
        await expect(this.noteTitle(title)).toBeVisible();
    }

    async verifyNoteIsDeleted(title: string) {
        await expect(this.noteTitle(title)).toHaveCount(0);
    }
}
