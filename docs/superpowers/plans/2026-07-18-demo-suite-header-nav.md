# demo-suite 顶部横向一级菜单 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `examples/demo-suite` 的 `default.vue` 中添加全宽 UHeader 横向一级菜单，5 个分区点击导航并联动过滤左侧栏。

**Architecture:** 单一数据源 `sections` 数组（每项含 label / icon / to / prefix / children），顶栏菜单和侧栏均从中派生；`activeSection` computed 按当前路由前缀匹配分区；UDashboardGroup 通过 `:ui` 覆盖 `fixed inset-0` 为偏移顶栏高度的定位。

**Tech Stack:** Nuxt 4 + @nuxt/ui v4（UHeader / UNavigationMenu / UDashboardGroup / UDashboardSidebar / UDashboardPanel / UDashboardNavbar）

## Global Constraints

- 只修改 `examples/demo-suite/app/layouts/default.vue` 一个文件
- 不引入新依赖
- 不改动任何 `pages/` 下的页面
- 不改动 `nuxt.config.ts` / `package.json`
- `--ui-header-height` = `4rem`（Nuxt UI v4 默认 CSS 变量）
- UDashboardGroup 默认 theme base: `"fixed inset-0 flex overflow-hidden"`
- UHeader 默认插槽：`#left`（logo），`#center`（菜单主体），`#right`，`#content`（移动端 body）
- 分区前缀匹配优先级（从精确到宽松）：`/advanced` → `/combos` → `/composables` → `/components` → `''`（开始兜底）

---

### Task 1: 重组数据结构 & 实现侧栏联动过滤

**Files:**
- Modify: `examples/demo-suite/app/layouts/default.vue`

**Interfaces:**
- Consumes: 现有 `NavigationMenuItem` 类型（`@nuxt/ui`），`useRoute`（Vue Router / Nuxt auto-import）
- Produces: `sections`（`{ label, icon, to, prefix, children }[]`），`activeSection`（`computed<Section>`），`sidebarItems`（`computed<NavigationMenuItem[][]>`）

- [ ] **Step 1: 将现有 `items` 重构为 `sections` 数据源**

在 `<script setup>` 中，删除现有 `const items: NavigationMenuItem[][]` 定义，替换为：

```ts
import type { NavigationMenuItem } from '@nuxt/ui';

// 各分区页面 children 定义
const startChildren: NavigationMenuItem[] = [
  { label: '首页', icon: 'i-lucide-home', to: '/' },
  { label: '自适应父容器', icon: 'i-lucide-maximize', to: '/fill-parent' },
  { label: 'IW 动画测试', icon: 'i-lucide-tv', to: '/test/iw-animation' },
  { label: 'MIW 测试', icon: 'i-lucide-tv', to: '/test/miw-test' },
];

const componentsChildren: NavigationMenuItem[] = [
  { label: '地图·瓦片图层', to: '/components/layers' },
  { label: '图形', to: '/components/geometries' },
  { label: '控件', to: '/components/controls' },
  { label: '工具', to: '/components/tools' },
  { label: '信息框', to: '/components/infowindow' },
];

const composablesChildren: NavigationMenuItem[] = [
  { label: '核心', to: '/composables/core' },
  { label: '图层预设', to: '/composables/layer-presets' },
  { label: '图形预设', to: '/composables/geometry-presets' },
  { label: '相机·事件·坐标', to: '/composables/interaction' },
  { label: '绘制·测量', to: '/composables/tools' },
  { label: '状态·序列化', to: '/composables/state' },
  { label: '控件', to: '/composables/controls' },
  { label: '信息框', to: '/composables/infowindow' },
];

const combosChildren: NavigationMenuItem[] = [
  { label: '组件组合', to: '/combos/components-combo' },
  { label: 'composable 组合', to: '/combos/composables-combo' },
  { label: '混合组合', to: '/combos/mixed-combo' },
];

const advancedChildren: NavigationMenuItem[] = [
  { label: '3D 高度', to: '/advanced/altitude-3d' },
  { label: '动画', to: '/advanced/geometry-fx' },
  { label: '编辑·拖拽', to: '/advanced/geometry-edit' },
  { label: '曲线·连接线', to: '/advanced/curves-connector' },
  { label: 'UI 组件', to: '/advanced/ui-components' },
  { label: '更多控件', to: '/advanced/extra-controls' },
  { label: '图层特效', to: '/advanced/layer-effects' },
  { label: '投影', to: '/advanced/projections' },
  { label: '插件图层', to: '/advanced/plugin-layers' },
];

// 单一数据源：顶栏 & 侧栏共用
const sections = [
  { label: '开始', icon: 'i-lucide-house', to: '/', prefix: '', children: startChildren },
  { label: '组件', icon: 'i-lucide-puzzle', to: '/components/layers', prefix: '/components', children: componentsChildren },
  { label: 'Composable', icon: 'i-lucide-code', to: '/composables/core', prefix: '/composables', children: composablesChildren },
  { label: '组合', icon: 'i-lucide-layers', to: '/combos/components-combo', prefix: '/combos', children: combosChildren },
  { label: '进阶', icon: 'i-lucide-rocket', to: '/advanced/altitude-3d', prefix: '/advanced', children: advancedChildren },
];
```

- [ ] **Step 2: 添加 `activeSection` computed**

在 `sections` 定义之后添加：

```ts
import { useRoute } from 'vue-router'; // Nuxt auto-imports this, but explicit for clarity

const route = useRoute();

// 按路由前缀匹配当前分区（精确 → 宽松）
const activeSection = computed(() => {
  const path = route.path;
  if (path.startsWith('/advanced')) return sections[4];
  if (path.startsWith('/combos')) return sections[3];
  if (path.startsWith('/composables')) return sections[2];
  if (path.startsWith('/components')) return sections[1];
  return sections[0]; // 开始（兜底：'/','/fill-parent','/test/*'）
});
```

- [ ] **Step 3: 将侧栏 `items` 改为由 `activeSection` 派生的 `computed`**

```ts
// 侧边栏 items：当前分区 label 标题 + children 列表
const sidebarItems = computed<NavigationMenuItem[][]>(() => [
  [
    { label: activeSection.value.label, type: 'label' as const },
    ...activeSection.value.children,
  ],
]);
```

- [ ] **Step 4: 更新模板中 `UDashboardSidebar` 的 `:items` 绑定**

在模板中找到 `:items="items"` 改为 `:items="sidebarItems"`：

```vue
<UNavigationMenu orientation="vertical" :items="sidebarItems" />
```

- [ ] **Step 5: 验证侧栏联动**

运行 `pnpm dev`（demo-suite 目录），浏览器打开 `http://localhost:5021`：

1. 访问 `/`：侧栏显示「开始」分区（首页、自适应父容器、IW动画测试、MIW测试）
2. 访问 `/components/layers`：侧栏显示「组件」分区页面列表
3. 访问 `/composables/core`：侧栏显示「Composable」分区页面列表
4. 访问 `/combos/components-combo`：侧栏显示「组合」分区页面列表
5. 访问 `/advanced/altitude-3d`：侧栏显示「进阶」分区页面列表
6. 直接访问 `/fill-parent`：侧栏显示「开始」分区（兜底逻辑）

- [ ] **Step 6: Commit**

```bash
git add examples/demo-suite/app/layouts/default.vue
git commit -m "feat(demo-suite): 重构菜单数据为 sections 并实现侧栏按路由前缀联动过滤"
```

---

### Task 2: 添加 UHeader 顶部横向一级菜单

**Files:**
- Modify: `examples/demo-suite/app/layouts/default.vue`

**Interfaces:**
- Consumes: `sections`（Task 1），`activeSection`（Task 1 computed），UHeader / UNavigationMenu 组件（Nuxt UI v4 auto-import）
- Produces: 完整可工作的顶栏横向菜单 + 联动侧栏布局

- [ ] **Step 1: 推导顶栏 horizontal 菜单 items**

UHeader 的 `#center` 插槽放 `UNavigationMenu orientation="horizontal"`，items 由 `sections` 派生：

```ts
const navItems = computed<NavigationMenuItem[][]>(() => [
  sections.map((s) => ({
    label: s.label,
    icon: s.icon,
    to: s.to,
  })),
]);
```

- [ ] **Step 2: 在模板中添加 UHeader 包裹层**

将现有 `UDashboardGroup` 包在 `UHeader` 下方，完整布局结构：

```vue
<template>
  <div class="h-screen flex flex-col">
    <!-- 顶部横向一级菜单 -->
    <UHeader :ui="{ root: 'relative z-10 shrink-0' }">
      <template #left>
        <NuxtLink to="/" class="font-mono font-bold text-sm">
          nuxt-maptalks-gl
        </NuxtLink>
      </template>

      <template #center>
        <UNavigationMenu
          orientation="horizontal"
          :items="navItems"
          :ui="{ link: 'text-sm' }"
        />
      </template>
    </UHeader>

    <!-- 下方 Dashboard 布局 -->
    <div class="flex-1 relative">
      <UDashboardGroup
        :ui="{ base: 'absolute inset-0 flex overflow-hidden' }"
      >
        <UDashboardSidebar
          collapsible
          resizable
          :default-size="18"
          :min-size="14"
          :max-size="28"
        >
          <template #header="{ collapsed }">
            <NuxtLink to="/" class="font-mono font-bold text-sm truncate">
              {{ collapsed ? 'MT' : activeSection.label }}
            </NuxtLink>
          </template>
          <UNavigationMenu orientation="vertical" :items="sidebarItems" />
        </UDashboardSidebar>

        <UDashboardPanel id="main">
          <template #header>
            <UDashboardNavbar :title="`@lacqjs/nuxt-maptalks-gl: ${activeSection.label}`" />
          </template>
          <template #body>
            <slot />
          </template>
        </UDashboardPanel>
      </UDashboardGroup>
    </div>
  </div>
</template>
```

- [ ] **Step 3: 从 UDashboardSidebar #header 中移除原 Logo**

原 `#header` 中显示的是总标题「nuxt-maptalks-gl」，现在 Logo 已移到 UHeader #left，侧栏 #header 改为显示当前分区名（collapsed 时显示缩写）。

注意：原代码中 `collapsed ? 'MT' : 'nuxt-maptalks-gl'` 已改为 `collapsed ? 'MT' : activeSection.label`。

- [ ] **Step 4: 更新 UDashboardNavbar 标题**

原 `title="@lacqjs/nuxt-maptalks-gl 示例合集"` 改为动态显示当前分区名：`:title="`@lacqjs/nuxt-maptalks-gl: ${activeSection.label}`"`。

- [ ] **Step 5: 验证顶栏菜单**

运行 `pnpm dev`，浏览器访问 `http://localhost:5021`：

1. 顶栏横向显示 5 个一级菜单项（开始、组件、Composable、组合、进阶）
2. 当前路由对应的菜单项高亮 active（通过 Nuxt UI 自动处理 `to` 路由匹配）
3. 点击「组件」→ 跳转 `/components/layers`，顶栏「组件」高亮，侧栏显示组件分区列表
4. 点击「进阶」→ 跳转 `/advanced/altitude-3d`，顶栏「进阶」高亮，侧栏显示进阶分区列表
5. 点击 Logo → 回首页 `/`，顶栏「开始」高亮，侧栏显示开始分区列表
6. 刷新任意页面：顶栏和侧栏保持正确高亮和过滤

- [ ] **Step 6: 移动端验证**

1. 将浏览器窗口缩窄到 768px 以下
2. UHeader 右上角出现汉堡菜单按钮（`toggleSide="right"` 默认）
3. 点击汉堡菜单打开 slideover，其中显示 5 个一级菜单项
4. 选择一个菜单项，slideover 关闭并导航到对应分区
5. UDashboardSidebar 保留自己的移动端抽屉（通过 UDashboardNavbar 的开关触发）

- [ ] **Step 7: Commit**

```bash
git add examples/demo-suite/app/layouts/default.vue
git commit -m "feat(demo-suite): 添加 UHeader 顶部横向一级菜单，联动过滤侧栏"
```

---

### Task 3: Lint + Typecheck 验证

**Files:**
- 无变更

- [ ] **Step 1: Run lint in demo-suite**

```bash
cd examples/demo-suite && pnpm lint
```

Expected: oxlint 零告警（0 errors, 0 warnings）

- [ ] **Step 2: Run typecheck in demo-suite**

```bash
cd examples/demo-suite && pnpm typecheck
```

Expected: vue-tsc 零错误（exit code 0）

- [ ] **Step 3: Fix any lint/type errors**

如果 lint 或 typecheck 报错，修正后重新验证，直到两者均通过。

- [ ] **Step 4: Commit (if fixes were needed)**

```bash
git add examples/demo-suite/app/layouts/default.vue
git commit -m "fix(demo-suite): lint/typecheck 修正"
```

如果无修复，跳过此 commit。

---

### Task 4: 最终合并 & 推送分支

- [ ] **Step 1: 检查所有 commit 是否正确**

```bash
git log --oneline -3
```

确认 commit 历史干净，无多余的 WIP commit。

- [ ] **Step 2: 最终检查状态**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

- [ ] **Step 3: 推送分支**

```bash
git push origin dev
```
