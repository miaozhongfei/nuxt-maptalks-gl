import { expect, test } from '@playwright/test';

test('infowindow page renders', async ({ page }) => {
  await page.goto('/ui/infowindow');
  await expect(page.locator('h1')).toContainText('InfoWindow');
  await expect(page.getByTestId('map')).toBeVisible();
});
