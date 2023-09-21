import { expect, test } from '@playwright/test';

test('goto users page', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    await page.getByText('Add User').click()

    await expect(page.getByText('Create User')).toBeVisible();
});


test('create user, edit user then delete user', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    // create new user
    await page.getByText('Add User').click()
    await page.getByLabel("Username").fill("test")
    await page.getByLabel("Birth Date").fill("1997-08-15")
    await page.getByLabel("Female").click()
    await page.getByLabel("User Management").check()
    await page.getByLabel("Description").fill("user of test")
    await page.getByRole('button', { name: "Confirm" }).click()
    // check new use is present
    await expect(page.getByText('test', {exact: true})).toBeVisible();

    // edit last user
    await page.locator("div.user.page div.table > table > tbody > tr:last-child button.second").click()
    await page.getByLabel("User Management").check()
    await page.getByLabel("Category").clear()
    await page.getByLabel("Category").click()
    await page.locator("div.select > ul.list > li.item > a", {hasText: "Admin"}).click()
    await page.getByRole('button', { name: "Confirm" }).click()
    const category = page.locator("div.user.page div.table > table > tbody > tr:last-child")
    await expect(category.getByText("Admin")).toBeAttached()

    // delete user
    await page.locator("div.user.page div.table > table > tbody > tr:last-child button.danger").click()
    await page.getByRole('button', { name: "Confirm" }).click()

    await page.waitForTimeout(1000)

    await expect(page.getByText('test', {exact: true})).not.toBeAttached();
});


test('batch delete user', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    // select last user
    await page.locator("div.user.page div.table > table > tbody > tr:last-child > td:first-child input[type=checkbox]").check()

    const deleteBtn = page.locator("body > div > div.user.page > div > ul > div > button").filter({ hasText: "Delete"})
    await expect(deleteBtn).toBeEnabled()

    await deleteBtn.click()

    await page.locator("body > div > div.user.page > div > ul > div > div > div > div.center.footer > button.primary.button").click()

    await expect(deleteBtn).toBeDisabled()

    // select all users
    await page.locator("body > div > div.user.page > div > div.table > table > thead > tr > th:nth-child(1) > div > input").check()

    await expect(deleteBtn).toBeEnabled()
    
    await deleteBtn.click()

    await page.locator("body > div > div.user.page > div > ul > div > div > div > div.center.footer > button.primary.button").click()

    await expect(deleteBtn).toBeDisabled()

    await expect((await page.locator("div.user.page div.table > table > tbody > tr").all()).length).toEqual(0)
});


test('user pagination', async ({ page }) => {
    await page.goto('http://localhost:3000/users');

    await page.getByTitle("Each page shows 10 items.").click()
    await page.locator("div.pager > div.dropdown > ul.list > li.item > a").filter({hasText: /^5$/}).click()

    // create new user
    await page.getByText('Add User').click()
    await page.getByLabel("Username").fill("test")
    await page.getByLabel("Birth Date").fill("1997-08-15")
    await page.getByLabel("Female").click()
    await page.getByLabel("User Management").check()
    await page.getByLabel("Description").fill("user of test")
    await page.getByRole('button', { name: "Confirm" }).click()
    
    await expect(page.getByText('test', {exact: true})).not.toBeAttached();
    // go to last page
    await page.getByTitle("Go to last page").click()
    // check new use is present
    await expect(page.getByText('test', {exact: true})).toBeAttached();
});