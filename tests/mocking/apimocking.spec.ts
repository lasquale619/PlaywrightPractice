import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test("mock a comment and doesn't call the api", async ({ page }) => {

    await page.route('https://jsonplaceholder.typicode.com/comments', async route => {
        const json = [{
            postId: 1,
            id: 1,
            name: "Mocked Comment",
            email: faker.internet.email(),
            body: "This is a mocked comment."
        }];
        await route.fulfill({ json });
    });

    await page.goto('https://qa-practice.netlify.app/fetch-api');

    await expect(page.getByText('Mocked Comment', { exact: true })).toBeVisible();
});


test('gets the json from api and adds a new comment', async ({ page }) => {
    // Get the response and add to it
    await page.route('https://jsonplaceholder.typicode.com/comments', async route => {
        const response = await route.fetch();
        const json = await response.json();
        json.push({
            postId: 1,
            id: 1,
            name: "Mocked Comment",
            email: faker.internet.email(),
            body: "This is a mocked comment."
        });
        // Fulfill using the original response, while patching the response body
        // with the given JSON object.
        await route.fulfill({ response, json });
    });

    // Go to the page
    await page.goto('https://qa-practice.netlify.app/fetch-api');

    // Assert that the new comment is visible
    await expect(page.getByText('Mocked Comment', { exact: true })).toBeVisible();
});