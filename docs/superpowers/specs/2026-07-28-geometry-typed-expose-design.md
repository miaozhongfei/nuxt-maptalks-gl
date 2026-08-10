# Geometry 类型窄化 + 组件 defineExpose 补全设计文档

**日期**: 2026-07-28
**状态**: 待实现

## 背景

当前模块使用泛型 `MaptalksGeometry` 结构体描述所有几何实例，但 Label 的 `getBoxStyle()` / `setBoxStyle()`、Circle 的 `getRadius()` / `setRadius()` 等子类特有方法无类型提示。同时 19 个组件缺少 `defineExpose`（12 geometry + GeoJSON + 4 control + 2 tool），用户无法通过 template ref 程序化访问。

## 目标

1. 创建 10 个 Geometry 子类 struct interface（继承泛型 `MaptalksGeometry` 并追加密有方法）
2. 泛化 `UseMaptalksGeometryReturn<T>` 支持窄类型
3. 12 个几何组件补 `defineExpose({ geometry, show, hide, remove })`，按几何类型窄化泛型 Exposed
4. 7 个非几何组件（GeoJSON / control / tool）补 `defineExpose`
5. 最终 29 个组件全部有类型化的 `defineExpose`

## 新增类型

### 1. Geometry Struct（`src/runtime/types/structural.ts`）

共计 10 个新 interface，均 `extends MaptalksGeometry`：

| interface | 追加方法 |
|-----------|---------|
| `MaptalksMarkerGeometry` | `getOutline()` |
| `MaptalksLabelGeometry` | `getBoxStyle()` / `setBoxStyle()` / `getTextSymbol()` / `setTextSymbol()` |
| `MaptalksTextBoxGeometry` | `getWidth()` / `setWidth()` / `getHeight()` / `setHeight()` / `getBoxSymbol()` / `setBoxSymbol()` / `getTextStyle()` / `setTextStyle()` |
| `MaptalksLineStringGeometry` | —（复用 `MaptalksGeometry`） |
| `MaptalksPolygonGeometry` | `getShell()` / `getHoles()` / `hasHoles()` |
| `MaptalksCircleGeometry` | `getRadius()` / `setRadius()` |
| `MaptalksSectorGeometry` | 继承 `MaptalksCircleGeometry` + `getStartAngle()` / `setStartAngle()` / `getEndAngle()` / `setEndAngle()` |
| `MaptalksRectangleGeometry` | `getWidth()` / `setWidth()` / `getHeight()` / `setHeight()` |
| `MaptalksEllipseGeometry` | `getWidth()` / `setWidth()` / `getHeight()` / `setHeight()` |
| `MaptalksMultiPointGeometry` | `findClosest()` |

MultiLineString / MultiPolygon 无特有方法，直接用 `MaptalksGeometry`。

### 2. Exposed 类型（`src/runtime/types/exposed.ts`）

泛型基类：

```ts
export interface MaptalksGeometryExposed<T extends MaptalksGeometry = MaptalksGeometry> {
  geometry: T | null; show: () => void; hide: () => void; remove: () => void
}
```

每个几何各派一个 type alias：`MaptalksMarkerExposed` / `MaptalksLabelExposed` / ...。

非几何类型：

```ts
export interface MaptalksControlExposed { control: MaptalksControl | null; remove: () => void }
export interface MaptalksToolExposed { tool: MaptalksMapTool | null; remove: () => void }
export interface MaptalksGeoJSONExposed { geometries: MaptalksGeometry[] | null; remove: () => void }
```

### 3. Composable 返回类型泛化（`src/runtime/types/composables.ts`）

```ts
// 之前
export interface UseMaptalksGeometryReturn {
  geometry: ShallowRef<MaptalksGeometry | null>; remove: () => void;
}
// 之后
export interface UseMaptalksGeometryReturn<T extends MaptalksGeometry = MaptalksGeometry> {
  geometry: ShallowRef<T | null>; remove: () => void;
}
```

## 改动文件

### Composable 层（12 个文件，仅改返回类型签名）

| preset | 改后返回类型 |
|--------|-----------|
| `useMaptalksMarker` | `UseMaptalksGeometryReturn<MaptalksMarkerGeometry>` |
| `useMaptalksLabel` | `UseMaptalksGeometryReturn<MaptalksLabelGeometry>` |
| `useMaptalksTextBox` | `UseMaptalksGeometryReturn<MaptalksTextBoxGeometry>` |
| `useMaptalksLineString` | `UseMaptalksGeometryReturn<MaptalksLineStringGeometry>` |
| `useMaptalksPolygon` | `UseMaptalksGeometryReturn<MaptalksPolygonGeometry>` |
| `useMaptalksCircle` | `UseMaptalksGeometryReturn<MaptalksCircleGeometry>` |
| `useMaptalksSector` | `UseMaptalksGeometryReturn<MaptalksSectorGeometry>` |
| `useMaptalksRectangle` | `UseMaptalksGeometryReturn<MaptalksRectangleGeometry>` |
| `useMaptalksEllipse` | `UseMaptalksGeometryReturn<MaptalksEllipseGeometry>` |
| `useMaptalksMultiPoint` | `UseMaptalksGeometryReturn<MaptalksMultiPointGeometry>` |
| `useMaptalksMultiLineString` | `UseMaptalksGeometryReturn<MaptalksGeometry>`（无特有方法） |
| `useMaptalksMultiPolygon` | `UseMaptalksGeometryReturn<MaptalksGeometry>`（无特有方法） |

### 组件层（19 个文件，各加 defineExpose）

**12 个 Geometry 组件**：解构 composable 返回 → `defineExpose({ geometry, show, hide, remove })`（Marker 已解构 `geometry`，改为全解构）

**4 个 Control 组件**：`defineExpose({ control, remove })`

**2 个 Tool 组件**：`defineExpose({ tool, remove })`

**1 个 GeoJSON 组件**：`defineExpose({ geometries, remove })`

### 类型层（3 个文件）

- `structural.ts`：+10 Geometry struct interface
- `exposed.ts`：+12 GeometryExposed type alias + 3 非几何 Exposed
- `composables.ts`：`UseMaptalksGeometryReturn<T>` 泛化

### barrel / auto-import

- `index.ts`：补全部新增 Exposed + Geometry struct
- `public-types.ts`：补全部新增 Exposed

## 不改的

- 12 个 geometry preset 的实现逻辑
- `[key: string]: unknown` 兜底保留
- 已有 10 个有 defineExpose 的组件（Map / Layer / UI）

## 验证

- `pnpm lint` 零 error
- `npx vue-tsc --noEmit`（根 + demo-suite）通过
