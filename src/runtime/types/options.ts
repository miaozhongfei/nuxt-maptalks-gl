/* oxlint-disable max-lines */

/**
 * 模块 Options 类型（全部手写展平 interface，IDE 可补全全部字段）。
 *
 * @description 每个图层/几何类型有手写展平的 Options 接口（含所有原生字段 + 中文注释）。
 */

import type { MaptalksLayer } from './structural';

// ───────────────────────────────── Map ─────────────────────────────────

/**
 * Map 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 * maptalks-gl 版本升级时需同步新增原生字段。
 *
 * @example
 * const opts: MaptalksMapOptions = { center: [113.27, 23.13], zoom: 10, minZoom: 3 };
 */
export interface MaptalksMapOptions {
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
  /** 最大可视范围 Extent（限制范围） */
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
  /** 底图图层 */
  baseLayer?: MaptalksLayer | string | {
    source?: string;
    urlTemplate?: string;
    subdomains?: string[];
    attribution?: string;
    options?: Record<string, unknown>;
  };
  /** 初始图层数组 */
  layers?: MaptalksLayer[];
  /** 渲染器类型 */
  renderer?: unknown;
  /** 地图控件开关，默认 true */
  control?: boolean;
  /** 版权信息（true/false 或配置对象） */
  attribution?: boolean | Record<string, unknown>;
  /** 是否显示缩放控件 */
  zoomControl?: boolean;
  /** 是否显示比例尺控件 */
  scaleControl?: boolean;
  /** 是否显示鹰眼控件 */
  overviewControl?: boolean;
  /** 是否启用几何事件 */
  geometryEvents?: boolean;
  /** 拖拽平移缓动函数 */
  dragPanEasing?: (...args: unknown[]) => unknown;
  /** 是否允许同时拖拽旋转和俯仰 */
  dragRotatePitch?: boolean;
  /** 是否启用手势操作 */
  touchGesture?: boolean;
  /** 手势缩放 */
  touchZoom?: boolean;
  /** 手势旋转 */
  touchRotate?: boolean;
  /** 手势俯仰 */
  touchPitch?: boolean;
  /** 手势缩放旋转组合 */
  touchZoomRotate?: boolean;
  /** 双击缩放 */
  doubleClickZoom?: boolean;
  /** 滚轮缩放 */
  scrollWheelZoom?: boolean;
  /** 雾效开关 */
  fog?: boolean;
  /** 雾颜色 */
  fogColor?: unknown;
  /** 设备像素比 */
  devicePixelRatio?: number;
  /** 高度因子（3D 场景） */
  heightFactor?: number;
  /** 海拔高度基准纬度 */
  originLatitudeForAltitude?: number;
  /** 是否记录视图历史 */
  viewHistory?: boolean;
  /** 视图历史记录数 */
  viewHistoryCount?: number;
  /** 最大视觉俯仰角 */
  maxVisualPitch?: number;
  /** 最大俯仰角 */
  maxPitch?: number;
  /** 显示中心十字标 */
  centerCross?: boolean;
  /** 缩放基准点 */
  zoomOrigin?: number[];
  /** 缩放动画开关 */
  zoomAnimation?: boolean;
  /** 缩放动画时长（毫秒） */
  zoomAnimationDuration?: number;
  /** 每帧瓦片背景限制数 */
  tileBackgroundLimitPerFrame?: number;
  /** 平移动画开关 */
  panAnimation?: boolean;
  /** 平移动画时长（毫秒） */
  panAnimationDuration?: number;
  /** 旋转动画开关 */
  rotateAnimation?: boolean;
  /** 旋转动画时长（毫秒） */
  rotateAnimationDuration?: number;
  /** 是否启用 InfoWindow */
  enableInfoWindow?: boolean;
  /** 启用命中检测 */
  hitDetect?: boolean;
  /** 命中检测限制数 */
  hitDetectLimit?: number;
  /** 交互时的目标帧率 */
  fpsOnInteracting?: number;
  /** 交互时图层 Canvas 限制数 */
  layerCanvasLimitOnInteracting?: number;
  /** 最大范围限制时是否裁剪 */
  limitExtentOnMaxExtent?: boolean;
  /** 窗口大小变化时固定中心 */
  fixCenterOnResize?: boolean;
  /** 检查容器尺寸变化 */
  checkSize?: boolean;
  /** 尺寸检查间隔（毫秒） */
  checkSizeInterval?: number;
  /** 级联俯仰角 */
  cascadePitches?: number[];
  /** 是否可渲染 */
  renderable?: boolean;
  /** 点击时间阈值 */
  clickTimeThreshold?: number;
  /** 屏幕外停止渲染 */
  stopRenderOnOffscreen?: boolean;
  /** 阻止滚轮滚动 */
  preventWheelScroll?: boolean;
  /** 阻止触屏事件 */
  preventTouch?: boolean;
  /** 支持插件事件 */
  supportPluginEvent?: boolean;
  /** 切换拖拽按钮（右键拖拽） */
  switchDragButton?: boolean;
  /** 鼠标移动节流时间 */
  mousemoveThrottleTime?: number;
  /** 鼠标移动节流开关 */
  mousemoveThrottleEnable?: boolean;
  /** 最大帧率 */
  maxFPS?: number;
  /** 调试模式 */
  debug?: boolean;
  /** 自动靠边平移 */
  autoPanAtEdge?: boolean;
  /** 框选缩放 */
  boxZoom?: boolean;
  /** 框选缩放样式 */
  boxZoomSymbol?: Record<string, unknown>;
  /** 仅可见几何响应事件 */
  onlyVisibleGeometryEvents?: boolean;
  /** 指南针控件 */
  compassControl?: boolean;
  /** 图层切换控件 */
  layerSwitcherControl?: boolean;
  /** 导航控件 */
  navControl?: boolean;
  /** 重置控件 */
  resetControl?: boolean;
  /** 地下相机最远距离（米） */
  cameraFarUndergroundInMeter?: number;
  /** 仅使用 WebGL1 */
  onlyWebGL1?: boolean;
  /** 保留绘制缓冲区 */
  preserveDrawingBuffer?: boolean;
  /** 每帧强制重绘 */
  forceRedrawPerFrame?: boolean;
  /** WebGL 扩展名列表 */
  extensions?: string[];
  /** WebGL 可选扩展名列表 */
  optionalExtensions?: string[];
  /** 相机近裁面缩放系数 */
  cameraNearScale?: number;
  /** 逃生舱：透传任意未建模的原始 Map 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── InfoWindow ─────────────────────────────────

/**
 * InfoWindow 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksInfoWindowOptions = { title: '标题', content: '<div>内容</div>', animation: 'scale' };
 */
export interface MaptalksInfoWindowOptions {
  /** 信息框标题，可用空字符串隐藏内置标题栏 */
  title?: string | HTMLElement;
  /** 弹出框内容（HTML 字符串或 DOM 元素），支持响应式 getter */
  content?: string | HTMLElement;
  /** 宽度 */
  width?: number | string;
  /** 高度（像素） */
  height?: number;
  /** 最小高度（像素） */
  minHeight?: number;
  /** 自定义模板（禁用 maptalks 内置 chrome） */
  custom?: boolean;
  /** 自动移动地图使信息框可见 */
  autoPan?: boolean;
  /** 自动关闭触发事件（如 'click'） */
  autoCloseOn?: string;
  /** 自动弹出事件（null 禁用弹出，默认 'click'） */
  autoOpenOn?: string | null;
  /** 是否唯一（同时只显示一个） */
  single?: boolean;
  /** 动画类型（如 'scale'） */
  animation?: string;
  /** 水平偏移（像素） */
  dx?: number;
  /** 垂直偏移（像素） */
  dy?: number;
  /** 水平对齐方式 */
  horizontalAlignment?: 'middle' | 'left' | 'right';
  /** 垂直对齐方式 */
  verticalAlignment?: 'middle' | 'top' | 'bottom';
  /** DOM 容器的 CSS 类名 */
  containerClass?: string;
  /** 是否启用模板引擎解析内容 */
  enableTemplate?: boolean;
  /** DOM 事件是否穿透到地图 */
  eventsPropagation?: boolean;
  /** 需要阻止传播的事件类型 */
  eventsToStop?: string;
  /** 是否随俯仰角倾斜 */
  pitchWithMap?: boolean;
  /** 是否随地图旋转 */
  rotateWithMap?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 动画时长（毫秒） */
  animationDuration?: number;
  /** 隐藏时是否播放动画 */
  animationOnHide?: boolean;
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 碰撞检测缓冲区大小（像素） */
  collisionBufferSize?: number;
  /** 碰撞检测权重 */
  collisionWeight?: number;
  /** 碰撞消失时是否淡入 */
  collisionFadeIn?: boolean;
  /** 自动靠边平移动画时长（毫秒） */
  autoPanDuration?: number;
  /** DOM 层级 */
  zIndex?: number;
  /** CSS 类名 */
  cssName?: string | string[];
  /** 是否启用滚动条 */
  enableScrollbar?: boolean;
  /** 坐标是否圆整 */
  roundPoint?: boolean;
  /** 逃生舱：透传任意未建模的原始 InfoWindow 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── TileLayer ─────────────────────────────────

/**
 * TileLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksTileLayerOptions = { urlTemplate: 'https://.../{z}/{x}/{y}.png' };
 */
export interface MaptalksTileLayerOptions {
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
  /** 是否作为底图 */
  background?: boolean;
  /** 淡入动画时长（毫秒） */
  fadeDuration?: number;
  /** 调试模式 */
  debug?: boolean;
  /** 最大缓存瓦片数 */
  maxCacheSize?: number;
  /** 级联瓦片渲染 */
  cascadeTiles?: boolean;
  /** 瓦片偏移 */
  offset?: number[] | ((...args: unknown[]) => number[]);
  /** 自定义瓦片坐标系 [xMin, yMin, xMax, yMax] */
  tileSystem?: [number, number, number, number];
  /** 占位瓦片（布尔值或函数） */
  placeholder?: boolean | ((...args: unknown[]) => boolean);
  /** 片元着色器源码 */
  fragmentShader?: string;
  /** 瓦片加载失败重试函数 */
  reloadErrorTileFunction?: (...args: unknown[]) => void;
  /** 是否在 Worker 中解码图片 */
  decodeImageInWorker?: boolean;
  /** 感知地形（3D 场景） */
  awareOfTerrain?: boolean;
  /** 缓冲区像素数 */
  bufferPixel?: number;
  /** 深度遮罩开关 */
  depthMask?: boolean;
  /** 交互时加载限制数 */
  loadingLimitOnInteracting?: number;
  /** 加载限制数 */
  loadingLimit?: number;
  /** 按俯仰角裁剪 */
  clipByPitch?: boolean;
  /** 金字塔模式（0/1） */
  pyramidMode?: number;
  /** 每帧瓦片限制数 */
  tileLimitPerFrame?: number;
  /** 瓦片栈起始深度 */
  tileStackStartDepth?: number;
  /** 瓦片栈深度 */
  tileStackDepth?: number;
  /** 启用 Mipmap 纹理 */
  mipmapTexture?: boolean;
  /** 优先加载当前层级瓦片 */
  currentTilesFirst?: boolean;
  /** 瓦片错误缩放系数 */
  tileErrorScale?: number;
  /** Canvas 合成模式（globalCompositeOperation） */
  globalCompositeOperation?: string;
  /** 调试轮廓颜色 */
  debugOutline?: string;
  /** CSS 滤镜（应用于图层） */
  cssFilter?: string;
  /** 拖拽平移时强制重渲染（性能调优） */
  forceRenderOnMoving?: boolean;
  /** 缩放时强制重渲染（性能调优） */
  forceRenderOnZooming?: boolean;
  /** 旋转时强制重渲染（性能调优） */
  forceRenderOnRotating?: boolean;
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 碰撞检测范围（'layer' / 'map'） */
  collisionScope?: string;
  /** 启用命中检测 */
  hitDetect?: boolean;
  /** 自定义 Canvas 元素（高级用法） */
  canvas?: HTMLCanvasElement;
  /** 遮罩几何图形（内部，使用 setMask 代替） */
  mask?: unknown;
  /** 立即绘制（内部） */
  drawImmediate?: boolean;
  /** 几何事件命中容差（像素） */
  geometryEventTolerance?: number;
  /** 按遮罩裁剪（内部） */
  maskClip?: boolean;
  /** 空间参考系 */
  spatialReference?: Record<string, unknown>;
  /** 逃生舱：透传任意未建模的原始 TileLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── VectorTileLayer ─────────────────────────────────

/**
 * VectorTileLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksVectorTileLayerOptions = { style: 'https://.../style.json' };
 */
export interface MaptalksVectorTileLayerOptions {
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
  /** 指定渲染器类型 */
  renderer?: string | null;
  /** 是否启用特性查询 */
  features?: boolean;
  /** 是否启用 schema 查询 */
  schema?: boolean;
  /** 碰撞检测缓冲区大小（像素） */
  collisionBuffserSize?: number;
  /** 点要素拾取 */
  pickingPoint?: boolean;
  /** 几何要素拾取 */
  pickingGeometry?: boolean;
  /** 每帧字形 SDF 限制数 */
  glyphSdfLimitPerFrame?: number;
  /** 碰撞检测帧限制数 */
  collisionFrameLimit?: number;
  /** 默认渲染开关 */
  defaultRendering?: boolean;
  /** 文字 Gamma 值 */
  textGamma?: number;
  /** 兼容方案（如解决 Intel GPU 崩溃） */
  workarounds?: Record<string, unknown>;
  /** 调试瓦片数据 */
  debugTileData?: boolean;
  /** 调试瓦片 */
  debugTile?: boolean;
  /** 海拔查询每帧时间限制（毫秒） */
  altitudeQueryTimeLimitPerFrame?: number;
  /** 使用 Worker 处理字形 */
  workerGlyph?: boolean;
  /** 优先当前层级瓦片 */
  currentTilesFirst?: boolean;
  /** 海拔属性名（别名） */
  altitudePropertyName?: string;
  /** 禁用海拔告警 */
  disableAltitudeWarning?: boolean;
  /** 加载瓦片错误日志 */
  loadTileErrorLog?: boolean;
  /** 加载瓦片错误忽略的状态码 */
  loadTileErrorLogIgnoreCodes?: number[];
  /** 加载瓦片缓存最大尺寸 */
  loadTileCachMaxSize?: number;
  /** 加载瓦片缓存日志 */
  loadTileCacheLog?: boolean;
  /** 在地形前渲染 */
  renderBeforeTerrain?: boolean;
  /** 子域名数组（用于加速瓦片加载） */
  subdomains?: string[] | number[];
  /** 瓦片加载的跨域属性（如 'anonymous'） */
  crossOrigin?: string;
  /** 瓦片加载出错时显示的替代图片 URL */
  errorUrl?: string;
  /** 淡入动画时长（毫秒） */
  fadeDuration?: number;
  /** 自定义 URL 模板标签 */
  customTags?: Record<string, unknown>;
  /** 缩放级别偏移 */
  zoomOffset?: number;
  /** 平移出世界边界时是否重复渲染瓦片 */
  repeatWorld?: boolean;
  /** 瓦片偏移 */
  offset?: number[] | ((...args: unknown[]) => number[]);
  /** 自定义瓦片坐标系 */
  tileSystem?: [number, number, number, number];
  /** 是否作为底图 */
  background?: boolean;
  /** 占位瓦片 */
  placeholder?: boolean | ((...args: unknown[]) => boolean);
  /** 片元着色器源码 */
  fragmentShader?: string;
  /** 瓦片加载失败重试函数 */
  reloadErrorTileFunction?: (...args: unknown[]) => void;
  /** 是否在 Worker 中解码图片 */
  decodeImageInWorker?: boolean;
  /** 感知地形（3D 场景） */
  awareOfTerrain?: boolean;
  /** 缓冲区像素数 */
  bufferPixel?: number;
  /** 深度遮罩开关 */
  depthMask?: boolean;
  /** 交互时加载限制数 */
  loadingLimitOnInteracting?: number;
  /** 加载限制数 */
  loadingLimit?: number;
  /** 按俯仰角裁剪 */
  clipByPitch?: boolean;
  /** 金字塔模式 */
  pyramidMode?: number;
  /** 每帧瓦片限制数 */
  tileLimitPerFrame?: number;
  /** 瓦片栈起始深度 */
  tileStackStartDepth?: number;
  /** 瓦片栈深度 */
  tileStackDepth?: number;
  /** 启用 Mipmap 纹理 */
  mipmapTexture?: boolean;
  /** 瓦片错误缩放系数 */
  tileErrorScale?: number;
  /** Canvas 合成模式 */
  globalCompositeOperation?: string;
  /** 调试轮廓颜色 */
  debugOutline?: string;
  /** CSS 滤镜 */
  cssFilter?: string;
  /** 拖拽平移时强制重渲染 */
  forceRenderOnMoving?: boolean;
  /** 缩放时强制重渲染 */
  forceRenderOnZooming?: boolean;
  /** 旋转时强制重渲染 */
  forceRenderOnRotating?: boolean;
  /** 碰撞检测范围（'layer' / 'map'） */
  collisionScope?: string;
  /** 启用命中检测 */
  hitDetect?: boolean;
  /** 自定义 Canvas 元素 */
  canvas?: HTMLCanvasElement;
  /** 遮罩几何图形 */
  mask?: unknown;
  /** 立即绘制 */
  drawImmediate?: boolean;
  /** 是否启用几何事件 */
  geometryEvents?: boolean;
  /** 几何事件命中容差（像素） */
  geometryEventTolerance?: number;
  /** 按遮罩裁剪 */
  maskClip?: boolean;
  /** 空间参考系 */
  spatialReference?: Record<string, unknown>;
  /** 调试模式 */
  debug?: boolean;
  /** 最大缓存瓦片数 */
  maxCacheSize?: number;
  /** 级联瓦片渲染 */
  cascadeTiles?: boolean;
  /** 逃生舱：透传任意未建模的原始 VectorTileLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── GLTFLayer ─────────────────────────────────

/**
 * GLTFLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksGLTFLayerOptions = { url: 'https://.../model.gltf', zIndex: 10 };
 */
export interface MaptalksGLTFLayerOptions {
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
  /** 逃生舱：透传任意未建模的原始 GLTFLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── ImageLayer ─────────────────────────────────

/**
 * ImageLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 支持 `crossOrigin`、`renderer`（'canvas' / 'gl'）、`alphaTest` 等原生选项。
 * maptalks-gl 版本升级时需同步新增原生字段。
 *
 * @example
 * const opts: MaptalksImageLayerOptions = { crossOrigin: 'anonymous', renderer: 'gl' };
 */
export interface MaptalksImageLayerOptions {
  /** 图片跨域策略 */
  crossOrigin?: string;
  /** 渲染器类型（'canvas' / 'gl'） */
  renderer?: string;
  /** GL 渲染器 alpha 测试阈值 */
  alphaTest?: number;
  /** GL 渲染器深度写入开关 */
  depthMask?: boolean;
  /** 深度测试函数 */
  depthFunc?: string;
  /** 底层版权信息 */
  attribution?: string;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 图层不透明度（0–1） */
  opacity?: number;
  /** 图层层级 */
  zIndex?: number;
  /** 交互时强制重渲 */
  forceRenderOnMoving?: boolean;
  /** 缩放时强制重渲 */
  forceRenderOnZooming?: boolean;
  /** 旋转时强制重渲 */
  forceRenderOnRotating?: boolean;
  /** CSS 滤镜 */
  cssFilter?: string;
  /** 调试轮廓颜色 */
  debugOutline?: string;
  /** Canvas 合成模式 */
  globalCompositeOperation?: string;
  /** 逃生舱：透传任意未建模的原始 ImageLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── WMSLayer ─────────────────────────────────

/**
 * WMSLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 * WMSTileLayer 继承 TileLayer，此处包含全部 TileLayer 字段。
 *
 * @example
 * const opts: MaptalksWMSLayerOptions = { layers: 'topp:states', format: 'image/png', transparent: true };
 */
export interface MaptalksWMSLayerOptions {
  /** WMS 图层名（逗号分隔多个图层） */
  layers?: string;
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
  /** WMS 样式名 */
  styles?: string;
  /** WMS 服务类型 */
  service?: string;
  /** 请求范围（minx,miny,maxx,maxy） */
  bbox?: string | [number, number, number, number];
  /** 图片宽度（像素） */
  width?: number;
  /** 图片高度（像素） */
  height?: number;
  /** 参数是否大写 */
  uppercase?: boolean;
  /** 自动检测 Retina 屏 */
  detectRetina?: boolean;
  /** 瓦片 URL 模板（继承自 TileLayer） */
  urlTemplate?: string | ((...args: unknown[]) => string);
  /** 子域名数组 */
  subdomains?: string[] | number[];
  /** 图层不透明度 */
  opacity?: number;
  /** 可见的最小缩放级别 */
  minZoom?: number;
  /** 可见的最大缩放级别 */
  maxZoom?: number;
  /** 图层层级 */
  zIndex?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 瓦片像素尺寸 */
  tileSize?: number | [number, number];
  /** 图层可用最大瓦片级别 */
  maxAvailableZoom?: number;
  /** 瓦片加载的跨域属性 */
  crossOrigin?: string;
  /** 瓦片加载出错时的替代图片 URL */
  errorUrl?: string;
  /** 认证 token */
  token?: string;
  /** 自定义 fetch 选项 */
  fetchOptions?: Record<string, unknown>;
  /** 瓦片淡入动画开关 */
  fadeAnimation?: boolean;
  /** 自定义 URL 模板标签 */
  customTags?: Record<string, unknown>;
  /** 平移出世界边界时是否重复渲染瓦片 */
  repeatWorld?: boolean;
  /** 缩放级别偏移 */
  zoomOffset?: number;
  /** 底层版权信息文本 */
  attribution?: string;
  /** 是否启用几何事件 */
  geometryEvents?: boolean;
  /** 指定渲染器类型 */
  renderer?: string | null;
  /** 是否作为底图 */
  background?: boolean;
  /** 淡入动画时长（毫秒） */
  fadeDuration?: number;
  /** 调试模式 */
  debug?: boolean;
  /** 最大缓存瓦片数 */
  maxCacheSize?: number;
  /** 级联瓦片渲染 */
  cascadeTiles?: boolean;
  /** 瓦片偏移 */
  offset?: number[] | ((...args: unknown[]) => number[]);
  /** 自定义瓦片坐标系 */
  tileSystem?: [number, number, number, number];
  /** 占位瓦片 */
  placeholder?: boolean | ((...args: unknown[]) => boolean);
  /** 片元着色器源码 */
  fragmentShader?: string;
  /** 瓦片加载失败重试函数 */
  reloadErrorTileFunction?: (...args: unknown[]) => void;
  /** 是否在 Worker 中解码图片 */
  decodeImageInWorker?: boolean;
  /** 感知地形（3D 场景） */
  awareOfTerrain?: boolean;
  /** 缓冲区像素数 */
  bufferPixel?: number;
  /** 深度遮罩开关 */
  depthMask?: boolean;
  /** 交互时加载限制数 */
  loadingLimitOnInteracting?: number;
  /** 加载限制数 */
  loadingLimit?: number;
  /** 按俯仰角裁剪 */
  clipByPitch?: boolean;
  /** 金字塔模式 */
  pyramidMode?: number;
  /** 每帧瓦片限制数 */
  tileLimitPerFrame?: number;
  /** 瓦片栈起始深度 */
  tileStackStartDepth?: number;
  /** 瓦片栈深度 */
  tileStackDepth?: number;
  /** 启用 Mipmap 纹理 */
  mipmapTexture?: boolean;
  /** 优先加载当前层级瓦片 */
  currentTilesFirst?: boolean;
  /** 瓦片错误缩放系数 */
  tileErrorScale?: number;
  /** Canvas 合成模式 */
  globalCompositeOperation?: string;
  /** 调试轮廓颜色 */
  debugOutline?: string;
  /** CSS 滤镜 */
  cssFilter?: string;
  /** 拖拽平移时强制重渲染 */
  forceRenderOnMoving?: boolean;
  /** 缩放时强制重渲染 */
  forceRenderOnZooming?: boolean;
  /** 旋转时强制重渲染 */
  forceRenderOnRotating?: boolean;
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 碰撞检测范围 */
  collisionScope?: string;
  /** 启用命中检测 */
  hitDetect?: boolean;
  /** 自定义 Canvas 元素 */
  canvas?: HTMLCanvasElement;
  /** 遮罩几何图形 */
  mask?: unknown;
  /** 立即绘制 */
  drawImmediate?: boolean;
  /** 几何事件命中容差 */
  geometryEventTolerance?: number;
  /** 按遮罩裁剪 */
  maskClip?: boolean;
  /** 空间参考系 */
  spatialReference?: Record<string, unknown>;
  /** 逃生舱：透传任意未建模的原始 WMSLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── GroupGLLayer ─────────────────────────────────

/**
 * GroupGLLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksGroupGLLayerOptions = { sceneConfig: { light: { ambient: '#fff' } }, zIndex: 5 };
 */
export interface MaptalksGroupGLLayerOptions {
  /** 场景配置（含 light 光照 / postProcess 后处理 / shadow 阴影 / weather 天气 / environment 环境光） */
  sceneConfig?: Record<string, unknown>;
  /** 地形配置（含 type / urlTemplate / tileSystem / shader 等） */
  terrain?: Record<string, unknown>;
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
  /** 底层版权信息 */
  attribution?: string;
  /** 指定渲染器类型 */
  renderer?: string;
  /** WebGL 扩展名列表 */
  extensions?: string[];
  /** 是否唯一（同时只有一个 GroupGLLayer） */
  single?: boolean;
  /** 仅使用 WebGL1 */
  onlyWebGL1?: boolean;
  /** WebGL 可选扩展名列表 */
  optionalExtensions?: string[];
  /** 缩放时强制重渲染 */
  forceRenderOnZooming?: boolean;
  /** 拖拽平移时强制重渲染 */
  forceRenderOnMoving?: boolean;
  /** 旋转时强制重渲染 */
  forceRenderOnRotating?: boolean;
  /** 视图移动阈值 */
  viewMoveThreshold?: number;
  /** 每帧强制重绘 */
  forceRedrawPerFrame?: boolean;
  /** 逃生舱：透传任意未建模的原始 GroupGLLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── VectorLayer ─────────────────────────────────

/**
 * VectorLayer 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 * maptalks-gl 版本升级时需同步新增原生字段。
 *
 * @example
 * const opts: MaptalksVectorLayerOptions = { zIndex: 3, opacity: 0.9 };
 */
export interface MaptalksVectorLayerOptions {
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
  /** 渲染器类型（'canvas' / 'gl' / 'gpu' / 'dom' / null） */
  renderer?: string | null;
  /** 底层版权信息 */
  attribution?: string;
  /** CSS 鼠标指针样式（如 'pointer' / 'crosshair'） */
  cursor?: string;
  /** 图层级样式（支持 filter 规则数组） */
  style?: Record<string, unknown> | Array<unknown>;
  /** 是否启用几何事件（click / hover 等） */
  geometryEvents?: boolean;
  /** 几何事件命中容差（像素） */
  geometryEventTolerance?: number;
  /** 是否启用渐进式渲染（分帧渲染大批量图形） */
  progressiveRender?: boolean;
  /** 每帧渐进渲染的图形数量 */
  progressiveRenderCount?: number;
  /** 是否启用几何简化（大数据量时提升性能） */
  enableSimplify?: boolean;
  /** 默认图标尺寸 [width, height] */
  defaultIconSize?: [number, number];
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 碰撞检测范围（'layer' / 'map'） */
  collisionScope?: string;
  /** 碰撞检测缓冲区大小（像素） */
  collisionBufferSize?: number;
  /** 碰撞检测更新延迟（毫秒） */
  collisionDelay?: number;
  /** 是否启用三维海拔 */
  enableAltitude?: boolean;
  /** 图层固定海拔高度（米） */
  altitude?: number;
  /** 海拔高度对应的属性名 */
  altitudeProperty?: string;
  /** 是否绘制连接线（地面到图形） */
  drawAltitude?: boolean;
  /** 按相机距离排序几何（3D 场景） */
  sortByDistanceToCamera?: boolean;
  /** 启用指针命中检测 */
  hitDetect?: boolean;
  /** CSS 滤镜（应用于图层） */
  cssFilter?: string;
  /** Canvas 合成模式（globalCompositeOperation） */
  globalCompositeOperation?: string;
  /** 拖拽平移时强制重渲染（性能调优） */
  forceRenderOnMoving?: boolean;
  /** 缩放时强制重渲染（性能调优） */
  forceRenderOnZooming?: boolean;
  /** 旋转时强制重渲染（性能调优） */
  forceRenderOnRotating?: boolean;
  /** 缓存矢量渲染在 Canvas 上 */
  cacheVectorOnCanvas?: boolean;
  /** 缓存 SVG 图标在 Canvas 上 */
  cacheSvgOnCanvas?: boolean;
  /** 调试渲染信息 */
  debug?: boolean;
  /** 调试轮廓颜色（内部使用） */
  debugOutline?: string;
  /** 渐进渲染调试 */
  progressiveRenderDebug?: boolean;
  /** BBox 裁剪缓冲区大小（像素） */
  clipBBoxBufferSize?: number;
  /** 圆整点坐标 */
  roundPoint?: boolean;
  /** 立即绘制（内部） */
  drawImmediate?: boolean;
  /** 自定义 Canvas 元素（高级用法） */
  canvas?: HTMLCanvasElement;
  /** 遮罩几何图形（内部，使用 setMask 代替） */
  mask?: unknown;
  /** 按遮罩裁剪（内部） */
  maskClip?: boolean;

  /** 逃生舱：透传任意未建模的原始 VectorLayer 选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── Tool Options ─────────────────────────────────

/**
 * DistanceTool 构造选项的用户输入类型。
 *
 * @description `Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksDistanceToolOptions = { symbol: { lineColor: '#ff0000' } };
 */
export type MaptalksDistanceToolOptions = Record<string, unknown>

/**
 * AreaTool 构造选项的用户输入类型。
 *
 * @description `Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksAreaToolOptions = { symbol: { polygonFill: '#00ff00' } };
 */
export type MaptalksAreaToolOptions = Record<string, unknown>

/**
 * DrawTool 构造选项的用户输入类型。
 *
 * @description `Record<string, unknown>`。后续可按 maptalks-gl API 补全原生字段（symbol / vertexSymbol / labelOptions 等）。
 *
 * @example
 * const opts: MaptalksDrawToolOptions = { symbol: { lineColor: '#ff0000' }, language: 'zh' };
 */
export type MaptalksDrawToolOptions = Record<string, unknown>

/**
 * 几何构造选项（手写展平基类，IDE 可补全全部原生字段）。
 *
 * @description 将所有几何对象共用的 Spec 字段（中文注释）+ Native 字段平铺合并。
 * 各几何类型（Marker/LineString/Polygon 等）通过 extends 继承此接口。
 *
 * @example
 * const opts: MaptalksGeometryBaseOptions = { symbol: { markerType: 'ellipse' }, draggable: true };
 */
export interface MaptalksGeometryBaseOptions {
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
  /** 几何 ID */
  id?: string | number;
  /** 旋转角度（度） */
  rotateAngle?: number;
  /** 旋转中心点 */
  rotatePivot?: number[];
  /** 事件命中测试开关 */
  hitTestForEvent?: boolean;
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 逃生舱：透传任意未建模的原始几何选项 */
  [key: string]: unknown;
}

/** Marker 构造选项 */
export interface MaptalksMarkerOptions extends MaptalksGeometryBaseOptions {}
/** LineString 构造选项 */
export interface MaptalksLineStringOptions extends MaptalksGeometryBaseOptions {}
/** Polygon 构造选项 */
export interface MaptalksPolygonOptions extends MaptalksGeometryBaseOptions {}
/** MultiPoint 构造选项 */
export interface MaptalksMultiPointOptions extends MaptalksGeometryBaseOptions {}
/** MultiLineString 构造选项 */
export interface MaptalksMultiLineStringOptions extends MaptalksGeometryBaseOptions {}
/** MultiPolygon 构造选项 */
export interface MaptalksMultiPolygonOptions extends MaptalksGeometryBaseOptions {}
/** Circle 构造选项 */
export interface MaptalksCircleOptions extends MaptalksGeometryBaseOptions {}
/** Rectangle 构造选项 */
export interface MaptalksRectangleOptions extends MaptalksGeometryBaseOptions {}
/** Ellipse 构造选项 */
export interface MaptalksEllipseOptions extends MaptalksGeometryBaseOptions {}
/** Sector 构造选项 */
export interface MaptalksSectorOptions extends MaptalksGeometryBaseOptions {}
/** Label 构造选项 */
export interface MaptalksLabelOptions extends MaptalksGeometryBaseOptions {
  /** 文字专属样式（textSize / textFill / textWeight / textHaloRadius 等） */
  textSymbol?: Record<string, unknown>;
  /** 文字背景框样式（boxFill / boxOpacity / boxLineColor / boxLineWidth 等） */
  boxStyle?: Record<string, unknown>;
}
/** TextBox 构造选项 */
export interface MaptalksTextBoxOptions extends MaptalksGeometryBaseOptions {
  /** 文字样式（wrap / padding / verticalAlignment / horizontalAlignment / symbol 等，TextBox 构造函数专属） */
  textStyle?: Record<string, unknown>;
  /** 文字背景框样式（markerType / markerFill / markerLineColor 等，TextBox 构造函数专属） */
  boxSymbol?: Record<string, unknown>;
}

// ───────────────────────────────── UIMarker ─────────────────────────────────

/**
 * UIMarker 构造选项（手写展平，IDE 可补全全部原生字段）。
 *
 * @description 将 Spec 字段（中文注释）+ Native 字段平铺合并为单一 interface。
 *
 * @example
 * const opts: MaptalksUIMarkerOptions = { content: '<div>HTML</div>', draggable: true, minZoom: 10 };
 */
export interface MaptalksUIMarkerOptions {
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
  /** 水平对齐方式 */
  horizontalAlignment?: 'middle' | 'left' | 'right';
  /** 垂直对齐方式 */
  verticalAlignment?: 'middle' | 'top' | 'bottom';
  /** 需要阻止传播的事件类型 */
  eventsToStop?: string;
  /** 水平偏移（像素） */
  dx?: number;
  /** 垂直偏移（像素） */
  dy?: number;
  /** 自动靠边平移 */
  autoPan?: boolean;
  /** 自动靠边平移动画时长（毫秒） */
  autoPanDuration?: number;
  /** 动画类型（如 'scale'） */
  animation?: string;
  /** 隐藏时是否播放动画 */
  animationOnHide?: boolean;
  /** 动画时长（毫秒） */
  animationDuration?: number;
  /** 是否随俯仰角倾斜 */
  pitchWithMap?: boolean;
  /** 是否随地图旋转 */
  rotateWithMap?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 坐标是否圆整 */
  roundPoint?: boolean;
  /** 碰撞检测开关 */
  collision?: boolean;
  /** 碰撞检测缓冲区大小（像素） */
  collisionBufferSize?: number;
  /** 碰撞检测权重 */
  collisionWeight?: number;
  /** 碰撞消失时是否淡入 */
  collisionFadeIn?: boolean;
  /** DOM 层级 */
  zIndex?: number;
  /** CSS 类名 */
  cssName?: string | string[];
  /** 是否启用滚动条 */
  enableScrollbar?: boolean;
  /** 逃生舱：透传任意未建模的原始 UIMarker 选项 */
  [key: string]: unknown;
}
