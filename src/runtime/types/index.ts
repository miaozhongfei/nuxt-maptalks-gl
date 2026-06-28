/* eslint-disable max-lines */
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

import type { MaptalksError, MaptalksErrorCode } from '../core/errors';

export type { MaptalksError, MaptalksErrorCode };

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
 * maptalks `Map` 构造选项的手写强类型建模（高频字段）。
 *
 * @description 手写常用构造字段并保留索引签名兜底，不依赖 maptalks-gl 类型。
 * 每项均可选；未建模字段经 `[key: string]: unknown` 透传。
 *
 * @example
 * const opts: MaptalksMapOptions = { center: [113.27, 23.13], zoom: 10, minZoom: 3, dragPitch: true };
 */
export interface MaptalksMapOptions {
  /** 地图中心，支持坐标对象或 [lng, lat] 数组 */
  center?: MaptalksCoordinate | [number, number];
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
  /** 底图图层 */
  baseLayer?: MaptalksLayer;
  /** 初始图层数组 */
  layers?: MaptalksLayer[];
  /** 逃生舱口：透传任意未建模的 maptalks Map 选项（保留） */
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
  /** 目标中心，支持坐标对象或 [lng, lat] 数组 */
  center?: MaptalksCoordinate | [number, number];
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
  /** 读取当前中心坐标 */
  getCenter(): MaptalksCoordinate;
  /** 设置中心坐标 */
  setCenter(center: MaptalksCoordinate | [number, number]): MaptalksMap;
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
  panTo(coord: MaptalksCoordinate | [number, number], options?: Record<string, unknown>): MaptalksMap;
  /** 按像素偏移平移 */
  panBy(offset: [number, number] | Record<string, unknown>, options?: Record<string, unknown>): MaptalksMap;
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
  /** 读取图层 id */
  getId?(): string;
  /** 逃生舱口：访问任意未建模的原生成员 */
  [key: string]: unknown;
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
  TileLayer: new (id: string, options: Record<string, unknown>) => MaptalksLayer;
  /** 矢量瓦片图层构造器 */
  VectorTileLayer?: new (id: string, options: Record<string, unknown>) => MaptalksLayer;
  /** GroupGLLayer 构造器（承载 GL 图层与光照/后处理） */
  GroupGLLayer?: new (
    id: string,
    layers: MaptalksLayer[],
    options?: Record<string, unknown>,
  ) => MaptalksLayer;
  /** GLTFLayer 构造器 */
  GLTFLayer?: new (id: string, options?: Record<string, unknown>) => MaptalksLayer;
  /** DrawTool 构造器 */
  DrawTool?: new (options: Record<string, unknown>) => MaptalksDrawTool;
  /** 逃生舱口：访问任意未建模的导出 */
  [key: string]: unknown;
}

/**
 * 数据源类型：公开源。
 *
 * @description 直接携带 URL（可使用带域名白名单的公开 key），无需服务端换取。
 *
 * @example
 * const s: PublicSource = { kind: 'public', type: 'vt', urlTemplate: 'https://.../{z}/{x}/{y}.pbf' };
 */
export interface PublicSource {
  /** 源类别标识 */
  kind: 'public';
  /** 业务类型，如 'tile' / 'vt' / 'gltf' */
  type: string;
  /** 瓦片 URL 模板（含 {z}/{x}/{y}） */
  urlTemplate?: string;
  /** 普通 URL（非瓦片场景） */
  url?: string;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 数据源类型：签名源。
 *
 * @description 由客户端 resolver 调用项目自有 server route 换取签名 URL / 请求头，密钥不进前端。
 *
 * @example
 * const s: SignedSource = { kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' };
 */
export interface SignedSource {
  /** 源类别标识 */
  kind: 'signed';
  /** 业务类型，如 'tile' / 'vt' / 'gltf' */
  type: string;
  /** 项目自有的签名 server route 路径 */
  endpoint: string;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 数据源联合类型。
 *
 * @description 公开源与签名源二选一，预设按 `kind` 自动选择解析路径。
 *
 * @example
 * const sources: Record<string, MaptalksSource> = { base: { kind: 'public', type: 'tile', urlTemplate } };
 */
export type MaptalksSource = PublicSource | SignedSource;

/**
 * 解析后的数据源（可直接注入图层）。
 *
 * @description `resolveSource` 的输出，统一携带最终 URL / 请求头 / 额外选项。
 *
 * @example
 * const resolved: ResolvedSource = { type: 'tile', urlTemplate: 'https://.../{z}/{x}/{y}.png' };
 */
export interface ResolvedSource {
  /** 业务类型 */
  type: string;
  /** 解析后的瓦片 URL 模板 */
  urlTemplate?: string;
  /** 解析后的普通 URL */
  url?: string;
  /** 签名场景返回的请求头 */
  headers?: Record<string, string>;
  /** 透传给图层的额外选项 */
  options?: Record<string, unknown>;
}

/**
 * 模块默认项（相机 / 光照 / 后处理）。
 *
 * @description 预设从这里读取默认配置，字段形状由 maptalks 决定，统一以宽松对象建模。
 *
 * @example
 * const d: MaptalksDefaults = { camera: { center: [113.27, 23.13], zoom: 10 } };
 */
export interface MaptalksDefaults {
  /** 默认相机参数 */
  camera?: Record<string, unknown>;
  /** 默认光照参数（GroupGLLayer） */
  lighting?: Record<string, unknown>;
  /** 默认后处理参数（GroupGLLayer） */
  postProcess?: Record<string, unknown>;
}

/**
 * 模块配置项（用户可传，字段均可选）。
 *
 * @description 写入 `nuxt.config` 的 `maptalksGl` 配置块，安装期合并默认值后注入 `runtimeConfig.public.maptalksGl`。
 *
 * @example
 * export default defineNuxtConfig({
 *   modules: ['@lacqjs/nuxt-maptalks-gl'],
 *   maptalksGl: { sources: { base: { kind: 'public', type: 'tile', urlTemplate } } },
 * });
 */
export interface ModuleOptions {
  /** 是否启用模块，默认 `true` */
  enable?: boolean;
  /** 日志级别，0=静默 1=错误 2=警告 3=信息 4=调试 5=详细，默认 `3` */
  logLevel?: number | string;
  /** 命名数据源映射（key 为源名，供预设按名解析） */
  sources?: Record<string, MaptalksSource>;
  /** 默认相机 / 光照 / 后处理 */
  defaults?: MaptalksDefaults;
  /** 空间参考系配置（透传给 maptalks Map） */
  spatialReference?: Record<string, unknown>;
}

/**
 * 模块配置项（内部解析后，字段均必填）。
 *
 * @description 运行时从 `runtimeConfig.public.maptalksGl` 读取的最终配置。
 *
 * @example
 * const cfg = useRuntimeConfig().public.maptalksGl as ResolvedModuleOptions;
 */
export interface ResolvedModuleOptions {
  /** 是否启用模块 */
  enable: boolean;
  /** 日志级别 */
  logLevel: number | string;
  /** 命名数据源映射 */
  sources: Record<string, MaptalksSource>;
  /** 默认相机 / 光照 / 后处理 */
  defaults: MaptalksDefaults;
  /** 空间参考系配置 */
  spatialReference: Record<string, unknown>;
}

/**
 * `useMaptalks` 的可选项。
 *
 * @description 继承 maptalks Map 构造选项强类型；额外的 `name` / `onError` 由本模块消费，不透传构造器。
 *
 * @example
 * useMaptalks(target, { name: 'main', center: [113.27, 23.13], zoom: 10, minZoom: 3 });
 */
export interface UseMaptalksOptions extends MaptalksMapOptions {
  /** 命名实例：传入后登记进 MapRegistry，可经 useMaptalksInstance 按名获取 */
  name?: string;
  /** 初始化失败回调（与 error ref 同时触发） */
  onError?: (error: MaptalksError) => void;
}

/**
 * `useMaptalks` 的返回。
 *
 * @description 暴露响应式地图实例、就绪标记与错误。
 *
 * @example
 * const { map, isReady, error } = useMaptalks(target);
 */
export interface UseMaptalksReturn {
  /** 地图实例（client-only，创建前 / SSR 为 null） */
  map: ShallowRef<MaptalksMap | null>;
  /** 是否已创建完成 */
  isReady: Ref<boolean>;
  /** 初始化错误，正常时为 null */
  error: Ref<MaptalksError | null>;
}

/**
 * `useMaptalksLayer` 的可选项。
 *
 * @description 控制响应式图层选项的注入与自动销毁、以及创建门控。
 *
 * @example
 * useMaptalksLayer(map, factory, { options: computed(() => ({ opacity })), autoDispose: true });
 */
export interface UseMaptalksLayerOptions {
  /** 响应式图层选项，变化时按图层能力（setStyle/config/setOptions）应用 */
  options?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 作用域销毁时是否自动移除图层，默认 `true` */
  autoDispose?: boolean;
  /** 创建门控：为 false 时延迟创建（预设用于等待 source 解析），默认 `true` */
  enabled?: MaybeRefOrGetter<boolean>;
}

/**
 * `useMaptalksLayer` 与各预设的返回。
 *
 * @description 暴露响应式图层实例与命令式更新 / 移除方法。
 *
 * @example
 * const { layer, update, remove } = useMaptalksLayer(map, factory);
 */
export interface UseMaptalksLayerReturn {
  /** 图层实例（创建前为 null） */
  layer: ShallowRef<MaptalksLayer | null>;
  /** 命令式应用一组图层选项 */
  update: (options: Record<string, unknown>) => void;
  /** 命令式移除并销毁图层 */
  remove: () => void;
}

/**
 * `useMaptalksRegistry` 的返回。
 *
 * @description 暴露响应式的命名地图表与便捷查询方法，用于枚举与跨图协同。
 *
 * @example
 * const { instances, get, has } = useMaptalksRegistry();
 */
export interface UseMaptalksRegistryReturn {
  /** 响应式 name → 地图引用 表（client-only） */
  instances: ReadonlyMap<string, ShallowRef<MaptalksMap | null>>;
  /** 按名获取地图实例（不存在或未就绪返回 null） */
  get: (name: string) => MaptalksMap | null;
  /** 是否存在指定名的已登记地图 */
  has: (name: string) => boolean;
}

/**
 * `useMaptalksCamera` 的返回。
 *
 * @description 暴露双向同步的相机状态与命令式过渡方法。
 *
 * @example
 * const { center, zoom, flyTo } = useMaptalksCamera(map);
 */
export interface UseMaptalksCameraReturn {
  /** 双向同步的中心坐标 */
  center: Ref<MaptalksCoordinate | null>;
  /** 双向同步的缩放级别 */
  zoom: Ref<number | null>;
  /** 双向同步的俯仰角 */
  pitch: Ref<number | null>;
  /** 双向同步的方位角 */
  bearing: Ref<number | null>;
  /** 飞行过渡到目标视图 */
  flyTo: (view: MaptalksViewLike, options?: Record<string, unknown>) => void;
  /** 动画过渡到目标视图 */
  animateTo: (view: MaptalksViewLike, options?: Record<string, unknown>) => void;
  /** 适配范围 */
  fitExtent: (extent: unknown, zoomOffset?: number, options?: Record<string, unknown>) => void;
  /** 平移到目标坐标 */
  panTo: (coord: MaptalksCoordinate | [number, number], options?: Record<string, unknown>) => void;
  /** 按像素偏移平移，offset 为 [x, y] 或 maptalks Point */
  panBy: (offset: [number, number] | Record<string, unknown>, options?: Record<string, unknown>) => void;
  /** 读取当前可视范围 Extent（map 为 null 返回 null） */
  getExtent: () => unknown | null;
  /** 读取分辨率（map 为 null 返回 null） */
  getResolution: (zoom?: number) => number | null;
  /** 读取比例尺（map 为 null 返回 null） */
  getScale: (zoom?: number) => number | null;
  /** 设置最大可视范围，传 null 解除限制 */
  setMaxExtent: (extent: unknown | null) => void;
  /** 设置缩放区间，内部调 setMinZoom / setMaxZoom */
  setZoomRange: (min?: number, max?: number) => void;
}

/**
 * `useMaptalksSource` 的返回。
 *
 * @description 暴露响应式的解析结果、解析状态与错误，以及命令式重解析。
 *
 * @example
 * const { source, pending, resolve } = useMaptalksSource('secure');
 */
export interface UseMaptalksSourceReturn {
  /** 解析后的数据源（解析前为 null） */
  source: ShallowRef<ResolvedSource | null>;
  /** 是否正在解析 */
  pending: Ref<boolean>;
  /** 解析错误，正常时为 null */
  error: Ref<MaptalksError | null>;
  /** 命令式触发（重新）解析 */
  resolve: () => Promise<void>;
}

/**
 * 预设图层（带 source 的）通用可选项。
 *
 * @description 预设接受命名源（按 `runtimeConfig.sources` 解析）或内联源对象，并可覆盖图层 id 与选项。
 *
 * @example
 * useMaptalksTileLayer(map, { source: 'base', id: 'baseLayer' });
 */
export interface UseMaptalksPresetOptions {
  /** 数据源：源名（字符串，按配置解析）或内联源对象 */
  source?: string | MaptalksSource;
  /** 图层 id，缺省自动生成 */
  id?: string;
  /** 透传给图层构造器的额外选项 */
  options?: Record<string, unknown>;
  /** 作用域销毁时是否自动移除图层，默认 `true` */
  autoDispose?: boolean;
}

/**
 * `useMaptalksInstance` 的返回（按名获取的响应式地图）。
 *
 * @example
 * const map: MaptalksInstanceRef = useMaptalksInstance('main');
 */
export type MaptalksInstanceRef = ComputedRef<MaptalksMap | null>;

/**
 * `useMaptalksExport` 的导出选项。
 *
 * @description 透传给 maptalks `toDataURL` 的图片选项，未建模键经索引签名透传。
 *
 * @example
 * const png = toDataURL({ mimeType: 'image/png' });
 */
export interface UseMaptalksExportOptions {
  /** 图片 MIME，如 'image/png' / 'image/jpeg' */
  mimeType?: string;
  /** 质量（0–1，jpeg/webp 有效） */
  quality?: number;
  /** 透传给 maptalks toDataURL 的其它选项 */
  [key: string]: unknown;
}

/**
 * `useMaptalksExport` 的返回。
 *
 * @description 暴露三种导出形态：dataURL / Blob / 触发下载。
 *
 * @example
 * const { toDataURL, toBlob, download } = useMaptalksExport(map);
 */
export interface UseMaptalksExportReturn {
  /** 导出为 dataURL（map 为 null 返回 null） */
  toDataURL: (options?: UseMaptalksExportOptions) => string | null;
  /** 导出为 Blob（map 为 null resolve null；失败 reject 并经 logger 记录） */
  toBlob: (options?: UseMaptalksExportOptions) => Promise<Blob | null>;
  /** 触发浏览器下载（map 为 null no-op） */
  download: (filename: string, options?: UseMaptalksExportOptions) => void;
}

/**
 * 参与多图同步的视图维度。
 *
 * @description center/zoom/pitch/bearing 四选若干，默认全开。
 *
 * @example
 * const fields: MaptalksSyncField[] = ['center', 'zoom'];
 */
export type MaptalksSyncField = 'center' | 'zoom' | 'pitch' | 'bearing';

/**
 * `useMaptalksSync` 的可选项。
 *
 * @description 控制同步模型、主图、参与维度与监听事件。
 *
 * @example
 * useMaptalksSync(['left', 'right'], { mode: 'master-slave', master: 'left' });
 */
export interface UseMaptalksSyncOptions {
  /** 同步模型，默认 'mutual' */
  mode?: 'mutual' | 'master-slave';
  /** 主从模式的主图（实例或注册表名），mode='master-slave' 时必填 */
  master?: MaptalksMap | string;
  /** 参与同步的维度，默认四维全开 */
  fields?: MaptalksSyncField[];
  /** 监听的视图变更事件，默认 'moveend zoomend pitch rotate' */
  events?: string;
}

/**
 * `useMaptalksSync` 的返回。
 *
 * @description 暴露启停控制与同步状态。
 *
 * @example
 * const { enable, disable, isEnabled } = useMaptalksSync(['left', 'right']);
 */
export interface UseMaptalksSyncReturn {
  /** 启用同步 */
  enable: () => void;
  /** 停用同步 */
  disable: () => void;
  /** 是否处于同步中 */
  isEnabled: Ref<boolean>;
}
