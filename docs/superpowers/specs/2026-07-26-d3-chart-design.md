# 5.30 D3图表样式 — 对齐官网 demo 设计文档

**日期**: 2026-07-26
**状态**: 待实现

## 背景

仓库现有 5.30 demo（`d3-chart`）用静态 SVG 饼图替代了 D3 交互可视化，与官网
`https://maptalks.org/examples/cn/style/d3-marker/` 的 D3 四叉树+画刷 demo 完全不匹配。

## 目标

用 D3.js v7 忠实还原官网 demo：
- 5000 个随机数据点 → `d3.quadtree` 四叉树空间索引
- 渲染四叉树节点矩形 + 数据点圆
- `d3.brush` 画刷交互框选，高亮 `.scanned` / `.selected` 点
- 整体挂在 `mt.ui.UIMarker` 中以 HTML 形式叠加在地图上

## 依赖

```bash
cd examples/demo-suite && pnpm add d3 @types/d3
```

## D3 v3 → v7 关键 API 映射

| 官网 v3 API | v7 等效 |
|------------|---------|
| `d3.range(n)` | 同 |
| `d3.geom.quadtree().extent([...])(data)` | `d3.quadtree(data, d => d[0], d => d[1]).extent([...])` |
| 遍历中 `node.point` 访问数据 | `node.data` |
| `d3.svg.brush().x(...).y(...).extent([init])` | `d3.brush().extent([[0,0],[w,h]])` 并在 brush 回调中设初始选区 |
| `brush.extent()` 读当前选区 | `event.selection` 或 `d3.brushSelection(svg.node())` |
| `d3.scale.identity().domain([0,w])` | `d3.scaleIdentity().domain([0,w])` |

## 文件结构

```
examples/demo-suite/app/
├── components/example2/style/d3-chart/
│   ├── createD3Viz.ts          # 新建：共享 D3 逻辑纯函数
│   ├── ComposableImpl.vue      # 新建
│   ├── MixedImpl.vue           # 新建
│   └── EscapeImpl.vue          # 重写（替换静态饼图为 D3 quadtree+brush）
└── pages/example2/style/
    └── d3-chart.vue            # 更新 tabs（3 tab）
```

## 共享模块：`createD3Viz.ts`

```ts
export function createD3Viz(container: HTMLElement): void
```

职责：
1. 注入 `<style>` 到 container（定义 `.point` / `.point.scanned` / `.point.selected` / `.node` / `.brush .selection` 五类样式）
2. 生成 5000 个 `[Math.random()*600, Math.random()*300]` 数据点
3. 用 `d3.quadtree(data, d=>d[0], d=>d[1]).extent([[-1,-1],[601,301]])` 建立四叉树
4. `quadtree.visit()` 遍历收集节点空间范围（x, y, width, height）→ 渲染 `<rect class="node">`
5. 渲染所有点 `<circle class="point" cx cy r="4">`
6. 挂载 `d3.brush()`，框选时 `quadtree.visit()` 遍历标记 `.scanned` / `.selected`

## 三个 tab 实现

### ComposableImpl

```vue
// useMaptalks(el) → 地图
// useMaptalksUIMarker(map, { options: { coordinates, content: '<div style="width:600px..."></div>' } })
// watch(uiMarker, (uim) => { if (uim) createD3Viz(uim.getDOM()) })
```

### MixedImpl

```vue
// <MaptalksMap ref="mc">
// const map = computed(() => mc.value?.map)
// useMaptalksUIMarker(map, { options: { coordinates, content: '...' } })
// watch(uiMarker, ...) → createD3Viz
```

### EscapeImpl

```vue
// useMaptalks(el) → 地图
// import('maptalks-gl') → new mt.ui.UIMarker(...)
// createD3Viz(uim.getDOM())
```

## 不包含
- 组件 tab：D3 需要 DOM 操作，`<MaptalksUIMarker :options="{content:'...'}">` 纯声明式不适用
- 坐标使用陆家嘴 `[121.5057, 31.2453]`（与其他 demo 一致）

## 验证
- `pnpm lint` 零 error
- `npx vue-tsc --noEmit` 通过
- 浏览器验证 3 个 tab：地图加载 → UIMarker 显示 600×300 D3 可视化 → 画刷可拖拽框选高亮
