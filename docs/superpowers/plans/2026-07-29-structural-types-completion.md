# structural.ts 接口补全 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `src/runtime/types/structural.ts` 中全部 maptalks 实例接口的 public 方法补全到 maptalks.js 1.x API 对齐

**Architecture:** 纯类型文件变更，单一文件 `structural.ts`，分 3 个 Task 顺序执行（Map → Layer 族 → Tool/Control/Window + Namespace），每个 Task 结束后 lint + commit

**Tech Stack:** TypeScript 接口声明，无运行时依赖

## Global Constraints

- 仅修改 `src/runtime/types/structural.ts`，不 touch 其他文件
- 所有接口保留 `[key: string]: unknown` 索引签名
- Mixin 方法（Eventable/Menuable/JSONAble/Renderable）不在接口中声明，由索引签名兜底
- `on` / `off` 已在多个接口声明，保留现状
- 所有返回类型为 `this`（链式调用）或具体类型
- 方法参数签名尽量宽松（`unknown` / `Record<string, unknown>` 为主），与现有 Geometry 补全风格一致
- 每个 Task 结束执行 `pnpm lint`，必须 0 errors
- oxlint zero-error 不增加新 warning

---

### Task 1: MaptalksMap 补全

**Files:**
- Modify: `src/runtime/types/structural.ts:67-155`（MaptalksMap 接口区域）

**Interfaces:**
- Produces: `MaptalksMap` 接口从 ~25 方法扩展到 ~75 方法

- [ ] **Step 1: 读取当前 MaptalksMap 接口**

读 `structural.ts` 的 `MaptalksMap` 定义（行 67-155），确认当前结构。

- [ ] **Step 2: 替换 MaptalksMap 接口**

用以下完整接口替换当前定义：

```ts
/**
 * maptalks 地图实例的结构化建模（覆盖 Map 类全部公共方法）。
 *
 * @description 基于 maptalks.js 1.x API，声明 Map 类的完整公共方法签名。
 * 索引签名提供逃生舱口，可调用任意原生方法。
 *
 * @example
 * const map: MaptalksMap | null = useMaptalks(el).map.value;
 * map?.setCenter([121, 31]).setZoom(14);
 */
export interface MaptalksMap {
  /** 销毁地图并释放 WebGL 上下文 */
  remove(): void;
  /** 是否加载完成 */
  isLoaded(): boolean;
  /** 是否已销毁 */
  isRemoved(): boolean;
  /** 是否正在平移 */
  isMoving(): boolean;
  /** 是否正在缩放 */
  isZooming(): boolean;
  /** 是否正在交互 */
  isInteracting(): boolean;
  /** 是否正在动画 */
  isAnimating(): boolean;
  /** 容器是否离屏 */
  isOffscreen(): boolean;
  /** 获取容器 DOM 元素 */
  getContainer(): HTMLElement | null;
  /** 获取像素尺寸 */
  getSize(): Record<string, number>;
  /** 获取容器像素范围 */
  getContainerExtent(): unknown;
  /** 检查尺寸变化 */
  checkSize(): void;
  /** 获取地理范围 */
  getExtent(): unknown;
  /** 获取空间参考 */
  getSpatialReference(): Record<string, unknown>;
  /** 设置空间参考 */
  setSpatialReference(sr: Record<string, unknown>): this;
  /** 获取投影对象 */
  getProjection(): Record<string, unknown>;
  /** 获取全图范围 */
  getFullExtent(): unknown;
  /** 获取投影范围 */
  getProjExtent(): unknown;
  /** getProjExtent 别名 */
  getPrjExtent(): unknown;
  /** 获取当前中心坐标 */
  getCenter(): MaptalksCoordinate;
  /** 设置中心坐标 */
  setCenter(center: [number, number] | Record<string, number>, padding?: Record<string, number>): this;
  /** 获取当前缩放级别 */
  getZoom(): number;
  /** 设置缩放级别 */
  setZoom(zoom: number, options?: Record<string, unknown>): this;
  /** 获取最大缩放级别 */
  getMaxZoom(): number;
  /** 设置最大缩放级别 */
  setMaxZoom(maxZoom: number): this;
  /** 获取最小缩放级别 */
  getMinZoom(): number;
  /** 设置最小缩放级别 */
  setMinZoom(minZoom: number): this;
  /** 获取最大原生缩放级别 */
  getMaxNativeZoom(): number;
  /** 同时设置中心和缩放 */
  setCenterAndZoom(center: unknown, zoom: number): this;
  /** 计算适配 extent 的缩放级别 */
  getFitZoom(extent: unknown, isFraction?: boolean, padding?: Record<string, number>): number;
  /** 按比例计算缩放 */
  getZoomForScale(scale: number, fromZoom: number, isFraction?: boolean): number;
  /** 获取完整视图（center/zoom/pitch/bearing） */
  getView(): Record<string, unknown>;
  /** 设置完整视图 */
  setView(view: Record<string, unknown>): this;
  /** 读取分辨率 */
  getResolution(zoom?: number): number;
  /** 读取比例尺 */
  getScale(zoom?: number): number;
  /** GL 分辨率 */
  getGLRes(): number;
  /** GL 缩放 */
  getGLScale(zoom?: number): number;
  /** 放大一级 */
  zoomIn(): this;
  /** 缩小一级 */
  zoomOut(): this;
  /** 获取俯仰角 */
  getPitch(): number;
  /** 设置俯仰角 */
  setPitch(pitch: number): this;
  /** 获取方位角 */
  getBearing(): number;
  /** 设置方位角 */
  setBearing(bearing: number): this;
  /** 获取视场角 */
  getFov(): number;
  /** 设置视场角 */
  setFov(fov: number): this;
  /** 设置相机运动 */
  setCameraMovements(opts: Record<string, unknown>): this;
  /** 设置相机朝向 */
  setCameraOrientation(opts: Record<string, unknown>): this;
  /** 设置相机位置 */
  setCameraPosition(opts: Record<string, unknown>): this;
  /** 添加图层 */
  addLayer(layer: MaptalksLayer | MaptalksLayer[]): this;
  /** 移除图层（按实例或 id） */
  removeLayer(layer: MaptalksLayer | string): this;
  /** 按指定 ID 顺序重排图层 */
  sortLayers(layerIds: string[]): this;
  /** 按 ID 获取图层 */
  getLayer(id: string | number): MaptalksLayer | null;
  /** 获取全部图层（可过滤） */
  getLayers(filter?: (layer: MaptalksLayer) => boolean): MaptalksLayer[];
  /** 获取底图 */
  getBaseLayer(): MaptalksLayer | null;
  /** 设置底图 */
  setBaseLayer(layer: MaptalksLayer): this;
  /** 移除底图 */
  removeBaseLayer(): this;
  /** 带动画过渡到目标视图 */
  animateTo(view: MaptalksViewLike, options?: Record<string, unknown>): unknown;
  /** 飞行过渡到目标视图 */
  flyTo(view: MaptalksViewLike, options?: Record<string, unknown>): unknown;
  /** 适配范围 */
  fitExtent(extent: unknown, zoomOffset?: number, options?: Record<string, unknown>): unknown;
  /** 平移到目标坐标 */
  panTo(coord: [number, number] | Record<string, number>, options?: Record<string, unknown>): this;
  /** 按像素偏移平移 */
  panBy(offset: [number, number] | Record<string, unknown>, options?: Record<string, unknown>): this;
  /** 坐标→容器像素点 */
  coordToPoint(coordinate: unknown): unknown;
  /** 指定 zoom 的坐标→像素点 */
  coordToPointAtRes(coordinate: unknown, zoom: number): unknown;
  /** 容器像素点→坐标 */
  pointToCoord(point: unknown): unknown;
  /** 指定 zoom 的像素点→坐标 */
  pointAtResToCoord(point: unknown, zoom: number): unknown;
  /** 坐标→视口点 */
  coordToViewPoint(coordinate: unknown): unknown;
  /** 视口点→坐标 */
  viewPointToCoord(point: unknown): unknown;
  /** 坐标→容器点（别名） */
  coordToContainerPoint(coordinate: unknown): unknown;
  /** 容器点→坐标（别名） */
  containerPointToCoord(point: unknown): unknown;
  /** 批量坐标→容器点 */
  coordinatesToContainerPoints(coordinates: unknown[]): unknown[];
  /** 指定 zoom 批量坐标→容器点 */
  coordinatesToContainerPointsAtRes(coordinates: unknown[], zoom: number): unknown[];
  /** 容器点→视口点 */
  containerPointToViewPoint(point: unknown): unknown;
  /** 视口点→容器点 */
  viewPointToContainerPoint(point: unknown): unknown;
  /** 容器范围→地理范围 */
  containerToExtent(extent: unknown): unknown;
  /** 距离→屏幕像素 */
  distanceToPixel(distance: number, zoom?: number): number;
  /** 屏幕像素→距离 */
  pixelToDistance(pixel: number, zoom?: number): number;
  /** 距离→容器点距 */
  distanceToPoint(distance: number, zoom?: number): number;
  /** 容器点距→距离 */
  pointToDistance(pixel: number, zoom?: number): number;
  /** 指定 zoom 距离→点距 */
  distanceToPointAtRes(distance: number, zoom: number): number;
  /** 指定 zoom 点距→距离 */
  pointAtResToDistance(pixel: number, zoom: number): number;
  /** 高度→屏幕像素 */
  altitudeToPoint(altitude: number, zoom?: number): number;
  /** 偏移定位 */
  locate(coordinate: unknown, dx: number, dy: number): unknown;
  /** 点偏移定位 */
  locateByPoint(coordinate: unknown, point: unknown): unknown;
  /** 计算坐标串地理长度 */
  computeLength(coordinates: unknown[]): number;
  /** 计算几何地理长度 */
  computeGeometryLength(geometry: unknown): number;
  /** 计算几何地理面积 */
  computeGeometryArea(geometry: unknown): number;
  /** 获取最大范围限制 */
  getMaxExtent(): Record<string, number> | null;
  /** 设置最大范围限制 */
  setMaxExtent(extent: unknown): this;
  /** 添加控件 */
  addControl(control: MaptalksControl): this;
  /** 移除控件 */
  removeControl(control: MaptalksControl): this;
  /** 是否全屏 */
  isFullScreen(): boolean;
  /** 请求全屏 */
  requestFullScreen(): this;
  /** 取消全屏 */
  cancelFullScreen(): this;
  /** 获取视口历史 */
  getViewHistory(): Array<Record<string, unknown>>;
  /** 回退到前一视图 */
  zoomToPreviousView(): this;
  /** 前进到后一视图 */
  zoomToNextView(): this;
  /** 是否有前一视图 */
  hasPreviousView(): boolean;
  /** 是否有后一视图 */
  hasNextView(): boolean;
  /** 获取主面板 */
  getMainPanel(): unknown;
  /** 获取全部面板 */
  getPanels(): unknown[];
  /** 识别坐标处的要素 */
  identify(coordinate: unknown, options?: Record<string, unknown>): unknown[];
  /** 识别像素点处的要素 */
  identifyAtPoint(point: unknown, options?: Record<string, unknown>): unknown[];
  /** 导出截图 DataURL */
  toDataURL(options?: Record<string, unknown>): string;
  /** 序列化为 Profile JSON */
  toJSON(options?: Record<string, unknown>): Record<string, unknown>;
  /** 设置光标样式 */
  setCursor(cursor: string): this;
  /** 重置光标样式 */
  resetCursor(): this;
  /** 获取设备像素比 */
  getDevicePixelRatio(): number;
  /** 设置设备像素比 */
  setDevicePixelRatio(ratio: number): this;
  /** 平台偏移 */
  offsetPlatform(): [number, number];
  /** 获取视口点 */
  getViewPoint(): unknown;
  /** 获取 padding 像素尺寸 */
  _getPaddingSize(options: Record<string, unknown>): Record<string, number> | null;
  /** 内部分辨率批量坐标转容器点 */
  _pointsAtResToContainerPoints(points: unknown[], zoom: number): unknown[];
  /** 绑定事件 */
  on(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}
```

- [ ] **Step 3: 执行 lint 验证**

```bash
pnpm lint
```

预期：0 errors，保持现有 14 warnings 不增加。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: MaptalksMap 补全 1.x API 全部方法（~50新增）"
```

---

### Task 2: Layer 族补全 + 新建 9 个子类接口

**Files:**
- Modify: `src/runtime/types/structural.ts` 中的 `MaptalksLayer`（行 ~146）、`MaptalksVectorLayer`（行 ~310）
- Create: 9 个新 Layer 子类接口（列于 `MaptalksVectorLayer` 之后、`MaptalksDrawTool` 之前）

**Interfaces:**
- Produces: 补全的 `MaptalksLayer`（~30 方法）、`MaptalksVectorLayer`（~17 方法）、新建 `MaptalksTileLayer` 等 9 个接口

- [ ] **Step 1: 读取当前 MaptalksLayer 和 MaptalksVectorLayer**

读 structural.ts 确认当前内容，了解插入新接口的位置。

- [ ] **Step 2: 替换 MaptalksLayer 接口**

```ts
/**
 * maptalks 图层基类的结构化建模（覆盖 Layer 类全部公共方法）。
 *
 * @description 基于 maptalks.js 1.x API，声明 Layer 基类的完整公共方法签名。
 * 所有子类图层均继承此接口。
 *
 * @example
 * const layer: MaptalksLayer | null = useMaptalksTileLayer(map).layer.value;
 * layer?.setOpacity(0.8).show();
 */
export interface MaptalksLayer {
  /** 从地图移除并销毁 */
  remove(): this;
  /** 添加到地图 */
  addTo(map: MaptalksMap): this;
  /** 加载图层 */
  load(): void;
  /** 是否加载完成 */
  isLoaded(): boolean;
  /** 是否 Canvas 渲染 */
  isCanvasRender(): boolean;
  /** 准备加载（子类重写），返回 false 终止加载 */
  onLoad(): boolean;
  /** 获取图层 ID */
  getId(): string | number;
  /** 设置图层 ID */
  setId(id: string | number): this;
  /** 获取关联地图 */
  getMap(): MaptalksMap | null;
  /** 获取投影对象 */
  getProjection(): Record<string, unknown>;
  /** 获取 z-index */
  getZIndex(): number;
  /** 设置 z-index */
  setZIndex(zIndex: number): this;
  /** 置顶 */
  bringToFront(): this;
  /** 置底 */
  bringToBack(): this;
  /** 显示 */
  show(): this;
  /** 隐藏 */
  hide(): this;
  /** 是否可见 */
  isVisible(): boolean;
  /** 获取透明度 */
  getOpacity(): number;
  /** 设置透明度 */
  setOpacity(opacity: number): this;
  /** 获取最小可见 zoom */
  getMinZoom(): number;
  /** 获取最大可见 zoom */
  getMaxZoom(): number;
  /** 获取遮罩几何 */
  getMask(): MaptalksGeometry | null;
  /** 设置遮罩几何 */
  setMask(mask: MaptalksGeometry): this;
  /** 移除遮罩 */
  removeMask(): this;
  /** 获取碰撞索引 */
  getCollisionIndex(): unknown;
  /** 清除碰撞索引 */
  clearCollisionIndex(): void;
  /** 绑定事件 */
  on(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}
```

- [ ] **Step 3: 替换 MaptalksVectorLayer 接口**

```ts
/**
 * maptalks 矢量图层实例的结构化建模（extends Layer）。
 *
 * @description 在 Layer 基础上补充几何增删、样式筛选、动画展示等方法。
 *
 * @example
 * const layer: MaptalksVectorLayer = useMaptalksVectorLayer(map).layer.value!;
 * const geo = layer.getGeometryById(100);
 */
export interface MaptalksVectorLayer extends MaptalksLayer {
  /** 添加一个或多个几何 */
  addGeometry(geo: MaptalksGeometry | MaptalksGeometry[]): this;
  /** 移除一个几何 */
  removeGeometry(geo: MaptalksGeometry): this;
  /** 读取全部几何 */
  getGeometries(): MaptalksGeometry[];
  /** 按 ID 获取几何 */
  getGeometryById(id: string | number): MaptalksGeometry | null;
  /** 获取几何数量 */
  getCount(): number;
  /** 清空全部几何 */
  clear(): this;
  /** 设置图层级样式（支持 filter + symbol 数组） */
  setStyle(style: Record<string, unknown> | Array<unknown>): this;
  /** 获取图层级样式 */
  getStyle(): unknown;
  /** 移除图层级样式 */
  removeStyle(): this;
  /** 按条件筛选几何 */
  filter(condition: unknown[]): MaptalksGeometry[];
  /** 遍历全部几何 */
  forEach(fn: (geo: MaptalksGeometry) => void): this;
  /** 排序几何 */
  sort(fn: (a: MaptalksGeometry, b: MaptalksGeometry) => number): this;
  /** 几何逐个动画展示 */
  animateShow(options?: Record<string, unknown>, cb?: (...args: unknown[]) => void): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 4: 新建 9 个 Layer 子类接口 + 2 个 Geometry 子接口**

在 `MaptalksVectorLayer` 之后、`MaptalksDrawTool` 之前插入以下接口块（9 个 Layer 子类 + 2 个 Geometry 子类）：

```ts
// ───────────────────────────────── Geometry Narrow Struct (supplement) ─────────────────────────────────

/**
 * MultiLineString 几何窄类型（extends MaptalksGeometry）。
 */
export interface MaptalksMultiLineStringGeometry extends MaptalksGeometry {
  /** 读取 MultiLineString 坐标 */
  getCoordinates(): unknown[][][];
  /** 设置 MultiLineString 坐标 */
  setCoordinates(coordinates: unknown[][][]): this;
}

/**
 * MultiPolygon 几何窄类型（extends MaptalksGeometry）。
 */
export interface MaptalksMultiPolygonGeometry extends MaptalksGeometry {
  /** 读取 MultiPolygon 坐标 */
  getCoordinates(): unknown[][][][];
  /** 设置 MultiPolygon 坐标 */
  setCoordinates(coordinates: unknown[][][][]): this;
}

// ───────────────────────────────── Layer Subclass Struct ─────────────────────────────────

/**
 * TileLayer 栅格瓦片图层实例（extends Layer）。
 */
export interface MaptalksTileLayer extends MaptalksLayer {
  /** 获取瓦片列表 */
  getTiles(): unknown[];
  /** 按坐标获取瓦片 URL */
  getTileUrl(x: number, y: number, z: number): string;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * VectorTileLayer 矢量瓦片图层实例（extends Layer）。
 */
export interface MaptalksVectorTileLayer extends MaptalksLayer {
  /** 设置矢量样式 */
  setStyle(style: Record<string, unknown>): this;
  /** 获取矢量样式 */
  getStyle(): Record<string, unknown>;
  /** 获取数据源 */
  getSource(): unknown;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * WMSLayer 实例（extends Layer）。
 */
export interface MaptalksWMSLayer extends MaptalksLayer {
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * GroupGLLayer GL 图层组实例（extends Layer）。
 */
export interface MaptalksGroupGLLayer extends MaptalksLayer {
  /** 添加子 GL 图层 */
  addLayer(layer: MaptalksLayer): this;
  /** 移除子 GL 图层 */
  removeLayer(layer: MaptalksLayer | string): this;
  /** 获取子图层列表 */
  getLayers(): MaptalksLayer[];
  /** 设置场景配置 */
  setSceneConfig(config: Record<string, unknown>): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * GLTFLayer glTF 模型图层实例（extends Layer）。
 */
export interface MaptalksGLTFLayer extends MaptalksLayer {
  /** 设置模型 URL */
  setUrl(url: string): this;
  /** 获取模型 URL */
  getUrl(): string;
  /** 设置缩放 */
  setScale(scale: number): this;
  /** 设置旋转 */
  setRotation(rotation: unknown): this;
  /** 设置平移 */
  setTranslation(translation: unknown): this;
  /** 获取模型对象 */
  getModel(): unknown;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * CanvasLayer 自定义 Canvas 图层实例（extends Layer）。
 */
export interface MaptalksCanvasLayer extends MaptalksLayer {
  /** 触发重新渲染 */
  render(): this;
  /** 获取 Canvas 2D 上下文 */
  getContext(): CanvasRenderingContext2D | null;
  /** 绘制回调（子类重写） */
  draw?(context: unknown): void;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * ParticleLayer 粒子图层实例（extends Layer）。
 */
export interface MaptalksParticleLayer extends MaptalksLayer {
  /** 设置粒子数据 */
  setData(data: unknown): this;
  /** 获取粒子数据 */
  getData(): unknown;
  /** 更新粒子配置 */
  setOptions(opts: Record<string, unknown>): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * ImageLayer 图片图层实例（extends Layer）。
 */
export interface MaptalksImageLayer extends MaptalksLayer {
  /** 设置图片 URL */
  setUrl(url: string): this;
  /** 获取图片 URL */
  getUrl(): string;
  /** 设置经纬度范围 */
  setExtent(extent: unknown): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * CanvasTileLayer 自定义 Canvas 瓦片图层实例（extends Layer）。
 */
export interface MaptalksCanvasTileLayer extends MaptalksLayer {
  /** 绘制单个瓦片（子类重写） */
  drawTile?(context: unknown, x: number, y: number, z: number): void;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 5: 执行 lint 验证**

```bash
pnpm lint
```

预期：0 errors。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: MaptalksLayer/VectorLayer 补全 + 新建 9 个 Layer 子类接口"
```

---

### Task 3: Tool / Control / Window 补全 + MaptalksGLNamespace 构造器窄化

**Files:**
- Modify: `src/runtime/types/structural.ts` 中的 `MaptalksDrawTool`、`MaptalksMapTool`、`MaptalksControl`、`MaptalksInfoWindow`、`MaptalksUIMarker`、`MaptalksGLNamespace`

**Interfaces:**
- Produces: 补全的 5 个工具/控件接口 + `MaptalksGLNamespace` 构造器返回类型窄化

- [ ] **Step 1: 补全 MaptalksDrawTool**

读取当前 DrawTool 定义，在其基础上追加方法。用以下完整接口替换：

```ts
/**
 * maptalks DrawTool 实例的结构化建模。
 */
export interface MaptalksDrawTool {
  /** 绑定到地图 */
  addTo(map: MaptalksMap): this;
  /** 启用绘制 */
  enable(): this;
  /** 关闭绘制 */
  disable(): this;
  /** 切换绘制模式 */
  setMode(mode: string): this;
  /** 获取当前模式 */
  getMode(): string;
  /** 设置绘制样式 */
  setSymbol(symbol: Record<string, unknown>): this;
  /** 获取绘制样式 */
  getSymbol(): Record<string, unknown>;
  /** 设置测量选项 */
  setMeasureOptions(opts: Record<string, unknown>): this;
  /** 获取测量选项 */
  getMeasureOptions(): Record<string, unknown>;
  /** 移除绘制工具 */
  remove(): void;
  /** 绑定事件 */
  on(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 2: 补全 MaptalksMapTool**

```ts
/**
 * maptalks 测量工具实例的结构化建模（DistanceTool / AreaTool 基类）。
 */
export interface MaptalksMapTool {
  /** 绑定到地图 */
  addTo(map: MaptalksMap): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 启用工具 */
  enable(): this;
  /** 关闭工具 */
  disable(): this;
  /** 是否启用 */
  isEnabled(): boolean;
  /** 获取测量结果 */
  getMeasurements(): unknown[];
  /** 清除测量结果 */
  clear(): this;
  /** 获取最后一次测量值 */
  getLastMeasure(): number;
  /** 绑定事件 */
  on(event: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off(event: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 3: 补全 MaptalksControl**

```ts
/**
 * maptalks 控件实例的结构化建模。
 */
export interface MaptalksControl {
  /** 挂载到地图 */
  addTo(map: MaptalksMap): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 获取关联地图 */
  getMap(): MaptalksMap | null;
  /** 显示控件 */
  show(): this;
  /** 隐藏控件 */
  hide(): this;
  /** 是否可见 */
  isVisible(): boolean;
  /** 设置位置 */
  setPosition(position: string | Record<string, unknown>): this;
  /** 获取位置 */
  getPosition(): string | Record<string, unknown>;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 4: 补全 MaptalksInfoWindow**

读取当前 InfoWindow 定义，追加缺失方法：

```ts
export interface MaptalksInfoWindow {
  /** 挂载到地图或其它对象 */
  addTo(target: MaptalksMap | unknown): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 显示弹出框，可传入坐标 */
  show(coord?: unknown): this;
  /** 隐藏弹出框 */
  hide(): this;
  /** 是否可见 */
  isVisible(): boolean;
  /** 设置弹出框内容（HTML 字符串或 DOM 元素） */
  setContent(content: string | HTMLElement): this;
  /** 获取弹出框内容 */
  getContent(): string | HTMLElement;
  /** 设置弹出框坐标 */
  setCoordinates(coord: unknown): this;
  /** 获取弹出框坐标 */
  getCoordinates(): unknown;
  /** 设置标题 */
  setTitle(title: string): this;
  /** 获取标题 */
  getTitle(): string;
  /** 绑定事件 */
  on?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 5: 补全 MaptalksUIMarker**

```ts
export interface MaptalksUIMarker {
  /** 挂载到地图 */
  addTo(target: MaptalksMap | unknown): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 显示标注 */
  show(): this;
  /** 隐藏标注 */
  hide(): this;
  /** 是否可拖拽 */
  isDraggable(): boolean;
  /** 设置坐标 */
  setCoordinates(coord: unknown): this;
  /** 获取坐标 */
  getCoordinates(): unknown;
  /** 设置内容（HTML 字符串或 DOM 元素） */
  setContent(content: string | HTMLElement): this;
  /** 获取内容 */
  getContent(): string | HTMLElement;
  /** 获取 DOM 元素 */
  getDom(): HTMLElement;
  /** 绑定事件 */
  on?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}
```

- [ ] **Step 6: 窄化 MaptalksGLNamespace 构造器返回类型**

将 18 个构造器的返回类型从通用 `MaptalksGeometry` / `MaptalksLayer` 改为窄化子类接口：

| 构造器 | 改为 |
|--------|------|
| `Marker?:` | `MaptalksMarkerGeometry` |
| `LineString?:` | `MaptalksLineStringGeometry` |
| `Polygon?:` | `MaptalksPolygonGeometry` |
| `Circle?:` | `MaptalksCircleGeometry` |
| `Rectangle?:` | `MaptalksRectangleGeometry` |
| `Ellipse?:` | `MaptalksEllipseGeometry` |
| `Sector?:` | `MaptalksSectorGeometry` |
| `Label?:` | `MaptalksLabelGeometry` |
| `TextBox?:` | `MaptalksTextBoxGeometry` |
| `MultiPoint?:` | `MaptalksMultiPointGeometry` |
| `MultiLineString?:` | `MaptalksMultiLineStringGeometry` |
| `MultiPolygon?:` | `MaptalksMultiPolygonGeometry` |
| `VectorLayer?:` | 保持 `MaptalksVectorLayer`（已窄化） |
| `TileLayer` | `MaptalksTileLayer` |
| `VectorTileLayer?:` | `MaptalksVectorTileLayer` |
| `WMSLayer?:` | `MaptalksWMSLayer` |
| `GroupGLLayer?:` | `MaptalksGroupGLLayer` |
| `GLTFLayer?:` | `MaptalksGLTFLayer` |

`WMSTileLayer?`、`GeoJSON?`、`DrawTool?`、`DistanceTool?`、`AreaTool?`、`control?`、`ui?` 保持不变。

- [ ] **Step 7: 执行 lint 验证**

```bash
pnpm lint
```

预期：0 errors。

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: Tool/Control/Window 补全 + GLNamespace 构造器窄化"
```

---

## Self-Review

1. **Spec coverage**: Task 1 covers MaptalksMap (§4), Task 2 covers Layer 族 (§5-7), Task 3 covers Tool/Control/Window (§8) + Namespace (§9). All spec sections mapped.
2. **Placeholder scan**: No TBD/TODO. All code blocks are complete interface definitions.
3. **Type consistency**: `MaptalksControl`/`MaptalksMapTool`/`MaptalksDrawTool` types used consistently across MaptalksGLNamespace and interface definitions. `MaptalksCoordinate` already defined earlier in file. All interfaces follow same pattern (JSDoc + `this` returns + `[key: string]: unknown`).
