import { expect, test } from '@playwright/test';

// 注：按 spec §10，CI 无 GPU 时降级——这里只断言 DOM 接线与 API，不断言 GL 实际渲染。

test('landing page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('功能演示');
});

test('basic map container mounts', async ({ page }) => {
  await page.goto('/core/basic');
  await expect(page.locator('h1')).toContainText('第一张地图');
  await expect(page.getByTestId('map')).toBeVisible();
});

test('multi-map shows two named maps', async ({ page }) => {
  await page.goto('/multi/named');
  await expect(page.getByTestId('map-left')).toBeVisible();
  await expect(page.getByTestId('map-right')).toBeVisible();
});

test('draw tool toggles mode buttons', async ({ page }) => {
  await page.goto('/crosscutting/draw');
  const polygon = page.locator('button:has-text("面")');
  const point = page.locator('button:has-text("点")');
  // 面模式默认选中（SSR 即渲染 disabled）
  await expect(polygon).toBeDisabled();
  // 该页较重（地图 + maptalks 动态加载），点击需等水合完成才生效：
  // 用 toPass 重试「点击 + 断言」，直到 点 模式被选中（按钮禁用）
  await expect(async () => {
    await point.click();
    await expect(point).toBeDisabled({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
});

test('sign route returns a signed url template', async ({ request }) => {
  const res = await request.get('/api/maptalks/sign');
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.urlTemplate).toContain('openstreetmap');
  expect(data.urlTemplate).toContain('token=');
});
