import { expect, test } from '@playwright/test';

// 注：CI 无 GPU 时降级——只断言 DOM 接线与交互，不断言 GL 渲染。

test('geometry 页：地图与控件挂载', async ({ page }) => {
  await page.goto('/geometry/basic');
  await expect(page.locator('h1')).toContainText('矢量图形');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('move')).toBeVisible();
});

test('geometry 页：移动 Marker 按钮可点', async ({ page }) => {
  await page.goto('/geometry/basic');
  await expect(async () => {
    await page.getByTestId('move').click();
  }).toPass({ timeout: 15000 });
});
