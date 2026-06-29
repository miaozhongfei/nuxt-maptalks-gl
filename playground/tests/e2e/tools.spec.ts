import { expect, test } from '@playwright/test';

test('tools page renders', async ({ page }) => {
  await page.goto('/tools/basic');
  await expect(page.locator('h1')).toContainText('测量工具');
  await expect(page.getByTestId('map')).toBeVisible();
});
