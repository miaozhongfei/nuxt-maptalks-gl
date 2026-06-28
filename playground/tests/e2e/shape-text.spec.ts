import { expect, test } from '@playwright/test';

// 注：CI 无 GPU 时降级——只断言 DOM 接线与交互，不断言 GL 渲染。

test('shape-text 页：地图与控件挂载', async ({ page }) => {
  await page.goto('/geometry/shape-text');
  await expect(page.locator('h1')).toContainText('形状');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('grow')).toBeVisible();
});

test('shape-text 页：放大半径按钮可点', async ({ page }) => {
  await page.goto('/geometry/shape-text');
  await expect(async () => {
    await page.getByTestId('grow').click();
  }).toPass({ timeout: 15000 });
});
