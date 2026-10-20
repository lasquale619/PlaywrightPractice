import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('should be able to create an account with API', async ({ request }) => {
    const response = await request.post('/notes/api/users/register', {
        data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password({ length: 10 }),
        }
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'User account created successfully');
});
