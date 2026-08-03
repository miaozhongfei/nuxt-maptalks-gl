/* oxlint-disable max-lines */

/**
 * 结构化/实例类型：地图实例、图层、几何、控件、工具、符号体系等。
 *
 * @description 所有接口均为 maptalks-gl 原生实例的最小结构化建模，
 * 核心方法给出精确签名，索引签名提供逃生舱口。
 */

/**
 * 地图坐标的最小结构（经度 x / 纬度 y）。
 *
 * @description 对 maptalks `Coordinate` 的最小可用建模，仅保留 x/y 并允许携带其它字段。
 * 本模块不内置 maptalks 的完整 Coordinate 类型，避免在 peerDependency 未安装时破坏 typecheck。
 *
 * @example
 * const c: MaptalksCoordinate = { x: 113.27, y: 23.13 };
 */
export interface MaptalksCoordinate {
  /** 经度 */
  x: number;
  /** 纬度 */
  y: number;
  /** 允许携带 maptalks Coordinate 的其它字段 */
  [key: string]: unknown;
}

/**
 * 右键菜单项（ui.Menuable mixin）。
 *
 * @description 图标/分隔符等扩展字段通过索引签名透传。
 *
 * @example
 * const item: MaptalksMenuItem = { item: '放大', click: () => map.zoomIn() }
 */
export interface MaptalksMenuItem {
  /** 菜单项文本 */
  item: string;
  /** 点击回调（返回 false 阻止事件冒泡） */
  click: (coordinate?: { x: number; y: number }) => unknown;
  /** 允许携带 maptalks 原生额外字段（disable、children 等） */
  [key: string]: unknown;
}

/**
 * map.setMenu / geometry.setMenu 的选项。
 *
 * @description `items` 中 `'-'` 表示分隔线。
 *
 * @example
 * map.setMenu({ width: 160, items: [{ item: '放大', click: () => map.zoomIn() }, '-', { item: '缩小', click: () => map.zoomOut() }] })
 */
export interface MaptalksMenuOptions {
  /** 菜单宽度（px） */
  width?: number;
  /** 是否使用自定义容器 */
  custom?: boolean;
  /** 菜单项（custom 模式下可为 HTML 字符串或元素；slot 模式下可省略由组件注入） */
  items?: (MaptalksMenuItem | '-')[] | string | HTMLElement;
  /** 允许携带 maptalks 原生额外字段 */
  [key: string]: unknown;
}

/**
 * 相机视图描述（用于 animateTo / flyTo 等）。
 *
 * @description 描述目标视图的中心、缩放、俯仰、方位，字段均可选。
 *
 * @example
 * const view: MaptalksViewLike = { center: [113.27, 23.13], zoom: 12, pitch: 45 };
 */
export interface MaptalksViewLike {
  /** 地图中心 */
  center?: [number, number];
  /** 目标缩放级别 */
  zoom?: number;
  /** 目标俯仰角（度） */
  pitch?: number;
  /** 目标方位角（度） */
  bearing?: number;
}

/**
 * maptalks 事件处理器签名。
 *
 * @description 事件对象的具体形状由 maptalks 决定，这里以 unknown 暴露，由调用方按需断言。
 *
 * @example
 * const onClick: MaptalksEventHandler = (e) => console.warn('clicked', e);
 */
export type MaptalksEventHandler = (event: unknown) => void;

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
export interface MaptalksMap extends MaptalksClass {
  /** 销毁地图并释放 WebGL 上下文 */
  remove(): void;
  /** 从 Profile JSON 重现地图 */
  fromJSON(json: unknown): MaptalksMap;
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
  getSize(): { width: number; height: number };
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
  /** 识别坐标处的要素（opts 包含 coordinate / layers / tolerance / count，callback 接收命中的几何数组） */
  identify(opts: { coordinate?: unknown; layers?: MaptalksLayer[]; tolerance?: number; count?: number }, callback?: (geometries: unknown[]) => void): unknown[];
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
  /** ui.Menuable || 设置右键菜单（接受 Menu 实例或原始 options） */
  setMenu(options: MaptalksMenu | MaptalksMenuOptions): this;
  /** ui.Menuable || 打开右键菜单 */
  openMenu(coordinate?: { x: number; y: number }): this;
  /** ui.Menuable || 关闭右键菜单 */
  closeMenu(): this;
  /** ui.Menuable || 更新菜单项（保持宽度 / 自定义容器配置不变） */
  setMenuItems(items: (MaptalksMenuItem | '-')[]): this;
  /** ui.Menuable || 获取当前菜单项 */
  getMenuItems(): (MaptalksMenuItem | '-')[];
  /** ui.Menuable || 移除右键菜单 */
  removeMenu(): this;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

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
export interface MaptalksLayer extends MaptalksClass {
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

// ───────────────────────────────── Class 基类 Struct ─────────────────────────────────

/**
 * maptalks 根类 Class 的结构化建模（所有类公有的方法）。
 *
 * @description 基于 maptalks.js 1.x API，声明 Class 基类的完整公共实例方法。
 * Geometry / Layer / Map / Control / InfoWindow / UIMarker 均继承此接口。
 *
 * @example
 * const geo: MaptalksGeometry = marker.geometry.value!;
 * geo.config('draggable', true);
 */
export interface MaptalksClass {
  /** Proxy 包装的选项对象——直接赋值 xxx.options.yyy = value 等效 xxx.config('yyy', value) */
  options: Record<string, unknown>;
  /** 合并选项到默认值 */
  setOptions(options: Record<string, unknown>): this;
  /** 读取全部选项（无参）/ 设置单项conf(param,value) / 批量设置conf(obj) */
  config(conf?: Record<string, unknown> | string, value?: unknown): this | unknown;
  /** config 变更时的默认回调（子类重写） */
  onConfig(): void;
  /** 遍历并执行所有 init hooks */
  callInitHooks(): this;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 几何图形实例的结构化建模（覆盖 Geometry 基类全部方法）。
 *
 * @description 基于 maptalks.js 1.x API，声明 Geometry 基类的完整公共方法签名（含继承链）。
 * 索引签名提供逃生舱口，可调用任意原生方法。
 *
 * @example
 * const geo: MaptalksGeometry | null = useMaptalksMarker(layer, { coordinates: [0, 0] }).geometry.value;
 * geo?.setSymbol({ markerType: 'ellipse' });
 * geo?.updateSymbol({ markerWidth: 40 });
 */
export interface MaptalksGeometry extends MaptalksClass {
  /** 加入矢量图层 */
  addTo(layer: MaptalksVectorLayer): MaptalksGeometry;
  /** 从图层移除并销毁 */
  remove(): void;
  /** 设置坐标 */
  setCoordinates(coords: unknown): MaptalksGeometry;
  /** 读取坐标 */
  getCoordinates(): unknown;
  /** 设置样式 symbol */
  setSymbol(symbol: unknown): MaptalksGeometry;
  /** 读取样式 symbol */
  getSymbol(): unknown;
  /** 读取 symbol 哈希码 */
  getSymbolHash(): string;
  /** 部分更新 symbol */
  updateSymbol(props: Record<string, unknown> | Array<unknown>): MaptalksGeometry;
  /** 设置业务属性 */
  setProperties(props: Record<string, unknown>): MaptalksGeometry;
  /** 读取业务属性 */
  getProperties(): Record<string, unknown>;
  /** 读取几何 ID */
  getId(): string | number;
  /** 设置几何 ID */
  setId(id: string | number): MaptalksGeometry;
  /** 读取几何类型字符串 */
  getType(): string;
  /** 读取关联图层 */
  getLayer(): MaptalksLayer | null;
  /** 读取关联地图 */
  getMap(): MaptalksMap | null;
  /** 读取第一个坐标 */
  getFirstCoordinate(): Record<string, number>;
  /** 读取最后一个坐标 */
  getLastCoordinate(): Record<string, number>;
  /** 读取地理中心 */
  getCenter(): Record<string, number>;
  /** 读取地理范围 */
  getExtent(): Record<string, unknown>;
  /** 读取屏幕像素范围 */
  getContainerExtent(): Record<string, unknown>;
  /** 读取屏幕像素尺寸 */
  getSize(): { width: number; height: number };
  /** 判断是否包含指定点 */
  containsPoint(point: unknown, tolerance?: number): boolean;
  /** 读取文本内容 */
  getTextContent(): string;
  /** 显示几何图形 */
  show(): MaptalksGeometry;
  /** 隐藏几何图形 */
  hide(): MaptalksGeometry;
  /** 是否可见 */
  isVisible(): boolean;
  /** 读取 zIndex */
  getZIndex(): number;
  /** 设置 zIndex（触发重排） */
  setZIndex(zIndex: number): MaptalksGeometry;
  /** 静默设置 zIndex（不触发事件） */
  setZIndexSilently(zIndex: number): MaptalksGeometry;
  /** 置顶 */
  bringToFront(): MaptalksGeometry;
  /** 置底 */
  bringToBack(): MaptalksGeometry;
  /** 平移 */
  translate(x: number, y: number): MaptalksGeometry;
  /** 旋转 */
  rotate(angle: number, pivot?: unknown): MaptalksGeometry;
  /** 闪烁 */
  flash(interval?: number, count?: number, cb?: () => void, context?: unknown): MaptalksGeometry;
  /** 克隆（不含事件） */
  copy(): MaptalksGeometry;
  /** 序列化为 GeoJSON */
  toGeoJSON(): unknown;
  /** 序列化为 GeoJSON Geometry（不含 feature 包装） */
  toGeoJSONGeometry(): unknown;
  /** 序列化为 Profile JSON */
  toJSON(options?: Record<string, unknown>): Record<string, unknown>;
  /** 读取地理长度（米） */
  getLength(): number;
  /** 读取地理面积（㎡） */
  getArea(): number;
  /** 绑定事件 */
  on(events: string, handler: MaptalksEventHandler): MaptalksGeometry;
  /** 解绑事件 */
  off(events: string, handler: MaptalksEventHandler): MaptalksGeometry;
  /** 样式动画过渡 */
  animate?(styles: Record<string, unknown>, opts?: Record<string, unknown>): Record<string, unknown>;
  /** 带动画 show（Line / Polygon） */
  animateShow?(opts?: Record<string, unknown>, cb?: (...args: unknown[]) => void): MaptalksGeometry;
  /** 开始编辑 */
  startEdit?(options?: Record<string, unknown>): MaptalksGeometry;
  /** 结束编辑 */
  endEdit?(): MaptalksGeometry;
  /** 重做编辑 */
  redoEdit?(): MaptalksGeometry;
  /** 撤销编辑 */
  undoEdit?(): MaptalksGeometry;
  /** 取消编辑 */
  cancelEdit?(): MaptalksGeometry;
  /** 是否正在编辑 */
  isEditing?(): boolean;
  /** 是否正在拖拽 */
  isDragging?(): boolean;
  /** 设置 InfoWindow */
  setInfoWindow?(options: Record<string, unknown>): MaptalksGeometry;
  /** 获取 InfoWindow */
  getInfoWindow?(): unknown;
  /** 打开 InfoWindow */
  openInfoWindow?(coordinate?: unknown): MaptalksGeometry;
  /** 关闭 InfoWindow */
  closeInfoWindow?(): MaptalksGeometry;
  /** 移除 InfoWindow */
  removeInfoWindow?(): MaptalksGeometry;
  /** ui.Menuable || 设置右键菜单 */
  setMenu?(options: MaptalksMenuOptions): MaptalksGeometry;
  /** ui.Menuable || 打开右键菜单 */
  openMenu?(coordinate?: { x: number; y: number }): MaptalksGeometry;
  /** ui.Menuable || 关闭右键菜单 */
  closeMenu?(): MaptalksGeometry;
  /** ui.Menuable || 更新菜单项 */
  setMenuItems?(items: (MaptalksMenuItem | '-')[]): MaptalksGeometry;
  /** ui.Menuable || 获取当前菜单项 */
  getMenuItems?(): (MaptalksMenuItem | '-')[];
  /** ui.Menuable || 移除右键菜单 */
  removeMenu?(): MaptalksGeometry;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

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
  /** 设置图片数组并重绘 */
  setImages(images: Array<{ url: string; extent: unknown; opacity?: number }>): this;
  /** 获取图片数组 */
  getImages(): Array<{ url: string; extent: unknown; opacity?: number }>;
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

/**
 * maptalks DrawTool 实例的结构化建模。
 */
export interface MaptalksDrawTool extends MaptalksClass {
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
  /** ui.Menuable || 设置右键菜单 */
  setMenu(options: MaptalksMenuOptions): this;
  /** ui.Menuable || 打开右键菜单 */
  openMenu(coordinate?: { x: number; y: number }): this;
  /** ui.Menuable || 关闭右键菜单 */
  closeMenu(): this;
  /** ui.Menuable || 更新菜单项（保持宽度 / 自定义容器配置不变） */
  setMenuItems(items: (MaptalksMenuItem | '-')[]): this;
  /** ui.Menuable || 获取当前菜单项 */
  getMenuItems(): (MaptalksMenuItem | '-')[];
  /** ui.Menuable || 移除右键菜单 */
  removeMenu(): this;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 测量工具实例的结构化建模（DistanceTool / AreaTool 基类）。
 */
export interface MaptalksMapTool extends MaptalksClass {
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

/**
 * maptalks 控件实例的结构化建模。
 */
export interface MaptalksControl extends MaptalksClass {
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
  /** 绑定事件（add / remove / positionchange） */
  on?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * Zoom 控件实例窄类型（extends MaptalksControl）。
 *
 * @description 无特有公开方法（缩放按钮/滑块行为由控件内部处理），作为类型标签供
 * `UseMaptalksControlReturn<MaptalksZoomControl>` 显式泛型使用。
 *
 * @example
 * const { control } = useMaptalksZoom(map, { options: { position: 'top-left' } });
 * control.value?.isVisible();
 */
export interface MaptalksZoomControl extends MaptalksControl {}

/**
 * Compass 控件实例窄类型（extends MaptalksControl）。
 *
 * @description 无特有公开方法（点击复位朝向由控件内部处理），作为类型标签供
 * `UseMaptalksControlReturn<MaptalksCompassControl>` 显式泛型使用。
 *
 * @example
 * const { control } = useMaptalksCompass(map, { options: { position: 'top-right' } });
 * control.value?.show();
 */
export interface MaptalksCompassControl extends MaptalksControl {}

/**
 * Scale 控件实例窄类型（extends MaptalksControl）。
 *
 * @description 无特有公开方法，作为类型标签供 `UseMaptalksControlReturn<MaptalksScaleControl>` 显式泛型使用。
 *
 * @example
 * const { control } = useMaptalksScale(map, { options: { position: 'bottom-left' } });
 * control.value?.hide();
 */
export interface MaptalksScaleControl extends MaptalksControl {}

/**
 * Attribution 控件实例窄类型（extends MaptalksControl）。
 *
 * @description 特有方法 setContent/getContent（动态更新版权信息内容），
 * 供 `UseMaptalksControlReturn<MaptalksAttributionControl>` 显式泛型使用。
 *
 * @example
 * const { control } = useMaptalksAttribution(map, { options: { position: 'bottom-right' } });
 * control.value?.setContent('Powered by maptalks');
 */
export interface MaptalksAttributionControl extends MaptalksControl {
  /** 替换版权信息内容（字符串或 DOM） */
  setContent(content: string | HTMLElement): this;
  /** 读取版权信息内容 */
  getContent(): string | HTMLElement;
}

/**
 * Toolbar 控件实例窄类型（extends MaptalksControl）。
 *
 * @description 无特有公开方法（子菜单/点击由控件内部处理），作为类型标签供
 * `UseMaptalksControlReturn<MaptalksToolbarControl>` 显式泛型使用。
 *
 * @example
 * const { control } = useMaptalksToolbar(map, { options: { position: 'top-right', items } });
 * control.value?.isVisible();
 */
export interface MaptalksToolbarControl extends MaptalksControl {}

/**
 * 已加载的 maptalks-gl 命名空间（动态 import 的结果）。
 *
 * @description `factory` 与各预设接收此命名空间以构造图层/工具。已知构造器标为可选
 * （不同版本/打包可能缺失），并提供索引签名以访问任意导出。
 *
 * @example
 * useMaptalksLayer(map, (mt) => new mt.TileLayer('base', { urlTemplate }));
 */
export interface MaptalksGLNamespace {
  /** 地图构造器 */
  Map: new (container: string | HTMLElement, options: Record<string, unknown>) => MaptalksMap;
  /** 瓦片图层构造器（maptalks-gl 核心，始终存在） */
  TileLayer: new (id: string | number, options: Record<string, unknown>) => MaptalksTileLayer;
  /** 矢量瓦片图层构造器 */
  VectorTileLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksVectorTileLayer;
  /** WMS 图层构造器（OGC WMS 服务，与 TileLayer 同构：id + options） */
  WMSLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksWMSLayer;
  /** WMS 图层构造器的 maptalks-gl 实际导出名（maptalks 核心导出为 WMSTileLayer） */
  WMSTileLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksLayer;
  /** GroupGLLayer 构造器（承载 GL 图层与光照/后处理） */
  GroupGLLayer?: new (
    id: string | number,
    layers: MaptalksLayer[],
    options?: Record<string, unknown>,
  ) => MaptalksGroupGLLayer;
  /** GLTFLayer 构造器 */
  GLTFLayer?: new (id: string | number, options?: Record<string, unknown>) => MaptalksGLTFLayer;
  /** VectorLayer 构造器（承载几何） */
  VectorLayer?: new (id: string | number, options?: Record<string, unknown>) => MaptalksVectorLayer;
  /** ImageLayer 构造器 */
  ImageLayer?: new (id: string | number, images?: Array<{ url: string; extent: unknown; opacity?: number }>, options?: Record<string, unknown>) => MaptalksImageLayer;
  /** Marker 构造器 */
  Marker?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksMarkerGeometry;
  /** LineString 构造器 */
  LineString?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksLineStringGeometry;
  /** Polygon 构造器 */
  Polygon?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksPolygonGeometry;
  /** MultiPoint 构造器 */
  MultiPoint?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksMultiPointGeometry;
  /** MultiLineString 构造器 */
  MultiLineString?: new (
    coordinates: unknown,
    options?: Record<string, unknown>,
  ) => MaptalksMultiLineStringGeometry;
  /** MultiPolygon 构造器 */
  MultiPolygon?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksMultiPolygonGeometry;
  /** GeoJSON 工具命名空间 */
  GeoJSON?: {
    toGeometry(geojson: unknown, ...args: unknown[]): MaptalksGeometry | MaptalksGeometry[];
  };
  /** DrawTool 构造器 */
  DrawTool?: new (options: Record<string, unknown>) => MaptalksDrawTool;
  /** Circle 构造器 */
  Circle?: new (
    center: unknown,
    radius: number,
    options?: Record<string, unknown>,
  ) => MaptalksCircleGeometry;
  /** Rectangle 构造器 */
  Rectangle?: new (
    coord: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksRectangleGeometry;
  /** Ellipse 构造器 */
  Ellipse?: new (
    center: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksEllipseGeometry;
  /** Sector 构造器 */
  Sector?: new (
    center: unknown,
    radius: number,
    startAngle: number,
    endAngle: number,
    options?: Record<string, unknown>,
  ) => MaptalksSectorGeometry;
  /** Label 构造器 */
  Label?: new (
    content: string,
    coord: unknown,
    options?: Record<string, unknown>,
  ) => MaptalksLabelGeometry;
  /** TextBox 构造器 */
  TextBox?: new (
    content: string,
    coord: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksTextBoxGeometry;
  /** 控件命名空间 */
  control?: {
    /** 缩放控件构造器 */
    Zoom?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 比例尺控件构造器 */
    Scale?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 归属控件构造器 */
    Attribution?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** Toolbar 工具条控件构造器（items 按钮列表 + children 子菜单） */
    Toolbar?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 罗盘控件构造器 */
    Compass?: new (options?: Record<string, unknown>) => MaptalksControl;
  };
  /** DistanceTool 测量工具构造器 */
  DistanceTool?: new (options?: Record<string, unknown>) => MaptalksMapTool;
  /** AreaTool 测量工具构造器 */
  AreaTool?: new (options?: Record<string, unknown>) => MaptalksMapTool;
  /** InfoWindow 弹出框构造器 */
  ui?: { InfoWindow?: new (options?: Record<string, unknown>) => MaptalksInfoWindow; UIMarker?: new (coord: unknown, options?: Record<string, unknown>) => MaptalksUIMarker; Menu?: new (options?: Record<string, unknown>) => MaptalksMenu; };
  /** 逃生舱口：访问任意未建模的导出 */
  [key: string]: unknown;
}

/**
 * maptalks InfoWindow 弹出框实例的结构化建模。
 */
export interface MaptalksInfoWindow extends MaptalksClass {
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

/**
 * maptalks ui.Menu 实例的结构化建模。
 *
 * @description `ui.Menu` 创建右键菜单实例，需通过 `addTo(map)` 绑定到地图，
 * `show(coord)` 在指定坐标弹出。支持标准模式（items 数组）与自定义模式（HTML 字符串/元素）。
 * 继承 `ui.UIComponent`。
 *
 * @example
 * const menu = new mt.ui.Menu({ width: 160, items: [{ item: '放大', click: () => map.zoomIn() }] })
 * menu.addTo(map)
 */
export interface MaptalksMenu extends MaptalksClass {
  /** 挂载到地图或几何体 */
  addTo(target: MaptalksMap | unknown): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 在指定坐标显示菜单 */
  show(coordinate?: { x: number; y: number }): this;
  /** 隐藏菜单 */
  hide(): this;
  /** 是否可见 */
  isVisible(): boolean;
  /** 设置菜单项（标准模式：items 数组；自定义模式：HTML 字符串或元素） */
  setItems(items: (MaptalksMenuItem | '-')[] | string | HTMLElement): this;
  /** 获取菜单项 */
  getItems(): (MaptalksMenuItem | '-')[] | string | HTMLElement;
  /** 获取菜单 DOM 元素 */
  getDOM(): HTMLElement;
  /** 绑定事件 */
  on?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): this;
  /** 逃生舱口 */
  [key: string]: unknown;
}

/**
 * maptalks ui.UIMarker 实例的结构化建模。
 */
export interface MaptalksUIMarker extends MaptalksClass {
  /** 挂载到地图 */
  addTo(target: MaptalksMap | unknown): this;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 显示标注 */
  show(): this;
  /** 隐藏标注 */
  hide(): this;
  /** 是否可见 */
  isVisible(): boolean;
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

/**
 * 所有几何 symbol 的公共基类（原生 SymbolCommon 等价）。
 *
 * @description 可见性 / 透明度 / 阴影，所有 Marker / Line / Polygon / Text 均可使用。
 * 所有字段均可选；不传时 maptalks 使用内部默认值。
 *
 * @example
 * const sym = { opacity: 0.7, shadowBlur: 4, shadowColor: '#000' };
 */
export interface SymbolBase {
  /** 是否可见，false 隐藏几何但不销毁 */
  visible?: boolean | Stops<boolean>;
  /** 整体透明度（0–1） */
  opacity?: number | Stops<number>;
  /** 阴影模糊半径（像素） */
  shadowBlur?: number | Stops<number>;
  /** 阴影颜色（CSS 颜色字符串） */
  shadowColor?: string | Stops<string>;
  /** 阴影水平偏移（像素） */
  shadowOffsetX?: number | Stops<number>;
  /** 阴影垂直偏移（像素） */
  shadowOffsetY?: number | Stops<number>;
}

/**
 * 线几何 symbol 强类型建模（高频线样式字段）。
 *
 * @description 为 LineString / MultiLineString 等线几何的 symbol 提供精确字段提示。
 * 所有字段均可选；索引签名 `[key: string]: any` 作为兜底，透传任意未建模的 maptalks 线样式键，
 * 从而保持与旧版 `Record<string, unknown>` symbol 的向后兼容（任意自定义键可读可写）。
 *
 * @example
 * const sym: LineSymbol = { lineColor: '#1bbc9b', lineWidth: 3, lineDasharray: [10, 5] };
 */
export interface LineSymbol extends SymbolBase {
  /** 线颜色（CSS 颜色字符串） */
  lineColor?: string;
  /** 线宽（像素） */
  lineWidth?: number;
  /** 线透明度（0–1） */
  lineOpacity?: number;
  /** 虚线模式：实线/空白交替的像素长度数组 */
  lineDasharray?: number[];
  /** 线端样式，如 'butt' / 'round' / 'square' */
  lineCap?: string;
  /** 线接合样式，如 'miter' / 'round' / 'bevel' */
  lineJoin?: string;
  /** 线整体水平偏移（像素） */
  lineDx?: number;
  /** 线整体垂直偏移（像素） */
  lineDy?: number;
  /** 线纹理文件 URL */
  linePatternFile?: string;
  /** 线渐变色属性名（配合 properties 使用） */
  lineGradientProperty?: string;
  /** 线外边颜色 */
  lineStrokeColor?: string | Stops<string>;
  /** 线外边宽度（像素） */
  lineStrokeWidth?: number | Stops<number>;
  /** 兜底：透传任意未建模的线样式键（向后兼容，故为 any） */
  [key: string]: any;
}

/**
 * 面几何 symbol 强类型建模（高频面填充字段）。
 *
 * @description 为 Polygon / MultiPolygon / Circle 等面几何的 symbol 提供精确填充字段提示。
 * 描边线样式由 `LineSymbol` 经交叉类型 `PolygonSymbol & LineSymbol` 补全。
 * 索引签名 `[key: string]: any` 兜底透传任意未建模键，保持向后兼容。
 *
 * @example
 * const sym: PolygonSymbol = { polygonFill: '#3498db', polygonFillOpacity: 0.6 };
 */
export interface PolygonSymbol extends SymbolBase {
  /** 面填充颜色（CSS 颜色字符串） */
  polygonFill?: string;
  /** 面填充透明度（0–1） */
  polygonFillOpacity?: number;
  /** 面整体透明度（0–1） */
  polygonOpacity?: number;
  /** 面纹理文件 URL */
  polygonPatternFile?: string;
  /** 兜底：透传任意未建模的面样式键（向后兼容，故为 any） */
  [key: string]: any;
}

/**
 * 点几何 symbol 强类型建模（高频点标注字段）。
 *
 * @description 为 Marker / MultiPoint 等点几何的 symbol 提供精确字段提示。
 * 所有字段均可选；索引签名 `[key: string]: any` 兜底透传任意未建模的 maptalks 点样式键，
 * 保持与旧版 `Record<string, unknown>` symbol 的向后兼容。
 *
 * @example
 * const sym: MarkerSymbol = { markerType: 'ellipse', markerWidth: 20, markerFill: '#e74c3c' };
 */
export interface MarkerSymbol extends SymbolBase {
  /** 点标注类型，如 'ellipse' / 'square' / 'pin' / 'path' */
  markerType?: string;
  /** 点标注宽度（像素） */
  markerWidth?: number;
  /** 点标注高度（像素） */
  markerHeight?: number;
  /** 点标注填充颜色 */
  markerFill?: string;
  /** 点标注填充透明度（0–1） */
  markerFillOpacity?: number;
  /** 点标注描边颜色 */
  markerLineColor?: string;
  /** 点标注描边宽度（像素） */
  markerLineWidth?: number;
  /** 点标注整体透明度（0–1） */
  markerOpacity?: number;
  /** 点标注水平偏移（像素） */
  markerDx?: number;
  /** 点标注垂直偏移（像素） */
  markerDy?: number;
  /** Marker 水平对齐方式 */
  markerHorizontalAlignment?: 'left' | 'middle' | 'right';
  /** Marker 垂直对齐方式 */
  markerVerticalAlignment?: 'top' | 'middle' | 'bottom';
  /** Marker 摆放模式 */
  markerPlacement?: 'center' | 'point' | 'vertex' | 'line' | 'vertex-first' | 'vertex-last' | 'vertex-firstlast';
  /** Marker 旋转角度（度） */
  markerRotation?: number;
  /** 标注填充纹理文件 URL */
  markerFillPatternFile?: string;
  /** 标注描边透明度（0–1） */
  markerLineOpacity?: number;
  /** 标注描边虚线模式 */
  markerLineDasharray?: number[];
  /** 标注描边纹理文件 URL */
  markerLinePatternFile?: string;
  /** 兜底：透传任意未建模的点样式键（向后兼容，故为 any） */
  [key: string]: any;
}

/**
 * 文字几何 symbol 强类型建模（高频文字样式字段）。
 *
 * @description 为 Label / TextBox 等文字几何的 symbol 提供精确字段提示。
 * 所有字段均可选；索引签名 `[key: string]: any` 兜底透传任意未建模的 maptalks 文字样式键，
 * 保持与旧版 `Record<string, unknown>` symbol 的向后兼容。
 *
 * @example
 * const sym: TextSymbol = { textName: 'Hello', textSize: 14, textFill: '#222222' };
 */
export interface TextSymbol extends SymbolBase {
  /** 文字内容（也可由几何 content 提供） */
  textName?: string;
  /** 文字字号（像素） */
  textSize?: number;
  /** 文字颜色 */
  textFill?: string;
  /** 文字透明度（0–1） */
  textOpacity?: number;
  /** 文字描边（halo）颜色 */
  textHaloFill?: string;
  /** 文字描边（halo）半径（像素） */
  textHaloRadius?: number;
  /** 文字相对于几何的摆放模式 */
  textPlacement?: 'point' | 'vertex' | 'line' | 'vertex-first' | 'vertex-last';
  /** 文字字间距（像素） */
  textSpacing?: number;
  /** 文字字体名称（兼容旧 API） */
  textFaceName?: string;
  /** 文字字体（CSS font-family） */
  textFont?: string;
  /** 文字粗细（CSS font-weight） */
  textWeight?: string;
  /** 文字样式（CSS font-style） */
  textStyle?: string;
  /** 文字描边透明度（0–1） */
  textHaloOpacity?: number;
  /** 文字自动换行宽度（像素） */
  textWrapWidth?: number;
  /** 文字换行分隔符 */
  textWrapCharacter?: string;
  /** 文字行间距（像素） */
  textLineSpacing?: number;
  /** 文字水平对齐 */
  textHorizontalAlignment?: 'left' | 'middle' | 'right';
  /** 文字垂直对齐 */
  textVerticalAlignment?: 'top' | 'middle' | 'bottom';
  /** 文字对齐（CSS text-align） */
  textAlign?: 'left' | 'right' | 'center';
  /** 文字旋转角度（度） */
  textRotation?: number;
  /** 兜底：透传任意未建模的文字样式键（向后兼容，故为 any） */
  [key: string]: any;
}

/**
 * Zoom-Level Stops 动态样式。
 *
 * @description `[[zoom, symbol], [zoom, symbol], ...]` 形式的动态样式声明；
 * maptalks 根据当前 zoom 自动选取对应区间的 symbol。泛型，接收任意 symbol 类型。
 *
 * @example
 * const stops: Stops<MarkerSymbol> = [[10, { markerType: 'pin' }], [14, { markerType: 'ellipse' }]];
 */
export type Stops<T> = Array<[number, T]>;

// ───────────────────────────────── Geometry Struct ─────────────────────────────────

/**
 * Marker 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Marker 独有方法 getOutline，坐标方法使用具体签名覆盖基类泛型。
 *
 * @example
 * const marker: MaptalksMarkerGeometry = geo as MaptalksMarkerGeometry;
 * const outline = marker.getOutline();
 */
export interface MaptalksMarkerGeometry extends MaptalksGeometry {
  /** 读取 Marker 外轮廓线性坐标 */
  getOutline(): unknown;
}

/**
 * Label 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Label 独有方法：框样式（getBoxStyle/setBoxStyle）与文字符号（getTextSymbol/setTextSymbol）。
 *
 * @example
 * const label: MaptalksLabelGeometry = geo as MaptalksLabelGeometry;
 * label.setBoxStyle({ padding: 8 });
 */
export interface MaptalksLabelGeometry extends MaptalksGeometry {
  /** 读取 Label 文字内容 */
  getContent(): string;
  /** 设置 Label 文字内容 */
  setContent(content: string): this;
  /** 读取 Label 框样式 */
  getBoxStyle(): Record<string, unknown>;
  /** 设置 Label 框样式 */
  setBoxStyle(style: Record<string, unknown>): this;
  /** 读取 Label 文字符号 */
  getTextSymbol(): Record<string, unknown>;
  /** 设置 Label 文字符号 */
  setTextSymbol(symbol: Record<string, unknown>): this;
}

/**
 * TextBox 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 TextBox 独有方法：宽高（getWidth/setWidth/getHeight/setHeight）、框符号（getBoxSymbol/setBoxSymbol）与文字样式（getTextStyle/setTextStyle）。
 *
 * @example
 * const box: MaptalksTextBoxGeometry = geo as MaptalksTextBoxGeometry;
 * box.setWidth(200);
 */
export interface MaptalksTextBoxGeometry extends MaptalksGeometry {
  /** 读取 TextBox 文字内容 */
  getContent(): string;
  /** 设置 TextBox 文字内容 */
  setContent(content: string): this;
  /** 读取 TextBox 宽度 */
  getWidth(): number;
  /** 设置 TextBox 宽度 */
  setWidth(width: number): this;
  /** 读取 TextBox 高度 */
  getHeight(): number;
  /** 设置 TextBox 高度 */
  setHeight(height: number): this;
  /** 读取 TextBox 文字符号 */
  getTextSymbol(): Record<string, unknown>;
  /** 设置 TextBox 文字符号 */
  setTextSymbol(symbol: Record<string, unknown>): this;
  /** 读取 TextBox 框符号 */
  getBoxSymbol(): Record<string, unknown>;
  /** 设置 TextBox 框符号 */
  setBoxSymbol(symbol: Record<string, unknown>): this;
  /** 读取 TextBox 文字样式 */
  getTextStyle(): Record<string, unknown>;
  /** 设置 TextBox 文字样式 */
  setTextStyle(style: Record<string, unknown>): this;
}

/**
 * LineString 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 覆盖基类的坐标读写方法为具体坐标类型（点序列）。
 *
 * @example
 * const line: MaptalksLineStringGeometry = geo as MaptalksLineStringGeometry;
 * const coords = line.getCoordinates();
 */
export interface MaptalksLineStringGeometry extends MaptalksGeometry {
  /** 读取与给定范围相交部分的中心 */
  getCenterInExtent(extent: Record<string, unknown>): Record<string, number> | null;
  /** 带动画 show（Path 继承） */
  animateShow(options?: Record<string, unknown>, cb?: (...args: unknown[]) => void): this;
  /** 读取 LineString 坐标（点序列） */
  getCoordinates(): unknown[];
  /** 设置 LineString 坐标 */
  setCoordinates(coordinates: number[][]): this;
}

/**
 * Polygon 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Polygon 独有方法：外壳（getShell）、孔洞（getHoles/hasHoles），坐标方法覆盖为环数组。
 *
 * @example
 * const poly: MaptalksPolygonGeometry = geo as MaptalksPolygonGeometry;
 * const shell = poly.getShell();
 */
export interface MaptalksPolygonGeometry extends MaptalksGeometry {
  /** 读取 Polygon 外壳坐标环 */
  getShell(): unknown[];
  /** 读取 Polygon 孔洞坐标环 */
  getHoles(): unknown[][];
  /** 判断是否有孔洞 */
  hasHoles(): boolean;
  /** 读取与给定范围相交部分的中心 */
  getCenterInExtent(extent: Record<string, unknown>): Record<string, number> | null;
  /** 带动画 show（Path 继承） */
  animateShow(options?: Record<string, unknown>, cb?: (...args: unknown[]) => void): this;
  /** 读取 Polygon 坐标（外环 + 内环） */
  getCoordinates(): unknown[][];
  /** 设置 Polygon 坐标 */
  setCoordinates(coordinates: number[][][]): this;
}

/**
 * Circle 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Circle 独有的半径读写方法（getRadius/setRadius），坐标方法使用具体签名。
 *
 * @example
 * const circle: MaptalksCircleGeometry = geo as MaptalksCircleGeometry;
 * circle.setRadius(500);
 */
export interface MaptalksCircleGeometry extends MaptalksGeometry {
  /** 读取 Circle 半径 */
  getRadius(): number;
  /** 设置 Circle 半径 */
  setRadius(radius: number): this;
  /** 读取 Circle 外壳坐标 */
  getShell(): unknown[];
  /** 读取与给定范围相交部分的中心 */
  getCenterInExtent(extent: Record<string, unknown>): Record<string, number> | null;
  /** 读取 Circle 中心坐标 */
  getCoordinates(): { x: number; y: number; [key: string]: unknown };
  /** 设置 Circle 中心坐标 */
  setCoordinates(coordinates: [number, number] | { x: number; y: number }): this;
}

/**
 * Sector 几何窄类型（extends MaptalksCircleGeometry）。
 *
 * @description 继承 CircleGeometry，追加起止角读写方法。
 *
 * @example
 * const sector: MaptalksSectorGeometry = geo as MaptalksSectorGeometry;
 * sector.setStartAngle(0);
 */
export interface MaptalksSectorGeometry extends MaptalksCircleGeometry {
  /** 读取扇形起始角（度） */
  getStartAngle(): number;
  /** 设置扇形起始角（度） */
  setStartAngle(angle: number): this;
  /** 读取扇形结束角（度） */
  getEndAngle(): number;
  /** 设置扇形结束角（度） */
  setEndAngle(angle: number): this;
  /** 读取扇形半径 */
  getRadius(): number;
  /** 设置扇形半径 */
  setRadius(radius: number): this;
  /** 读取扇形外壳坐标 */
  getShell(): unknown[];
}

/**
 * Rectangle 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Rectangle 独有的宽高方法，坐标使用具体签名。
 *
 * @example
 * const rect: MaptalksRectangleGeometry = geo as MaptalksRectangleGeometry;
 * rect.setWidth(1000);
 */
export interface MaptalksRectangleGeometry extends MaptalksGeometry {
  /** 读取 Rectangle 宽度 */
  getWidth(): number;
  /** 设置 Rectangle 宽度 */
  setWidth(width: number): this;
  /** 读取 Rectangle 高度 */
  getHeight(): number;
  /** 设置 Rectangle 高度 */
  setHeight(height: number): this;
  /** 读取 Rectangle 外壳坐标 */
  getShell(): unknown[];
  /** 读取与给定范围相交部分的中心 */
  getCenterInExtent(extent: Record<string, unknown>): Record<string, number> | null;
  /** 读取 Rectangle 坐标 */
  getCoordinates(): { x: number; y: number; [key: string]: unknown };
  /** 设置 Rectangle 坐标 */
  setCoordinates(coordinates: [number, number] | { x: number; y: number }): this;
}

/**
 * Ellipse 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 Ellipse 独有的宽高方法，坐标使用具体签名。
 *
 * @example
 * const ell: MaptalksEllipseGeometry = geo as MaptalksEllipseGeometry;
 * ell.setWidth(800);
 */
export interface MaptalksEllipseGeometry extends MaptalksGeometry {
  /** 读取 Ellipse 宽度 */
  getWidth(): number;
  /** 设置 Ellipse 宽度 */
  setWidth(width: number): this;
  /** 读取 Ellipse 高度 */
  getHeight(): number;
  /** 设置 Ellipse 高度 */
  setHeight(height: number): this;
  /** 读取 Ellipse 外壳坐标 */
  getShell(): unknown[];
  /** 读取与给定范围相交部分的中心 */
  getCenterInExtent(extent: Record<string, unknown>): Record<string, number> | null;
  /** 读取 Ellipse 中心坐标 */
  getCoordinates(): { x: number; y: number; [key: string]: unknown };
  /** 设置 Ellipse 中心坐标 */
  setCoordinates(coordinates: [number, number] | { x: number; y: number }): this;
}

/**
 * MultiPoint 几何窄类型（extends MaptalksGeometry）。
 *
 * @description 追加 MultiPoint 独有的最近点查找方法。
 *
 * @example
 * const mp: MaptalksMultiPointGeometry = geo as MaptalksMultiPointGeometry;
 * const closest = mp.findClosest({ x: 121, y: 31 });
 */
export interface MaptalksMultiPointGeometry extends MaptalksGeometry {
  /** 查找距指定坐标最近的点 */
  findClosest(coordinate: unknown): unknown;
}
