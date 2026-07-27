/* oxlint-disable max-lines */

/**
 * 模块建模的 Spec + Combined Options 类型。
 *
 * @description 每个图层/几何类型有 Spec 接口（带中文注释的常用字段建模）和 Combined Options 类型
 * （Spec + Omit<Native, keyof Spec>），为用户提供完整 IDE 补全。
 */

import type { MaptalksLayer } from './structural';

import type {
  MaptalksNativeAreaToolOptions,
  MaptalksNativeDistanceToolOptions,
  MaptalksNativeGeometryOptions,
  MaptalksNativeGLTFLayerOptions,
  MaptalksNativeGroupGLLayerOptions,
  MaptalksNativeInfoWindowOptions,
  MaptalksNativeMapOptions,
  MaptalksNativeTileLayerOptions,
  MaptalksNativeUIMarkerOptions,
  MaptalksNativeVectorLayerOptions,
  MaptalksNativeVectorTileLayerOptions,
  MaptalksNativeWMSTileLayerOptions,
} from './native';

// ───────────────────────────────── Map ─────────────────────────────────

/**
 * maptalks `Map` 构造选项的手写强类型建模（高频字段）。
 *
 * @description 手写常用构造字段并保留索引签名兜底，不依赖 maptalks-gl 类型。
 * 每项均可选；未建模字段经 `[key: string]: unknown` 透传。
 *
 * @example
 * const opts: MaptalksMapSpecOptions = { center: [113.27, 23.13], zoom: 10, minZoom: 3, dragPitch: true };
 */
export interface MaptalksMapSpecOptions {
  /** 地图中心 */
  center?: [number, number];
  /** 缩放级别 */
  zoom?: number;
  /** 俯仰角（度），通常 0–80 */
  pitch?: number;
  /** 方位角（度） */
  bearing?: number;
  /** 最小缩放级别（限制缩放） */
  minZoom?: number;
  /** 最大缩放级别（限制缩放） */
  maxZoom?: number;
  /** 最大可视范围 Extent（限制范围），形状由 maptalks 决定，兜底建模 */
  maxExtent?: unknown;
  /** 是否允许拖拽平移，默认 true */
  draggable?: boolean;
  /** 是否允许拖拽平移（panning 维度） */
  dragPan?: boolean;
  /** 是否允许拖拽旋转方位 */
  dragRotate?: boolean;
  /** 是否允许拖拽改变俯仰 */
  dragPitch?: boolean;
  /** 是否允许缩放，默认 true */
  zoomable?: boolean;
  /** 细微缩放（Fractional Zoom） */
  seamlessZoom?: boolean;
  /** 缩放是否以容器中心为锚点 */
  zoomInCenter?: boolean;
  /** 空间参考系（含自定义 resolutions / LOD） */
  spatialReference?: Record<string, unknown>;
  /** 底图图层。MaptalksLayer 对象直传原生构造器；字符串/配置对象由模块自动 new TileLayer 到最底层 */
  baseLayer?: MaptalksLayer | string | {
    source?: string;
    urlTemplate?: string;
    subdomains?: string[];
    attribution?: string;
    options?: Record<string, unknown>;
  };
  /** 初始图层数组 */
  layers?: MaptalksLayer[];
  /** 逃生舱口：透传任意未建模的 maptalks Map 选项（保留） */
  [key: string]: unknown;
}

/**
 * Map 构造选项的组合类型：建模字段（MaptalksMapSpecOptions）+ 原生字段（MaptalksNativeMapOptions）。
 *
 * @description `Partial<MaptalksMapSpecOptions> & Partial<MaptalksNativeMapOptions>`，
 * 用户构建 `ref<MaptalksMapOptions>({})` 时获得完整 IDE 补全。
 *
 * @example
 * const opts: MaptalksMapOptions = { center: [113.27, 23.13], zoom: 10, minZoom: 3 };
 */
export type MaptalksMapOptions = Partial<MaptalksMapSpecOptions> & Partial<MaptalksNativeMapOptions>

// ───────────────────────────────── InfoWindow ─────────────────────────────────

/**
 * InfoWindow 常用选项（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 涵盖 maptalks InfoWindow 构造器 / marker.setInfoWindow() 的常用字段，
 * 并为每个字段提供中文说明。未列出的原生字段通过 `[key: string]: unknown` 透传。
 *
 * @example
 * const iwOpts: MaptalksInfoWindowSpecOptions = { title: '标题', content: '<div>内容</div>', animation: 'scale' };
 */
export interface MaptalksInfoWindowSpecOptions {
  /** 信息框标题，可用空字符串隐藏内置标题栏 */
  title?: string | HTMLElement;
  /** 弹出框内容（HTML 字符串或 DOM 元素），支持响应式 getter */
  content?: string | HTMLElement;
  /** 宽度（像素）。原生类型为 string，此处统一为 number */
  width?: number;
  /** 高度（像素） */
  height?: number;
  /** 自定义模板（禁用 maptalks 内置 chrome） */
  custom?: boolean;
  /** 自动移动地图使信息框可见 */
  autoPan?: boolean;
  /** 是否唯一（同时只显示一个） */
  single?: boolean;
  /** 动画类型（如 'scale'） */
  animation?: string;
  /** 水平偏移（像素） */
  dx?: number;
  /** 垂直偏移（像素） */
  dy?: number;
  /** 自动弹出事件（null 禁用弹出，默认 'click'） */
  autoOpenOn?: string | null;
  /** 逃生舱：透传给未建模的 maptalks 原始 InfoWindow 选项 */
  [key: string]: unknown;
}

/** marker.setInfoWindow() 的选项，与 InfoWindow 构造器选项完全一致 */
export type MaptalksMarkerInfoWindowOptions = MaptalksInfoWindowSpecOptions;

/**
 * InfoWindow 构造选项的组合类型：建模字段（中文注释）+ 原生字段（IDE 补全）。
 *
 * @description `Partial<MaptalksInfoWindowSpecOptions> & Omit<Partial<MaptalksNativeInfoWindowOptions>, keyof MaptalksInfoWindowSpecOptions>`，
 * 用户构建 `ref<MaptalksInfoWindowSpecOptions>({})` 时获得完整 IDE 补全。
 *
 * @example
 * const opts: MaptalksInfoWindowOptions = { title: '标题', content: '<div>内容</div>', animation: 'scale' };
 */
export type MaptalksInfoWindowOptions = Partial<MaptalksInfoWindowSpecOptions>
  & Omit<Partial<MaptalksNativeInfoWindowOptions>, keyof MaptalksInfoWindowSpecOptions>;

// ───────────────────────────────── TileLayer ─────────────────────────────────

/**
 * TileLayer 构造选项的建模接口（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 涵盖 TileLayer 最常用字段并提供中文说明。未列出的原生字段通过 `[key: string]: unknown` 透传。
 *
 * @example
 * const opts: MaptalksTileLayerSpecOptions = { urlTemplate: 'https://.../{z}/{x}/{y}.png', opacity: 0.8 };
 */
export interface MaptalksTileLayerSpecOptions {
  /** 瓦片 URL 模板（含 {x}/{y}/{z} 占位符） */
  urlTemplate?: string | ((...args: unknown[]) => string);
  /** 子域名数组（用于加速瓦片加载，如 ['a','b','c']） */
  subdomains?: string[] | number[];
  /** 图层不透明度（0=全透明，1=不透明） */
  opacity?: number;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 图层层级（数值越大越靠前） */
  zIndex?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 瓦片像素尺寸（默认 256，可传 [w,h]） */
  tileSize?: number | [number, number];
  /** 图层可用最大瓦片级别（超过后放大渲染已有瓦片） */
  maxAvailableZoom?: number;
  /** 瓦片加载的跨域属性（如 'anonymous'） */
  crossOrigin?: string;
  /** 瓦片加载出错时显示的替代图片 URL */
  errorUrl?: string;
  /** 认证 token（自动附加到瓦片请求） */
  token?: string;
  /** 自定义 fetch 选项（headers / credentials 等） */
  fetchOptions?: Record<string, unknown>;
  /** 瓦片淡入动画开关（默认 true） */
  fadeAnimation?: boolean;
  /** 自定义 URL 模板标签（如 {key: value} 替换 {key} 占位符） */
  customTags?: Record<string, unknown>;
  /** 平移出世界边界时是否重复渲染瓦片 */
  repeatWorld?: boolean;
  /** 缩放级别偏移，用于调整瓦片 URL 计算 */
  zoomOffset?: number;
  /** 底层版权信息文本 */
  attribution?: string;
  /** 是否启用几何事件 */
  geometryEvents?: boolean;
  /** 指定渲染器类型（'canvas'/'gl'/'dom'，null=自动） */
  renderer?: string | null;
  /** 逃生舱：透传给未建模的 maptalks 原始 TileLayer 选项 */
  [key: string]: unknown;
}

/**
 * TileLayer 构造选项的组合类型：建模字段（中文注释）+ 原生字段（IDE 补全）。
 *
 * @description `Partial<MaptalksTileLayerSpecOptions> & Omit<Partial<MaptalksNativeTileLayerOptions>, keyof MaptalksTileLayerSpecOptions>`。
 *
 * @example
 * const opts: MaptalksTileLayerOptions = { urlTemplate: 'https://.../{z}/{x}/{y}.png' };
 */
export type MaptalksTileLayerOptions = Partial<MaptalksTileLayerSpecOptions>
  & Omit<Partial<MaptalksNativeTileLayerOptions>, keyof MaptalksTileLayerSpecOptions>;

// ───────────────────────────────── VectorTileLayer ─────────────────────────────────

/**
 * VectorTileLayer 构造选项的建模接口（带中文注释）。
 *
 * @description 涵盖 VectorTileLayer 的常用字段。style 经 `options.style` 传入。
 *
 * @example
 * const opts: MaptalksVectorTileLayerSpecOptions = { urlTemplate: 'https://...', style: { background: { color: '#fff' } } };
 */
export interface MaptalksVectorTileLayerSpecOptions {
  /** 矢量瓦片 URL 模板 */
  urlTemplate?: string;
  /** MapLibre 风格规范对象（控制矢量切片的渲染方式） */
  style?: Record<string, unknown> | string;
  /** 图层不透明度 */
  opacity?: number;
  /** 图层层级 */
  zIndex?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 瓦片像素尺寸 */
  tileSize?: number | [number, number];
  /** 图层可用最大瓦片级别 */
  maxAvailableZoom?: number;
  /** 瓦片淡入动画开关 */
  fadeAnimation?: boolean;
  /** 文本标注碰撞检测开关 */
  collision?: boolean;
  /** 是否启用要素拾取（点选） */
  picking?: boolean;
  /** 是否启用抗锯齿 */
  antialias?: boolean;
  /** 样式缩放系数（如 2 用于高清屏） */
  styleScale?: number;
  /** 图标最大像素尺寸 */
  maxIconSize?: number;
  /** 要素 ID 对应的属性名 */
  featureIdProperty?: string;
  /** 海拔高度对应的属性名 */
  altitudeProperty?: string;
  /** 是否启用三维海拔渲染 */
  enableAltitude?: boolean;
  /** 图标加载失败时的替代 URL */
  iconErrorUrl?: string;
  /** 认证 token */
  token?: string;
  /** 自定义 fetch 选项 */
  fetchOptions?: Record<string, unknown>;
  /** 底层版权信息 */
  attribution?: string;
  /** 逃生舱 */
  [key: string]: unknown;
}

/**
 * VectorTileLayer 构造选项的组合类型。
 *
 * @description `Partial<MaptalksVectorTileLayerSpecOptions> & Omit<Partial<MaptalksNativeVectorTileLayerOptions>, keyof MaptalksVectorTileLayerSpecOptions>`。
 *
 * @example
 * const opts: MaptalksVectorTileLayerOptions = { style: 'https://.../style.json' };
 */
export type MaptalksVectorTileLayerOptions = Partial<MaptalksVectorTileLayerSpecOptions>
  & Omit<Partial<MaptalksNativeVectorTileLayerOptions>, keyof MaptalksVectorTileLayerSpecOptions>;

// ───────────────────────────────── GLTFLayer ─────────────────────────────────

/**
 * GLTFLayer 构造选项的建模接口（带中文注释）。
 *
 * @description GLTFLayer 是 GLTF 模型标记容器图层，实际模型经原生 API 添加。这里建模容器常用字段。
 *
 * @example
 * const opts: MaptalksGLTFLayerSpecOptions = { url: 'https://.../model.gltf', zIndex: 10 };
 */
export interface MaptalksGLTFLayerSpecOptions {
  /** GLTF 模型资源的 base URL */
  url?: string;
  /** 图层层级 */
  zIndex?: number;
  /** 图层不透明度 */
  opacity?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 图层级样式（应用于所有模型） */
  style?: Record<string, unknown>;
  /** 是否启用几何事件（click / hover 等） */
  geometryEvents?: boolean;
  /** 几何事件命中容差（像素） */
  geometryEventTolerance?: number;
  /** CSS 鼠标指针样式（如 'pointer'） */
  cursor?: string;
  /** 固定海拔高度（米） */
  altitude?: number;
  /** 是否启用三维海拔 */
  enableAltitude?: boolean;
  /** 指定渲染器类型 */
  renderer?: string | null;
  /** 底层版权信息 */
  attribution?: string;
  /** 逃生舱 */
  [key: string]: unknown;
}

/**
 * GLTFLayer 构造选项的组合类型。
 *
 * @description `Partial<MaptalksGLTFLayerSpecOptions> & Omit<Partial<MaptalksNativeGLTFLayerOptions>, keyof MaptalksGLTFLayerSpecOptions>`。
 */
export type MaptalksGLTFLayerOptions = Partial<MaptalksGLTFLayerSpecOptions>
  & Omit<Partial<MaptalksNativeGLTFLayerOptions>, keyof MaptalksGLTFLayerSpecOptions>;

// ───────────────────────────────── WMSLayer ─────────────────────────────────

/**
 * WMSLayer 构造选项的建模接口（带中文注释）。
 *
 * @description WMSTileLayer 继承 TileLayer，额外支持 WMS 业务参数。
 *
 * @example
 * const opts: MaptalksWMSLayerSpecOptions = { layers: 'topp:states', format: 'image/png', transparent: true };
 */
export interface MaptalksWMSLayerSpecOptions {
  /** WMS 图层名（逗号分隔多个图层） */
  layers?: string;
  /** WMS 图层样式名 */
  styles?: string;
  /** 图片格式（如 image/png、image/jpeg） */
  format?: string;
  /** 是否透明背景 */
  transparent?: boolean;
  /** WMS 版本（如 1.3.0） */
  version?: string;
  /** 坐标参考系（如 EPSG:3857） */
  crs?: string;
  /** 坐标参考系别名 */
  srs?: string;
  /** 请求范围（minx,miny,maxx,maxy） */
  bbox?: string | [number, number, number, number];
  /** 图片宽度（像素） */
  width?: number;
  /** 图片高度（像素） */
  height?: number;
  /** 逃生舱 */
  [key: string]: unknown;
}

/**
 * WMSLayer 构造选项的组合类型：建模字段（中文注释）+ 原生字段（IDE 补全）。
 *
 * @description `Partial<MaptalksWMSLayerSpecOptions> & Omit<Partial<MaptalksNativeWMSTileLayerOptions>, keyof MaptalksWMSLayerSpecOptions>`。
 */
export type MaptalksWMSLayerOptions = Partial<MaptalksWMSLayerSpecOptions>
  & Omit<Partial<MaptalksNativeWMSTileLayerOptions>, keyof MaptalksWMSLayerSpecOptions>;

// ───────────────────────────────── GroupGLLayer ─────────────────────────────────

/**
 * GroupGLLayer 构造选项的建模接口（带中文注释）。
 *
 * @description GroupGLLayer 承载子 GL 图层，sceneConfig 控制光照与后处理。
 *
 * @example
 * const opts: MaptalksGroupGLLayerSpecOptions = { sceneConfig: { light: { ambient: '#fff' } }, zIndex: 5 };
 */
export interface MaptalksGroupGLLayerSpecOptions {
  /** 场景配置（含 light 光照 / postProcess 后处理 / shadow 阴影 / weather 天气 / environment 环境光） */
  sceneConfig?: Record<string, unknown>;
  /** 图层层级 */
  zIndex?: number;
  /** 图层不透明度 */
  opacity?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 是否启用抗锯齿 */
  antialias?: boolean;
  /** MSAA 采样数（抗锯齿质量，如 4） */
  multiSamples?: number;
  /** 是否启用几何事件 */
  geometryEvents?: boolean;
  /** 地形配置（含 type / urlTemplate / tileSystem / shader 等） */
  terrain?: Record<string, unknown>;
  /** 底层版权信息 */
  attribution?: string;
  /** 逃生舱 */
  [key: string]: unknown;
}

/**
 * GroupGLLayer 构造选项的组合类型。
 *
 * @description `Partial<MaptalksGroupGLLayerSpecOptions> & Omit<Partial<MaptalksNativeGroupGLLayerOptions>, keyof MaptalksGroupGLLayerSpecOptions>`。
 */
export type MaptalksGroupGLLayerOptions = Partial<MaptalksGroupGLLayerSpecOptions>
  & Omit<Partial<MaptalksNativeGroupGLLayerOptions>, keyof MaptalksGroupGLLayerSpecOptions>;

// ───────────────────────────────── VectorLayer ─────────────────────────────────

/**
 * VectorLayer 构造选项的建模接口（带中文注释）。
 *
 * @description VectorLayer 是矢量图形容器图层，承载 Marker/LineString/Polygon 等几何图形。
 *
 * @example
 * const opts: MaptalksVectorLayerSpecOptions = { zIndex: 3, opacity: 0.9 };
 */
export interface MaptalksVectorLayerSpecOptions {
  /** 图层层级 */
  zIndex?: number;
  /** 图层不透明度 */
  opacity?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** CSS 鼠标指针样式（如 'pointer' / 'crosshair'） */
  cursor?: string;
  /** 默认图标尺寸 [width, height] */
  defaultIconSize?: [number, number];
  /** 是否启用几何简化（大数据量时提升性能） */
  enableSimplify?: boolean;
  /** 是否启用三维海拔 */
  enableAltitude?: boolean;
  /** 图层固定海拔高度（米） */
  altitude?: number;
  /** 海拔高度对应的属性名 */
  altitudeProperty?: string;
  /** 是否绘制连接线（地面到图形） */
  drawAltitude?: boolean;
  /** 是否启用几何事件（click / hover 等） */
  geometryEvents?: boolean;
  /** 几何事件命中容差（像素） */
  geometryEventTolerance?: number;
  /** 图层级样式（支持 filter 规则数组） */
  style?: Record<string, unknown> | Array<unknown>;
  /** 碰撞检测缓冲区大小（像素） */
  collisionBufferSize?: number;
  /** 是否启用渐进式渲染（分帧渲染大批量图形） */
  progressiveRender?: boolean;
  /** 每帧渐进渲染的图形数量 */
  progressiveRenderCount?: number;
  /** 底层版权信息 */
  attribution?: string;
  /** 指定渲染器类型 */
  renderer?: string | null;
  /** 逃生舱 */
  [key: string]: unknown;
}

/**
 * VectorLayer 构造选项的组合类型。
 *
 * @description `Partial<MaptalksVectorLayerSpecOptions> & Omit<Partial<MaptalksNativeVectorLayerOptions>, keyof MaptalksVectorLayerSpecOptions>`。
 */
export type MaptalksVectorLayerOptions = Partial<MaptalksVectorLayerSpecOptions>
  & Omit<Partial<MaptalksNativeVectorLayerOptions>, keyof MaptalksVectorLayerSpecOptions>;

// ───────────────────────────────── Tool Options ─────────────────────────────────

/**
 * DistanceTool 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeDistanceToolOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksDistanceToolOptions = { symbol: { lineColor: '#ff0000' } };
 */
export type MaptalksDistanceToolOptions = Partial<MaptalksNativeDistanceToolOptions> & Record<string, unknown>

/**
 * AreaTool 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeAreaToolOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksAreaToolOptions = { symbol: { polygonFill: '#00ff00' } };
 */
export type MaptalksAreaToolOptions = Partial<MaptalksNativeAreaToolOptions> & Record<string, unknown>

// ───────────────────────────────── Geometry ─────────────────────────────────

/**
 * 几何构造选项的公共高频字段（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 所有几何类型共享这些字段；各 preset 的建模 interface 继承此后可追加独有字段。
 * 未列出的原生字段经 `MaptalksNativeGeometryOptions` 补齐 IDE 自动补全。
 *
 * @example
 * const opts: MaptalksMarkerSpecOptions = { symbol: { markerType: 'ellipse' }, draggable: true };
 */
export interface MaptalksGeometryBaseSpecOptions {
  /** 渲染样式（支持普通对象、组合 symbol 数组、zoom-stops 数组） */
  symbol?: Record<string, unknown> | Array<Record<string, unknown>> | Array<[number, Record<string, unknown>]>;
  /** 自定义业务属性 */
  properties?: Record<string, unknown>;
  /** 是否可见 */
  visible?: boolean;
  /** 不透明度（0–1） */
  opacity?: number;
  /** 是否响应鼠标/触摸事件 */
  interactive?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 拖拽时是否显示影子 */
  dragShadow?: boolean;
  /** 几何在图层内的叠放顺序 */
  zIndex?: number;
  /** 鼠标悬停 CSS cursor */
  cursor?: string;
  /** 是否可编辑（出现编辑锚点） */
  editable?: boolean;
  /** 拖拽约束轴（true 或 'x' / 'y'） */
  dragOnAxis?: boolean | string;
  /** 是否仅在屏幕轴向拖拽 */
  dragOnScreenAxis?: boolean;
  /** 是否处理反子午线跨越 */
  antiMeridian?: boolean;
  /** 缺省投影（如 'EPSG:4326'） */
  defaultProjection?: string;
  /** 量测方式（如 'EPSG:4326'） */
  measure?: string;
  /** 逃生舱：透传给未建模的 maptalks 原始几何选项 */
  [key: string]: unknown;
}

/** Marker 常用选项（中文注释 + 原生字段补全，下同） */
export interface MaptalksMarkerSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** LineString 常用选项 */
export interface MaptalksLineStringSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Polygon 常用选项 */
export interface MaptalksPolygonSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** MultiPoint 常用选项 */
export interface MaptalksMultiPointSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** MultiLineString 常用选项 */
export interface MaptalksMultiLineStringSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** MultiPolygon 常用选项 */
export interface MaptalksMultiPolygonSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Circle 常用选项 */
export interface MaptalksCircleSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Rectangle 常用选项 */
export interface MaptalksRectangleSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Ellipse 常用选项 */
export interface MaptalksEllipseSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Sector 常用选项 */
export interface MaptalksSectorSpecOptions extends MaptalksGeometryBaseSpecOptions {}
/** Label 常用选项 */
export interface MaptalksLabelSpecOptions extends MaptalksGeometryBaseSpecOptions {
  /** 文字专属样式（textSize / textFill / textWeight / textHaloRadius 等） */
  textSymbol?: Record<string, unknown>;
  /** 文字背景框样式（boxFill / boxOpacity / boxLineColor / boxLineWidth 等） */
  boxStyle?: Record<string, unknown>;
}
/** TextBox 常用选项 */
export interface MaptalksTextBoxSpecOptions extends MaptalksGeometryBaseSpecOptions {
  /** 文字样式（wrap / padding / verticalAlignment / horizontalAlignment / symbol 等，TextBox 构造函数专属） */
  textStyle?: Record<string, unknown>;
  /** 文字背景框样式（markerType / markerFill / markerLineColor 等，TextBox 构造函数专属） */
  boxSymbol?: Record<string, unknown>;
}

// ── Geometry Combined Options ──

/** Marker 组件 options prop 类型——建模字段（中文注释）+ 原生字段（IDE 补全） */
export type MaptalksMarkerOptions = Partial<MaptalksMarkerSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMarkerSpecOptions>;
/** LineString 组件 options prop 类型 */
export type MaptalksLineStringOptions = Partial<MaptalksLineStringSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksLineStringSpecOptions>;
/** Polygon 组件 options prop 类型 */
export type MaptalksPolygonOptions = Partial<MaptalksPolygonSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksPolygonSpecOptions>;
/** MultiPoint 组件 options prop 类型 */
export type MaptalksMultiPointOptions = Partial<MaptalksMultiPointSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiPointSpecOptions>;
/** MultiLineString 组件 options prop 类型 */
export type MaptalksMultiLineStringOptions = Partial<MaptalksMultiLineStringSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiLineStringSpecOptions>;
/** MultiPolygon 组件 options prop 类型 */
export type MaptalksMultiPolygonOptions = Partial<MaptalksMultiPolygonSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiPolygonSpecOptions>;
/** Circle 组件 options prop 类型 */
export type MaptalksCircleOptions = Partial<MaptalksCircleSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksCircleSpecOptions>;
/** Rectangle 组件 options prop 类型 */
export type MaptalksRectangleOptions = Partial<MaptalksRectangleSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksRectangleSpecOptions>;
/** Ellipse 组件 options prop 类型 */
export type MaptalksEllipseOptions = Partial<MaptalksEllipseSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksEllipseSpecOptions>;
/** Sector 组件 options prop 类型 */
export type MaptalksSectorOptions = Partial<MaptalksSectorSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksSectorSpecOptions>;
/** Label 组件 options prop 类型 */
export type MaptalksLabelOptions = Partial<MaptalksLabelSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksLabelSpecOptions>;
/** TextBox 组件 options prop 类型 */
export type MaptalksTextBoxOptions = Partial<MaptalksTextBoxSpecOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksTextBoxSpecOptions>;

// ───────────────────────────────── UIMarker ─────────────────────────────────

/**
 * UIMarker 常用选项（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 涵盖 maptalks ui.UIMarker 构造器的常用字段，并为每个字段提供中文说明。
 * 未列出的原生字段通过 `MaptalksNativeUIMarkerOptions` 补齐 IDE 自动补全。
 *
 * @example
 * const opts: MaptalksUIMarkerSpecOptions = { content: '<div>HTML</div>', draggable: true };
 */
export interface MaptalksUIMarkerSpecOptions {
  /** HTML 内容字符串或 DOM 元素 */
  content?: string | HTMLElement;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否唯一（同时只显示一个） */
  single?: boolean;
  /** 海拔高度 */
  altitude?: number;
  /** 最小显示缩放级别 */
  minZoom?: number;
  /** 最大显示缩放级别 */
  maxZoom?: number;
  /** DOM 容器 CSS 类 */
  containerClass?: string;
  /** DOM 事件是否穿透到地图 */
  eventsPropagation?: boolean;
  /** 逃生舱：透传给未建模的 maptalks 原始 UIMarker 选项 */
  [key: string]: unknown;
}

/**
 * UIMarker 构造选项的组合类型：建模字段（中文注释）+ 原生字段（IDE 补全）。
 *
 * @description `Partial<MaptalksUIMarkerSpecOptions> & Omit<Partial<MaptalksNativeUIMarkerOptions>, keyof MaptalksUIMarkerSpecOptions>`，
 * 参照 `MaptalksInfoWindowOptions` 模式，用户构建 `ref<MaptalksUIMarkerOptions>({})` 时获得完整 IDE 补全。
 *
 * @example
 * const opts: MaptalksUIMarkerOptions = { content: '<div>HTML</div>', draggable: true, minZoom: 10 };
 */
export type MaptalksUIMarkerOptions = Partial<MaptalksUIMarkerSpecOptions>
  & Omit<Partial<MaptalksNativeUIMarkerOptions>, keyof MaptalksUIMarkerSpecOptions>;
