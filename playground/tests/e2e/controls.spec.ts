import { expect, test } from '@playwright/test';

test('controls page renders', async ({ page }) => {
  await page.goto('/controls/basic');
  await expect(page.locator('h1')).toContainText('控件');
  await expect(page.getByTestId('map')).toBeVisible();
});
