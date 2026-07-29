# 设计文档：补全 maptalks 原生实例接口类型（Map / Layer / Tool / Control / Window）

**日期**: 2026-07-29  
**状态**: 待实现  
**分支**: `feat/demo-suite-example2`  
**关联**: `src/runtime/types/structural.ts`

## 1. 目标

将 `src/runtime/types/structural.ts` 中所有 maptalks 原生实例接口的 public 方法声明补全到与 maptalks.js **1.x API** 对齐。

- 已有接口：补全缺失方法
- 缺失接口：新建实例类型（现有只有 Options 类型，无 instance 窄化接口）
- `MaptalksGLNamespace` 构造器返回类型窄化为子类接口

## 2. 范围

### 2.1 已有接口补全（8 个）

| 接口 | 当前方法数 | 预计完成后 | 新增 |
|------|:---:|:---:|:---:|
| `MaptalksMap` | ~25 | ~75 | ~50 |
| `MaptalksLayer` | ~10 | ~30 | ~20 |
| `MaptalksVectorLayer extends MaptalksLayer` | 5 | ~17 | ~12 |
| `MaptalksDrawTool` | 6 | ~11 | ~5 |
| `MaptalksMapTool` | 6 | ~11 | ~5 |
| `MaptalksControl` | 3 | ~9 | ~6 |
| `MaptalksInfoWindow` | 9 | ~14 | ~5 |
| `MaptalksUIMarker` | 8 | ~12 | ~4 |

### 2.2 新建 Layer 子类接口（9 个）

全部 `extends MaptalksLayer`：

| 新建接口 | 独有方法数 |
|----------|:---:|
| `MaptalksTileLayer` | 2 |
| `MaptalksVectorTileLayer` | 3 |
| `MaptalksWMSLayer` | 0 |
| `MaptalksGroupGLLayer` | 4 |
| `MaptalksGLTFLayer` | 6 |
| `MaptalksCanvasLayer` | 3 |
| `MaptalksParticleLayer` | 3 |
| `MaptalksImageLayer` | 3 |
| `MaptalksCanvasTileLayer` | 1 |

### 2.3 MaptalksGLNamespace 构造器窄化

18 个构造器的返回类型从通用的 `MaptalksGeometry` / `MaptalksLayer` 改为对应的窄化子类接口（如 `Marker?` → `MaptalksMarkerGeometry`、`TileLayer` → `MaptalksTileLayer` 等）。

## 3. 设计原则

### 3.1 仅声明类自有方法，不建模 mixin

Mixin 方法（Eventable 的 `once`/`listens`/`fire`、Menuable 的 `setMenu`/`getMenu`、JSONAble、Renderable 等）全部由 `[key: string]: unknown` 兜底，不在各接口重复声明。

**例外**: `on` / `off` 已在多个接口中单独声明（实际高频使用），保留现状。

与 `MaptalksGeometry` 补完时采用的策略一致。

### 3.2 链式调用

所有有返回值的方法返回类型为 `this`（各接口返回自身类型），支持链式调用如 `map.setCenter(c).setZoom(z)`。

### 3.3 仅改一个文件

所有变更集中在 `src/runtime/types/structural.ts`，不涉及 composable、组件或构建产物。

### 3.4 向后兼容

- 所有变更均为**新增**方法，不在已有方法上收窄参数或去除可选标记
- 全部接口保留 `[key: string]: unknown` 索引签名
- 现有代码无需任何改动

### 3.5 无 ESLint/oxlint 新增错误

类型声明不产生运行时代码，oxlint 对 type-only 变更友好。

## 4. MaptalksMap 补全清单

按功能分组，`✓` 表示已有：

### 4.1 生命周期 / 状态
✓ `remove()` — 销毁地图  
`isLoaded()` — 是否加载完成  
`isRemoved()` — 是否已销毁  
`isMoving()` — 是否正在移动  
✓ `isZooming()` — 是否正在缩放  
`isInteracting()` — 是否正在交互  
`isAnimating()` — 是否正在动画  
`isOffscreen()` — 容器是否离屏

### 4.2 容器 / 尺寸
`getContainer()` — 获取容器 DOM 元素  
`getSize()` — 像素尺寸  
`getContainerExtent()` — 容器像素范围  
`checkSize()` — 检查尺寸变化  
✓ `getExtent()` — 地理范围

### 4.3 空间参考 / 投影
`getSpatialReference()` / `setSpatialReference(sr)` — 空间参考读写  
`getProjection()` — 获取投影对象  
`getFullExtent()` — 全图范围  
`getProjExtent()` / `getPrjExtent()` — 投影范围

### 4.4 中心 / 缩放 / 视图
✓ `getCenter()` / `setCenter(c, padding?)`  
✓ `getZoom()` / `setZoom(z, opts?)`  
`getMaxZoom()` / `setMaxZoom(z)` / `getMinZoom()` / `setMinZoom(z)` — 缩放限制  
`getMaxNativeZoom()` — 最大原生缩放  
`getFitZoom(extent, isFraction)` — 计算适配 zoom  
`getZoomForScale(scale, fromZoom, isFraction)` — 按比例算 zoom  
`setCenterAndZoom(c, z)` — 同时设中心和 zoom  
✓ `getView()` / `setView(v)` — 完整视图  
✓ `getResolution(zoom?)` / `getScale(zoom?)` — 分辨率/比例尺  
`getGLRes()` / `getGLScale(zoom?)` — GL 分辨率/缩放  
✓ `zoomIn()` / `zoomOut()`

### 4.5 俯仰 / 方位 / 视场
✓ `getPitch()` / `setPitch(p)`  
✓ `getBearing()` / `setBearing(b)`  
`getFov()` / `setFov(f)`  
`setCameraMovements(...)` / `setCameraOrientation(...)` / `setCameraPosition(...)`

### 4.6 底图 / 图层
✓ `addLayer(l)` / `removeLayer(l)` / `sortLayers(ids)`  
`getLayer(id)` / `getLayers(filter?)` — 按 ID/条件 获取图层  
`getBaseLayer()` / `setBaseLayer(l)` / `removeBaseLayer()` — 底图管理

### 4.7 动画 / 过渡
✓ `animateTo(view, opts?)` / `flyTo(view, opts?)` / `fitExtent(...)` / `panTo(c, opts?)` / `panBy(o, opts?)`

### 4.8 坐标转换（15 个）
`coordToPoint(c)` / `coordToPointAtRes(c, z)` — 坐标→容器点  
`pointToCoord(p)` / `pointAtResToCoord(p, z)` — 容器点→坐标  
`coordToViewPoint(c)` / `viewPointToCoord(p)` — 坐标→视口点  
`coordToContainerPoint(c)` / `containerPointToCoord(p)` — 坐标→容器点（别名）  
`containerPointToViewPoint(p)` / `viewPointToContainerPoint(p)` — 容器/视口互转  
`coordinatesToContainerPoints(coords)` / `coordinatesToContainerPointsAtRes(coords, z)` — 批量转换  
`containerToExtent(e)` — 容器范围→地理范围  
`distanceToPixel(d, z?)` / `pixelToDistance(px, z?)` — 距离/像素互转  
`distanceToPoint(d, z?)` / `pointToDistance(p, z?)` — 距离/点距互转  
`distanceToPointAtRes(d, z)` / `pointAtResToDistance(p, z)` — 指定 zoom 距离互转  
`altitudeToPoint(alt, z?)` — 高度→像素

### 4.9 度量 / 投影
`locate(c, dx, dy)` / `locateByPoint(c, p)` — 偏移定位  
`computeLength(coords)` — 计算地理长度  
`computeGeometryLength(geo)` — 计算几何长度  
`computeGeometryArea(geo)` — 计算几何面积

### 4.10 范围限制
`getMaxExtent()` / `setMaxExtent(e)`  
✓ `getExtent()`

### 4.11 控件 / 全屏 / 视口历史
`addControl(c)` / `removeControl(c)`  
`isFullScreen()` / `requestFullScreen()` / `cancelFullScreen()`  
`getViewHistory()` / `zoomToPreviousView()` / `zoomToNextView()` / `hasPreviousView()` / `hasNextView()`  
`getMainPanel()` / `getPanels()`

### 4.12 识别 / 导出 / 光标 / 设备
`identify(p, opts?)` / `identifyAtPoint(p, opts?)`  
`toDataURL(opts?)` / `toJSON(opts?)`  
`setCursor(c)` / `resetCursor()`  
`getDevicePixelRatio()` / `setDevicePixelRatio(r)`  
`getViewPoint()` / `offsetPlatform()`  
`_getPaddingSize(options)` / `_pointToExtent(extent)` / `_pointsAtResToContainerPoints(...)`

### 4.13 事件
✓ `on(e, h)` / `off(e, h)`

### 4.14 兜底
`[key: string]: unknown`

**总计**: ~75 个方法（当前 ~25 → +50 个新增）

## 5. MaptalksLayer 补全清单

### 生命周期 / 状态
✓ `remove()`  
`addTo(map)` / `load()` — 添加到地图 / 加载  
`isLoaded()` / `isCanvasRender()` — 状态查询  
`onLoad()` — 准备加载（子类重写）

### ID / 查询
`getId()` / `setId(id: string | number)`  
`getMap()` / `getProjection()`

### 层级 / 显隐 / 透明度
`getZIndex()` / `setZIndex(z)` / `bringToFront()` / `bringToBack()`  
`show()` / `hide()` / `isVisible()`  
`getOpacity()` / `setOpacity(o)`

### 缩放范围 / 遮罩 / 碰撞
`getMinZoom()` / `getMaxZoom()`  
`getMask()` / `setMask(mask: MaptalksGeometry)` / `removeMask()`  
`getCollisionIndex()` / `clearCollisionIndex()`

### 事件 / 兜底
✓ `on(e, h)` / `off(e, h)`  
`[key: string]: unknown`

**总计**: ~30 个方法（当前 ~10 → +20 个新增）

## 6. MaptalksVectorLayer 补全清单

### 几何管理
✓ `addGeometry(geo)` / `removeGeometry(geo)` / `getGeometries()` / `clear()`  
`getGeometryById(id: string | number): MaptalksGeometry | null`  
`getCount(): number` — 几何数量

### 样式
`setStyle(style: Record<string, unknown> | Array<unknown>)` / `getStyle()` / `removeStyle()`

### 筛选 / 排序
`filter(condition: unknown[]): MaptalksGeometry[]`  
`forEach(fn: (geo: MaptalksGeometry) => void): this`  
`sort(fn: (a: MaptalksGeometry, b: MaptalksGeometry) => number): this`

### 动画
`animateShow(opts?: Record<string, unknown>, cb?: (...args: unknown[]) => void): this`

### 兜底
`[key: string]: unknown`

**总计**: ~17 个方法（当前 5 → +12 个新增）

## 7. 新建 Layer 子类接口

全部 `extends MaptalksLayer`，仅声明子类独有的方法。

### MaptalksTileLayer
- `getTiles(): unknown[]` — 获取瓦片列表
- `getTileUrl(x: number, y: number, z: number): string` — 获取瓦片 URL

### MaptalksVectorTileLayer
- `setStyle(style: Record<string, unknown>): this`
- `getStyle(): Record<string, unknown>`
- `getSource(): unknown`

### MaptalksWMSLayer
无独有方法。

### MaptalksGroupGLLayer
- `addLayer(layer: MaptalksLayer): this`
- `removeLayer(layer: MaptalksLayer | string): this`
- `getLayers(): MaptalksLayer[]`
- `setSceneConfig(config: Record<string, unknown>): this`

### MaptalksGLTFLayer
- `setUrl(url: string): this` / `getUrl(): string`
- `setScale(s: number): this` / `setRotation(r: unknown): this` / `setTranslation(t: unknown): this`
- `getModel(): unknown`

### MaptalksCanvasLayer
- `draw(ctx: unknown): void` — 子类重写
- `render(): this` — 触发重新渲染
- `getContext(): unknown` — 获取 Canvas 上下文

### MaptalksParticleLayer
- `setData(data: unknown): this` / `getData(): unknown`
- `setOptions(opts: Record<string, unknown>): this`

### MaptalksImageLayer
- `setUrl(url: string): this` / `getUrl(): string`
- `setExtent(extent: unknown): this`

### MaptalksCanvasTileLayer
- `drawTile(ctx: unknown, x: number, y: number, z: number): void` — 子类重写

每个接口均保留 `[key: string]: unknown` 兜底。

## 8. Tool / Control / Window 补全清单

### MaptalksDrawTool
新增: `getMode()`, `setSymbol(s)`, `getSymbol()`, `setMeasureOptions(opts)`, `getMeasureOptions()`

### MaptalksMapTool
新增: `isEnabled()`, `getMeasurements()`, `clear()`, `getLastMeasure()`

### MaptalksControl
新增: `getMap()`, `show()`, `hide()`, `isVisible()`, `setPosition(p)`, `getPosition()`

### MaptalksInfoWindow
新增: `getContent()`, `getCoordinates()`, `setTitle(t)`, `getTitle()`

### MaptalksUIMarker
新增: `getCoordinates()`, `getContent()`, `getDom()`, `isDraggable()`

## 9. MaptalksGLNamespace 构造器窄化

18 个构造器的返回类型替换为窄化子类接口：

| 构造器 | 当前返回 | 窄化为 |
|--------|----------|--------|
| `Marker?` | `MaptalksGeometry` | `MaptalksMarkerGeometry` |
| `LineString?` | `MaptalksGeometry` | `MaptalksLineStringGeometry` |
| `Polygon?` | `MaptalksGeometry` | `MaptalksPolygonGeometry` |
| `Circle?` | `MaptalksGeometry` | `MaptalksCircleGeometry` |
| `Rectangle?` | `MaptalksGeometry` | `MaptalksRectangleGeometry` |
| `Ellipse?` | `MaptalksGeometry` | `MaptalksEllipseGeometry` |
| `Sector?` | `MaptalksGeometry` | `MaptalksSectorGeometry` |
| `Label?` | `MaptalksGeometry` | `MaptalksLabelGeometry` |
| `TextBox?` | `MaptalksGeometry` | `MaptalksTextBoxGeometry` |
| `MultiPoint?` | `MaptalksGeometry` | `MaptalksMultiPointGeometry` |
| `MultiLineString?` | `MaptalksGeometry` | `MaptalksGeometry`（无窄化接口） |
| `MultiPolygon?` | `MaptalksGeometry` | `MaptalksGeometry`（无窄化接口） |
| `VectorLayer?` | `MaptalksVectorLayer` | 不变（已窄化） |
| `TileLayer` | `MaptalksLayer` | `MaptalksTileLayer` |
| `VectorTileLayer?` | `MaptalksLayer` | `MaptalksVectorTileLayer` |
| `WMSLayer?` | `MaptalksLayer` | `MaptalksWMSLayer` |
| `GroupGLLayer?` | `MaptalksLayer` | `MaptalksGroupGLLayer` |
| `GLTFLayer?` | `MaptalksLayer` | `MaptalksGLTFLayer` |

## 10. 不计入范围

- Mixin 方法（Eventable/Menuable/JSONAble/Renderable 的方法）：由 `[key: string]: unknown` 兜底
- Layer/Control 等自身的 Options 类型：已有对应接口，无需变更
- Composable / Component 层面：不受影响

## 11. 实现策略

一次性提交（方案 A），分 3 个步骤物理写入同一个 commit：

1. `MaptalksMap` 补全（编辑 ~50 个方法）
2. Layer 族：`MaptalksLayer` → `MaptalksVectorLayer` → 新建 9 个子类接口（编辑 ~60 行 + 新建 9 个接口块）
3. Tool/Control/Window + `MaptalksGLNamespace` 构造器窄化（编辑 ~30 个方法）

方式：使用 `edit` 工具逐个替换 `structural.ts`，最后 `pnpm lint` 验证 → 推送。
