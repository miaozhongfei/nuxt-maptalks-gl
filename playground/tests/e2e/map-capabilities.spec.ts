import { expect, test } from '@playwright/test';

// 注：CI 无 GPU 时降级——只断言 DOM 接线与交互，不断言 GL 实际渲染。

test('limits 页：受限地图容器挂载', async ({ page }) => {
  await page.goto('/map/limits');
  await expect(page.locator('h1')).toContainText('限制缩放');
  await expect(page.getByTestId('map')).toBeVisible();
});

test('pan-status 页：平移按钮与状态接线', async ({ page }) => {
  await page.goto('/map/pan-status');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('pan')).toBeVisible();
  await expect(page.getByTestId('panby')).toBeVisible();
  // 点击平移按钮不应抛错（地图就绪后可点）
  await expect(async () => {
    await page.getByTestId('pan').click();
  }).toPass({ timeout: 15000 });
});

test('export 页：下载按钮可点', async ({ page }) => {
  await page.goto('/map/export');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('download')).toBeVisible();
  await expect(async () => {
    await page.getByTestId('download').click();
  }).toPass({ timeout: 15000 });
});

test('sync 页：双图与模式切换接线', async ({ page }) => {
  await page.goto('/map/sync');
  await expect(page.getByTestId('map-left')).toBeVisible();
  await expect(page.getByTestId('map-right')).toBeVisible();
  const toggle = page.getByTestId('toggle-mode');
  await expect(toggle).toContainText('mutual');
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toContainText('master-slave', { timeout: 1000 });
  }).toPass({ timeout: 15000 });
});
