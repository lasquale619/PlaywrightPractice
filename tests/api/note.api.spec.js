// @ts-check
/// <reference types="node" />
import { test, expect } from '@playwright/test';

let token = '';

test.beforeEach(async ({ request }) => {
    const response = await request.post('https://practice.expandtesting.com/notes/api/users/login', {
        data: {
            "email": "playwright_test1@gmail.com",
            "password": "123456",
        }
    })

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    token = responseBody.data.token;
    console.log(token);

});



test('get notes', async ({ request }) => {

    const responseGet = await request.get('https://practice.expandtesting.com/notes/api/notes', {
        headers: {
            "X-Auth-Token": token,
        }
    });
    expect(responseGet.ok()).toBeTruthy();
    expect(responseGet.status()).toBe(200);

    const responseGetBody = await responseGet.json();
    console.log(responseGetBody);
});


test('shoould be able to update a note', async ({ request }) => {

    const responsePut = await request.put('https://practice.expandtesting.com/notes/api/notes/6a611976fda22d0295a94a1b', {
        headers: {
            "X-Auth-Token": token,
        },
        data: {
            category: "Personal",
            completed: false,
            description: "Updated description",
            title: "Updated Title"
        }
    });

    expect(responsePut.ok()).toBeTruthy();
    expect(responsePut.status()).toBe(200);

    const responsePutBody = await responsePut.json();
    expect(responsePutBody.data).toHaveProperty('completed', false);
    expect(responsePutBody.data).toHaveProperty('description', 'Updated description');
    expect(responsePutBody.data).toHaveProperty('title', 'Updated Title');
});

test('should be able to delete a note', async ({ request }) => {

    const responseCreate = await request.post('https://practice.expandtesting.com/notes/api/notes', {
        headers: {
            "X-Auth-Token": token,
        },
        data: {
            category: "Personal",
            completed: false,
            description: "new description",
            title: "new Title"
        }
    });

    expect(responseCreate.ok()).toBeTruthy();
    expect(responseCreate.status()).toBe(200);

    const responseCreateBody = await responseCreate.json();
    const noteId = responseCreateBody.data.id;





    const responseDelete = await request.delete(`https://practice.expandtesting.com/notes/api/notes/${noteId}`, {
        headers: {
            "X-Auth-Token": token,
        }
    });

    expect(responseDelete.ok()).toBeTruthy();
    expect(responseDelete.status()).toBe(200);

    const responseDeleteBody = await responseDelete.json();
    expect(responseDeleteBody).toHaveProperty('message', 'Note successfully deleted');
});