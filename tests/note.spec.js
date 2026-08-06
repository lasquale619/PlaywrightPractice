import { test, expect } from '@playwright/test';
import { NotesPage } from '../pages/NotesPage';


test.describe('Notes test cases', () => {


    test.beforeEach(async ({ page }) => {
        // Bloquer les ressources inutiles
        await page.route("**/*", (route) => {
            const url = route.request().url();
            if (/ads|doubleclick|googlesyndication|pagead|adservice|admanager|adframe/i.test(url) ||
                url.includes("socket.io") || // Bloquer les connexions socket.io
                url.includes("analytics") // Bloquer Google Analytics
            ) {
                route.abort(); // Stopper la requête
            } else {
                route.continue(); // Continuer pour les autres requêtes
            }
        });

        const notesPages = new NotesPage(page);
        await notesPages.navigateToApp();
    });

    test.describe('Create note with user', () => {
        test.use({ storageState: 'playwright/.auth/user.json' });
        test('create a new note', async ({ page }) => {
            const notesPage = new NotesPage(page);
            await notesPage.createNote('Work', 'New Note Title', 'This is the description of the new note.');

            const noteTitle = await notesPage.getFirstNoteTitle();
            expect(noteTitle).toBe('New Note Title');
        });
    });

    test.describe('Delete note with user2', () => {
        test.use({ storageState: 'playwright/.auth/user2.json' });

        test('delete note', async ({ page }) => {
            const notesPage = new NotesPage(page);

            await notesPage.createNote('Work', 'New Note Title', 'This is the description of the new note.');
            await notesPage.deleteFirstNote();
            const noNotesMessage = await notesPage.getNoNotesMessage();
            expect(noNotesMessage).toBe('You don\'t have any notes in all categories');
        });

    });



})




