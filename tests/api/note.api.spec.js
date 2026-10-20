// @ts-check
/// <reference types="node" />
import { test, expect } from '@playwright/test';

/** @type {import('@playwright/test').APIRequestContext} */
let api;

// Connexion une seule fois pour tout le fichier, puis le token est envoyé automatiquement.
test.beforeAll(async ({ playwright, baseURL }) => {
    const login = await playwright.request.newContext({ baseURL });
    const response = await login.post('/notes/api/users/login', {
        data: {
            email: process.env.USER1_EMAIL,
            password: process.env.USER1_PASSWORD,
        }
    });
    expect(response.status()).toBe(200);
    const token = (await response.json()).data.token;
    await login.dispose();

    api = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: { 'X-Auth-Token': token },
    });
});

test.afterAll(async () => {
    await api.dispose();
});

/**
 * @param {string} title
 */
async function createNote(title) {
    const response = await api.post('/notes/api/notes', {
        data: {
            category: 'Personal',
            completed: false,
            description: 'new description',
            title,
        }
    });
    expect(response.status()).toBe(200);
    return (await response.json()).data.id;
}

test('get notes', async () => {
    const responseGet = await api.get('/notes/api/notes');

    expect(responseGet.status()).toBe(200);
    const responseGetBody = await responseGet.json();
    expect(Array.isArray(responseGetBody.data)).toBeTruthy();
});

test('should be able to update a note', async () => {
    // On crée la note dans le test au lieu d'utiliser un ID en dur.
    const noteId = await createNote('Title to update');

    const responsePut = await api.put(`/notes/api/notes/${noteId}`, {
        data: {
            category: 'Personal',
            completed: false,
            description: 'Updated description',
            title: 'Updated Title'
        }
    });

    expect(responsePut.status()).toBe(200);
    const responsePutBody = await responsePut.json();
    expect(responsePutBody.data).toHaveProperty('completed', false);
    expect(responsePutBody.data).toHaveProperty('description', 'Updated description');
    expect(responsePutBody.data).toHaveProperty('title', 'Updated Title');

    // Nettoyage
    await api.delete(`/notes/api/notes/${noteId}`);
});

test('should be able to delete a note', async () => {
    const noteId = await createNote('new Title');

    const responseDelete = await api.delete(`/notes/api/notes/${noteId}`);

    expect(responseDelete.status()).toBe(200);
    const responseDeleteBody = await responseDelete.json();
    expect(responseDeleteBody).toHaveProperty('message', 'Note successfully deleted');
});
