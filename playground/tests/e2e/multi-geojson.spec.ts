import { expect, test } from '@playwright/test';

// 注：CI 无 GPU 时降级——只断言 DOM 接线与交互，不断言 GL 渲染。

test('multi-geojson 页：地图与控件挂载', async ({ page }) => {
  await page.goto('/geometry/multi-geojson');
  await expect(page.locator('h1')).toContainText('Multi');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('toggle')).toBeVisible();
});

test('multi-geojson 页：切换数据按钮可点', async ({ page }) => {
  await page.goto('/geometry/multi-geojson');
  await expect(async () => {
    await page.getByTestId('toggle').click();
  }).toPass({ timeout: 15000 });
});
