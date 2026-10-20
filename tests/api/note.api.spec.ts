import { test, expect } from '@playwright/test';
import { NotesClient } from '../../api/notes.client';

let notes: NotesClient;

// Connexion une seule fois pour tout le fichier.
test.beforeAll(async ({ playwright, baseURL }) => {
    notes = await NotesClient.login(playwright, baseURL, process.env.USER1_EMAIL, process.env.USER1_PASSWORD);
});

test.afterAll(async () => {
    await notes.dispose();
});

test('get notes', async () => {
    const responseGet = await notes.getNotes();

    expect(responseGet.status()).toBe(200);
    const responseGetBody = await responseGet.json();
    expect(Array.isArray(responseGetBody.data)).toBeTruthy();
});

test('should be able to update a note', async () => {
    // On crée la note dans le test au lieu d'utiliser un ID en dur.
    const noteId = await notes.createNote('Title to update');

    const responsePut = await notes.updateNote(noteId, {
        category: 'Personal',
        completed: false,
        description: 'Updated description',
        title: 'Updated Title'
    });

    expect(responsePut.status()).toBe(200);
    const responsePutBody = await responsePut.json();
    expect(responsePutBody.data).toHaveProperty('completed', false);
    expect(responsePutBody.data).toHaveProperty('description', 'Updated description');
    expect(responsePutBody.data).toHaveProperty('title', 'Updated Title');

    // Nettoyage
    await notes.deleteNote(noteId);
});

test('should be able to delete a note', async () => {
    const noteId = await notes.createNote('new Title');

    const responseDelete = await notes.deleteNote(noteId);

    expect(responseDelete.status()).toBe(200);
    const responseDeleteBody = await responseDelete.json();
    expect(responseDeleteBody).toHaveProperty('message', 'Note successfully deleted');
});
