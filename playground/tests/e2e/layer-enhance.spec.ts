import { expect, test } from '@playwright/test';

// 注：CI 无 GPU 时降级——只断言 DOM 接线与交互，不断言 GL 渲染。

test('layer-enhance 页：地图与控制按钮挂载', async ({ page }) => {
  await page.goto('/layer/enhance');
  await expect(page.locator('h1')).toContainText('图层');
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByTestId('toggle')).toBeVisible();
  await expect(page.getByTestId('opacity-down')).toBeVisible();
  await expect(page.getByTestId('opacity-up')).toBeVisible();
  await expect(page.getByTestId('front')).toBeVisible();
  await expect(page.getByTestId('back')).toBeVisible();
  await expect(page.getByTestId('wms-status')).toBeVisible();
});

test('layer-enhance 页：切换显隐更新状态文字', async ({ page }) => {
  await page.goto('/layer/enhance');
  // 初始可见
  await expect(page.getByTestId('visible-status')).toContainText('可见');
  // 点击切换 → 隐藏
  await page.getByTestId('toggle').click();
  await expect(page.getByTestId('visible-status')).toContainText('隐藏');
  // 再次切换 → 可见
  await page.getByTestId('toggle').click();
  await expect(page.getByTestId('visible-status')).toContainText('可见');
});

test('layer-enhance 页：调整透明度更新状态文字', async ({ page }) => {
  await page.goto('/layer/enhance');
  // 初始透明度 1.0
  await expect(page.getByTestId('opacity-status')).toContainText('1.0');
  // 降低一次 → 0.8
  await page.getByTestId('opacity-down').click();
  await expect(page.getByTestId('opacity-status')).toContainText('0.8');
  // 提高一次 → 1.0
  await page.getByTestId('opacity-up').click();
  await expect(page.getByTestId('opacity-status')).toContainText('1.0');
});
