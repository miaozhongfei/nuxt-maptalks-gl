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
 * maptalks `Map` 实例的结构化建模（仅声明本模块使用到的成员）。
 *
 * @description 通过结构化类型描述地图实例，核心方法给出精确签名，索引签名提供逃生舱口，
 * 可调用任意原生方法（如 `map.getContainer()`）。
 *
 * @example
 * const map: MaptalksMap | null = useMaptalks(target).map.value;
 * map?.setZoom(12);
 */
export interface MaptalksMap {
  /** 销毁地图并释放 WebGL 上下文 */
  remove(): void;
  /** 添加图层 */
  addLayer(layer: MaptalksLayer): MaptalksMap;
  /** 移除图层（按实例或 id） */
  removeLayer(layer: MaptalksLayer | string): MaptalksMap;
  /** 按指定 ID 顺序重排图层（数组从左到右 = 从底到顶） */
  sortLayers(layerIds: string[]): MaptalksMap;
  /** 读取当前中心坐标 */
  getCenter(): MaptalksCoordinate;
  /** 设置中心坐标 */
  setCenter(center: [number, number]): MaptalksMap;
  /** 读取当前缩放级别 */
  getZoom(): number;
  /** 设置缩放级别 */
  setZoom(zoom: number): MaptalksMap;
  /** 读取当前俯仰角 */
  getPitch(): number;
  /** 设置俯仰角 */
  setPitch(pitch: number): MaptalksMap;
  /** 读取当前方位角 */
  getBearing(): number;
  /** 设置方位角 */
  setBearing(bearing: number): MaptalksMap;
  /** 带动画过渡到目标视图 */
  animateTo(view: MaptalksViewLike, options?: Record<string, unknown>): unknown;
  /** 飞行过渡到目标视图 */
  flyTo(view: MaptalksViewLike, options?: Record<string, unknown>): unknown;
  /** 适配范围 */
  fitExtent(extent: unknown, zoomOffset?: number, options?: Record<string, unknown>): unknown;
  /** 绑定事件 */
  on(eventTypes: string, handler: MaptalksEventHandler): MaptalksMap;
  /** 解绑事件 */
  off(eventTypes: string, handler: MaptalksEventHandler): MaptalksMap;
  /** 平移到目标坐标 */
  panTo(
    coord: [number, number],
    options?: Record<string, unknown>,
  ): MaptalksMap;
  /** 按像素偏移平移 */
  panBy(
    offset: [number, number] | Record<string, unknown>,
    options?: Record<string, unknown>,
  ): MaptalksMap;
  /** 读取当前可视范围 Extent */
  getExtent(): unknown;
  /** 读取分辨率，可指定 zoom */
  getResolution(zoom?: number): number;
  /** 读取比例尺，可指定 zoom */
  getScale(zoom?: number): number;
  /** 设置最大可视范围，传 null 解除限制 */
  setMaxExtent(extent: unknown | null): MaptalksMap;
  /** 设置最小缩放级别 */
  setMinZoom(zoom: number): MaptalksMap;
  /** 设置最大缩放级别 */
  setMaxZoom(zoom: number): MaptalksMap;
  /** 导出为 dataURL */
  toDataURL(options?: Record<string, unknown>): string;
  /** 配置地图运行时选项（draggable/zoomable/dragPitch/dragRotate 等） */
  config(conf: Record<string, unknown>): MaptalksMap;
  /** 导出地图为 JSON */
  toJSON(): unknown;
  /** 从 JSON 恢复地图 */
  fromJSON(json: unknown): MaptalksMap;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 图层实例的结构化建模（仅声明本模块使用到的成员）。
 *
 * @description 不同图层类型的可写方法不一致（setStyle/config/setOptions），这里都标为可选，
 * 由 `useMaptalksLayer` 在运行时按存在性择优调用。
 *
 * @example
 * const layer = useMaptalksLayer(map, (mt) => new mt.TileLayer('base', {})).layer.value;
 * layer?.setStyle?.({});
 */
export interface MaptalksLayer {
  /** 从地图移除并销毁图层 */
  remove(): void;
  /** 设置样式（矢量/矢量瓦片图层等） */
  setStyle?(style: unknown): unknown;
  /** 配置图层（部分图层支持） */
  config?(conf: unknown): unknown;
  /** 设置图层选项（部分图层支持） */
  setOptions?(options: unknown): unknown;
  /** 显示图层 */
  show?(): MaptalksLayer;
  /** 隐藏图层 */
  hide?(): MaptalksLayer;
  /** 设置图层不透明度（0–1，部分图层支持） */
  setOpacity?(opacity: number): MaptalksLayer;
  /** 将图层置于同级最上层 */
  bringToFront?(): MaptalksLayer;
  /** 将图层置于同级最下层 */
  bringToBack?(): MaptalksLayer;
  /** 读取图层 id */
  getId?(): string;
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
export interface MaptalksGeometry {
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
  getSize(): Record<string, number>;
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
  /** 沿路径移动动画 */
  moveAlong?(path: unknown, opts?: Record<string, unknown>): void;
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
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 矢量图层（承载几何）的结构化建模。
 *
 * @description 在通用图层之上补充几何增删/枚举/清空方法。
 *
 * @example
 * const layer = useMaptalksVectorLayer(map).layer.value as MaptalksVectorLayer | null;
 * layer?.clear();
 */
export interface MaptalksVectorLayer extends MaptalksLayer {
  /** 添加一个或多个几何 */
  addGeometry(geo: MaptalksGeometry | MaptalksGeometry[]): MaptalksVectorLayer;
  /** 移除一个几何 */
  removeGeometry(geo: MaptalksGeometry): MaptalksVectorLayer;
  /** 读取全部几何 */
  getGeometries(): MaptalksGeometry[];
  /** 清空全部几何 */
  clear(): MaptalksVectorLayer;
}

/**
 * maptalks `DrawTool` 实例的结构化建模。
 *
 * @description 仅声明 `useMaptalksDrawTool` 使用到的生命周期与事件方法。
 *
 * @example
 * tool.setMode('Polygon').enable();
 */
export interface MaptalksDrawTool {
  /** 绑定到地图 */
  addTo(map: MaptalksMap): MaptalksDrawTool;
  /** 启用绘制 */
  enable(): MaptalksDrawTool;
  /** 关闭绘制 */
  disable(): MaptalksDrawTool;
  /** 切换绘制模式 */
  setMode(mode: string): MaptalksDrawTool;
  /** 移除绘制工具 */
  remove(): void;
  /** 绑定事件 */
  on(eventTypes: string, handler: MaptalksEventHandler): MaptalksDrawTool;
  /** 解绑事件 */
  off(eventTypes: string, handler: MaptalksEventHandler): MaptalksDrawTool;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 地图测量工具实例的结构化建模（仅声明本模块使用到的成员）。
 *
 * @description 通过结构化类型描述测量工具（DistanceTool / AreaTool 等），
 * 核心生命周期与事件方法给出精确签名，索引签名提供逃生舱口。
 *
 * @example
 * const tool: MaptalksMapTool | null = useMaptalksDistanceTool(map).tool.value;
 * tool?.enable();
 */
export interface MaptalksMapTool {
  /** 绑定到地图 */
  addTo(map: MaptalksMap): MaptalksMapTool;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 启用工具 */
  enable(): MaptalksMapTool;
  /** 关闭工具 */
  disable(): MaptalksMapTool;
  /** 绑定事件 */
  on(event: string, handler: MaptalksEventHandler): MaptalksMapTool;
  /** 解绑事件 */
  off(event: string, handler: MaptalksEventHandler): MaptalksMapTool;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks 控件实例的结构化建模（仅声明本模块使用到的成员）。
 *
 * @description 通过结构化类型描述控件，核心生命周期方法给出精确签名，索引签名提供逃生舱口。
 *
 * @example
 * const zoom = new mt.control.Zoom();
 * zoom.addTo(map);
 */
export interface MaptalksControl {
  /** 挂载到地图 */
  addTo(map: MaptalksMap): MaptalksControl;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

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
  TileLayer: new (id: string | number, options: Record<string, unknown>) => MaptalksLayer;
  /** 矢量瓦片图层构造器 */
  VectorTileLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksLayer;
  /** WMS 图层构造器（OGC WMS 服务，与 TileLayer 同构：id + options） */
  WMSLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksLayer;
  /** WMS 图层构造器的 maptalks-gl 实际导出名（maptalks 核心导出为 WMSTileLayer） */
  WMSTileLayer?: new (id: string | number, options: Record<string, unknown>) => MaptalksLayer;
  /** GroupGLLayer 构造器（承载 GL 图层与光照/后处理） */
  GroupGLLayer?: new (
    id: string | number,
    layers: MaptalksLayer[],
    options?: Record<string, unknown>,
  ) => MaptalksLayer;
  /** GLTFLayer 构造器 */
  GLTFLayer?: new (id: string | number, options?: Record<string, unknown>) => MaptalksLayer;
  /** VectorLayer 构造器（承载几何） */
  VectorLayer?: new (id: string | number, options?: Record<string, unknown>) => MaptalksVectorLayer;
  /** Marker 构造器 */
  Marker?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksGeometry;
  /** LineString 构造器 */
  LineString?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksGeometry;
  /** Polygon 构造器 */
  Polygon?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksGeometry;
  /** MultiPoint 构造器 */
  MultiPoint?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksGeometry;
  /** MultiLineString 构造器 */
  MultiLineString?: new (
    coordinates: unknown,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** MultiPolygon 构造器 */
  MultiPolygon?: new (coordinates: unknown, options?: Record<string, unknown>) => MaptalksGeometry;
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
  ) => MaptalksGeometry;
  /** Rectangle 构造器 */
  Rectangle?: new (
    coord: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** Ellipse 构造器 */
  Ellipse?: new (
    center: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** Sector 构造器 */
  Sector?: new (
    center: unknown,
    radius: number,
    startAngle: number,
    endAngle: number,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** Label 构造器 */
  Label?: new (
    content: string,
    coord: unknown,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** TextBox 构造器 */
  TextBox?: new (
    content: string,
    coord: unknown,
    width: number,
    height: number,
    options?: Record<string, unknown>,
  ) => MaptalksGeometry;
  /** 控件命名空间 */
  control?: {
    /** 缩放控件构造器 */
    Zoom?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 比例尺控件构造器 */
    Scale?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 归属控件构造器 */
    Attribution?: new (options?: Record<string, unknown>) => MaptalksControl;
    /** 罗盘控件构造器 */
    Compass?: new (options?: Record<string, unknown>) => MaptalksControl;
  };
  /** DistanceTool 测量工具构造器 */
  DistanceTool?: new (options?: Record<string, unknown>) => MaptalksMapTool;
  /** AreaTool 测量工具构造器 */
  AreaTool?: new (options?: Record<string, unknown>) => MaptalksMapTool;
  /** InfoWindow 弹出框构造器 */
  ui?: { InfoWindow?: new (options?: Record<string, unknown>) => MaptalksInfoWindow; UIMarker?: new (coord: unknown, options?: Record<string, unknown>) => MaptalksUIMarker; };
  /** 逃生舱口：访问任意未建模的导出 */
  [key: string]: unknown;
}

/**
 * maptalks InfoWindow 弹出框实例的结构化建模。
 *
 * @description 通过结构化类型描述 InfoWindow，核心内容/坐标/显隐方法给出精确签名，
 * 索引签名提供逃生舱口，可调用任意原生方法。
 *
 * @example
 * const iw: MaptalksInfoWindow | null = useMaptalksInfoWindow(map).infoWindow.value;
 * iw?.setContent('<div>Hello</div>');
 * iw?.show([113.27, 23.13]);
 */
export interface MaptalksInfoWindow {
  /** 挂载到地图或其它对象 */
  addTo(target: MaptalksMap | unknown): MaptalksInfoWindow;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 显示弹出框，可传入坐标 */
  show(coord?: unknown): MaptalksInfoWindow;
  /** 隐藏弹出框 */
  hide(): MaptalksInfoWindow;
  /** 是否可见 */
  isVisible(): boolean;
  /** 设置弹出框内容（HTML 字符串或 DOM 元素） */
  setContent(content: string | HTMLElement): MaptalksInfoWindow;
  /** 设置弹出框坐标 */
  setCoordinates(coord: unknown): MaptalksInfoWindow;
  /** 绑定事件 */
  on?(eventTypes: string, handler: MaptalksEventHandler): MaptalksInfoWindow;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): MaptalksInfoWindow;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
}

/**
 * maptalks `ui.UIMarker` 实例的结构化建模。
 *
 * @description HTML 自定义标注，叠加在地图上的 HTML DOM 元素，支持拖拽。
 *
 * @example
 * const uim: MaptalksUIMarker = useMaptalksUIMarker(map).uiMarker.value!;
 * uim.show();
 */
export interface MaptalksUIMarker {
  /** 挂载到地图 */
  addTo(target: MaptalksMap | unknown): MaptalksUIMarker;
  /** 从地图移除并销毁 */
  remove(): void;
  /** 显示标注 */
  show(): MaptalksUIMarker;
  /** 隐藏标注 */
  hide(): MaptalksUIMarker;
  /** 设置坐标 */
  setCoordinates(coord: unknown): MaptalksUIMarker;
  /** 设置内容（HTML 字符串或 DOM 元素） */
  setContent(content: string | HTMLElement): MaptalksUIMarker;
  /** 绑定事件 */
  on?(eventTypes: string, handler: MaptalksEventHandler): MaptalksUIMarker;
  /** 解绑事件 */
  off?(eventTypes: string, handler: MaptalksEventHandler): MaptalksUIMarker;
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
  setCoordinates(coordinates: Array<[number, number]>): this;
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
  setCoordinates(coordinates: Array<Array<[number, number]>>): this;
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
