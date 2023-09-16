import { expect, test } from '@playwright/test';

test('goto users page', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    await page.getByText('Add User').click()

    await expect(page.getByText('Create User')).toBeVisible();
});


test('create user then delete user', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    await page.getByText('Add User').click()

    await page.getByLabel("Username").fill("test")
    await page.getByLabel("Birth Date").fill("1997-08-15")
    await page.getByLabel("Female").click()
    await page.getByLabel("User Management").check()
    await page.getByLabel("Description").fill("user of test")

    await page.getByRole('button', { name: "Confirm" }).click()

    await expect(page.getByText('test')).toBeVisible();

    await page.locator("body > div > div.user.page > div > div.table > table > tbody > tr:nth-child(4) > td:nth-child(5) > div > button").click()
    await page.getByRole('button', { name: "Confirm" }).click()

    await expect(page.getByText('test')).not.toBeAttached();
});