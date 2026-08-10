# demo-suite 顶部横向一级菜单 & 联动过滤侧栏

## 目标

为 `examples/demo-suite` 添加全宽顶部横向一级菜单（参考 ui.nuxt.com），点击一级项导航到对应分区第一页，左侧栏根据当前路由前缀自动过滤只显示该分区的页面列表。

## 现状

- 布局：`UDashboardGroup` → `UDashboardSidebar`（5 组竖向菜单）+ `UDashboardPanel`（内容区独立滚动）
- 菜单数据：`items: NavigationMenuItem[][]`，5 组硬编码在 `default.vue` script 中
- 所有页面用同一套侧栏，没有顶部分区索引

## 核心设计

### 数据结构重组：`sections`

用单一数据源 `sections` 替代现有 `items`。每条 section 含：

```ts
interface Section {
  label: string          // 一级菜单显示文字
  icon: string           // 一级菜单图标
  to: string             // 分区第一页路径（点击导航）
  prefix: string         // 路由前缀（用于 active 高亮 & 侧栏过滤）
  children: NavigationMenuItem[]  // 该分区在侧栏显示的页面
}
```

5 个分区（3 个有明确前缀 + 2 个通过排除法归类）：

| section | prefix | to |
|---------|--------|----|
| 开始 | `''`（兜底：不匹配任何其他前缀的路径） | `/` |
| 组件 | `/components` | `/components/layers` |
| Composable | `/composables` | `/composables/core` |
| 组合 | `/combos` | `/combos/components-combo` |
| 进阶 | `/advanced` | `/advanced/altitude-3d` |

### 匹配逻辑（active 高亮 & 侧栏过滤）

```ts
const activeSection = computed(() => {
  const path = route.path
  // 按优先级从精确到宽松
  if (path.startsWith('/advanced'))    return '进阶'
  if (path.startsWith('/combos'))      return '组合'
  if (path.startsWith('/composables')) return 'Composable'
  if (path.startsWith('/components'))  return '组件'
  return '开始'  // '/'、'/fill-parent'、'/test/*' 等兜底
})
```

侧边栏 items 从 `activeSection` 对应 section 的 `children` 派生。

### 布局结构

```
UHeader（全宽 fixed top-0 z-10）
├── Logo（左）："nuxt-maptalks-gl"→ 点 Logo 回首页
└── UNavigationMenu orientation="horizontal"（右）
    └── 5 个 section 的一级项

UDashboardGroup（fixed inset-0，top-[var(--header-height)]）
├── UDashboardSidebar（仅显示 activeSection.children）
└── UDashboardPanel（内容区，独立滚动）
```

- `UDashboardGroup` 默认 `fixed inset-0`，需通过 `:ui="{ root: '...' }"` 或外层包裹将其顶部偏移改为 UHeader 高度（Nuxt UI v4 提供 `--ui-header-height` CSS 变量，即 `top-(--ui-header-height)`），避免被 UHeader 遮挡
- 若 `:ui` 覆盖不生效，降级方案：外层 `div` 用 flex column 布局（UHeader 不 fixed + 下方 `flex-1 relative` 容器包 UDashboardGroup）

### 移动端

- UHeader 自带汉堡菜单：一级菜单自动收进 slideover
- UDashboardSidebar 保留 Dashboard 自带抽屉（内容区左上角开关）

## 文件变更

| 文件 | 变更 |
|------|------|
| `examples/demo-suite/app/layouts/default.vue` | 唯一修改目标。模板加 UHeader 层；script 中 items → sections，新增 activeSection computed；sidebar items 改由 computed 派生 |

## 不做的

- 不改变任何 `pages/` 下的页面
- 不改变 `nuxt.config.ts` 或 `package.json`
- 不引入新依赖（@nuxt/ui 已有）

## 验证

1. `cd examples/demo-suite && pnpm lint` 零告警
2. `cd examples/demo-suite && pnpm typecheck` 零错误
3. 手动：浏览器打开 `http://localhost:5021`，逐一确认 5 个顶栏入口跳转正确、侧栏过滤正确、刷新保持、移动端汉堡菜单可用
