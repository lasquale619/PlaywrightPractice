import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Auth API - negative cases', () => {
    test('login fails with a wrong password', { tag: '@CT-API-CNX-02' }, async ({ request }) => {
        const response = await request.post('/notes/api/users/login', {
            data: { email: process.env.USER1_EMAIL, password: 'wrong-password' }
        });

        expect(response.status()).toBe(401);
        expect(await response.json()).toHaveProperty('success', false);
    });

    test('register fails when the email is already used', { tag: '@CT-API-INS-03' }, async ({ request }) => {
        const response = await request.post('/notes/api/users/register', {
            data: { email: process.env.USER1_EMAIL, name: faker.person.fullName(), password: faker.internet.password({ length: 10 }) }
        });

        expect(response.status()).toBe(409);
        expect(await response.json()).toHaveProperty('success', false);
    });

    test('register fails with an invalid email', { tag: '@CT-API-INS-04' }, async ({ request }) => {
        const response = await request.post('/notes/api/users/register', {
            data: { email: 'not-an-email', name: faker.person.fullName(), password: faker.internet.password({ length: 10 }) }
        });

        expect(response.status()).toBe(400);
        expect(await response.json()).toHaveProperty('success', false);
    });
});
