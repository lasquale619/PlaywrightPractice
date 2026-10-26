import { faker } from '@faker-js/faker';
import { test } from '../../fixtures/test.fixture';
import { NotesPage } from '../../pages/NotesPage';

test.describe('Notes test cases', () => {

    test.beforeEach(async ({ page }) => {
        const notesPage = new NotesPage(page);
        await notesPage.navigateToApp();
    });

    test.describe('Create note with user', () => {
        test.use({ storageState: 'playwright/.auth/user.json' });

        test('create a new note', { tag: '@CT-NOT-01' }, async ({ page }) => {
            const notesPage = new NotesPage(page);
            // Titre unique : le test ne dépend pas des notes déjà présentes sur le compte.
            const title = `Note ${faker.string.alphanumeric(8)}`;

            await notesPage.createNote('Work', title, 'This is the description of the new note.');
            await notesPage.verifyNoteIsVisible(title);

            // Nettoyage : on ne laisse pas de notes s'accumuler sur le compte.
            await notesPage.deleteNote(title);
        });
    });

    test.describe('Delete note with user2', () => {
        test.use({ storageState: 'playwright/.auth/user2.json' });

        test('delete note', { tag: '@CT-NOT-04' }, async ({ page }) => {
            const notesPage = new NotesPage(page);
            const title = `Note ${faker.string.alphanumeric(8)}`;

            await notesPage.createNote('Work', title, 'This is the description of the new note.');
            await notesPage.verifyNoteIsVisible(title);
            await notesPage.deleteNote(title);
            await notesPage.verifyNoteIsDeleted(title);
        });
    });
});
