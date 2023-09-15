import { expect, test } from '@playwright/test';

test('switch language', async ({ page }) => {
    await page.goto('http://localhost:3000');
  
    await page.getByTitle("international").click()
  
    await page.getByText("简体中文").click()
  
    await expect(page.getByText("菜单")).toBeVisible()
});

test('goto users page', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.getByText("Menu").click()

    // Click the user page link.
    await page.getByRole('link', { name: 'User Management' }).click();

    await expect(page.url()).toEqual("http://localhost:3000/users")
});

test('goto rooms page', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.getByText("Menu").click()

    // Click the room page link.
    await page.getByRole('link', { name: 'Room Management' }).click();

    await expect(page.url()).toEqual("http://localhost:3000/rooms")
});