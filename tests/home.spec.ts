import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Demo/);
});

test('goto users page', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Click the get started link.
  await page.getByRole('link', { name: '用户管理' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText('创建用户')).toBeVisible();
});
