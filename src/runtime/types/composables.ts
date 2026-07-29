/* oxlint-disable max-lines */

/**
 * 所有 composable 的 Options / Return 类型。
 *
 * @description 各 useMaptalks* 函数的入参与出参类型均在此定义。
 */

import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';

import type {
  MaptalksCircleOptions,
  MaptalksEllipseOptions,
  MaptalksGLTFLayerOptions,
  MaptalksImageLayerOptions,
  MaptalksLabelOptions,
  MaptalksLineStringOptions,
  MaptalksMapOptions,
  MaptalksMarkerOptions,
  MaptalksMultiLineStringOptions,
  MaptalksMultiPointOptions,
  MaptalksMultiPolygonOptions,
  MaptalksPolygonOptions,
  MaptalksRectangleOptions,
  MaptalksSectorOptions,
  MaptalksTextBoxOptions,
  MaptalksTileLayerOptions,
  MaptalksVectorLayerOptions,
  MaptalksVectorTileLayerOptions,
  MaptalksWMSLayerOptions,
} from './options';
import type {
  MaptalksError,
  MaptalksSource,
  ResolvedSource,
} from './sources';
import type {
  MaptalksControl,
  MaptalksCoordinate,
  MaptalksEventHandler,
  MaptalksGeometry,
  MaptalksLayer,
  MaptalksMap,
  MaptalksMapTool,
  MaptalksVectorLayer,
  MaptalksViewLike,
} from './structural';

// ───────────────────────────────── useMaptalks ─────────────────────────────────

/**
 * `useMaptalks` 的可选项。
 *
 * @description 继承 maptalks Map 构造选项强类型；额外的 `name` / `onError` 由本模块消费，不透传构造器。
 *
 * @example
 * useMaptalks(target, { name: 'main', center: [113.27, 23.13], zoom: 10, minZoom: 3 });
 */
export interface UseMaptalksOpts extends MaptalksMapOptions {
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

// ───────────────────────────────── useMaptalksLayer ─────────────────────────────────

/**
 * `useMaptalksLayer` 的可选项。
 *
 * @description 控制响应式图层选项的注入与自动销毁、以及创建门控。
 *
 * @example
 * useMaptalksLayer(map, factory, { options: computed(() => ({ opacity })), autoDispose: true });
 */
export interface UseMaptalksLayerOpts {
  /** 响应式图层选项，变化时按图层能力（setStyle/config/setOptions）应用 */
  options?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
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
  /** 显示图层 */
  show: () => void;
  /** 隐藏图层 */
  hide: () => void;
  /** 命令式应用一组图层选项 */
  update: (options: Record<string, unknown>) => void;
  /** 命令式移除并销毁图层 */
  remove: () => void;
}

/**
 * `useMaptalksVectorLayer` 的返回（窄类型，含几何增删方法）。
 *
 * @description VectorLayer 独有 `addGeometry` / `removeGeometry` / `getGeometries` / `clear` 等方法，
 * 下游 geometry preset 依赖此类型。基类 `UseMaptalksLayerReturn` 仅暴露图层通用方法。
 *
 * @example
 * const { layer, update, remove } = useMaptalksVectorLayer(map);
 * layer.value?.addGeometry(geo);
 */
export interface UseMaptalksVectorLayerReturn {
  /** VectorLayer 实例（创建前为 null） */
  layer: ShallowRef<MaptalksVectorLayer | null>;
  /** 显示图层 */
  show: () => void;
  /** 隐藏图层 */
  hide: () => void;
  /** 命令式应用一组图层选项 */
  update: (options: Record<string, unknown>) => void;
  /** 命令式移除并销毁图层 */
  remove: () => void;
}

// ───────────────────────────────── useMaptalksLayerControl ─────────────────────────────────

/**
 * `useMaptalksLayerControl` 的可选项。
 *
 * @description 响应式 `visible` 驱动 show/hide，响应式 `opacity` 驱动 setOpacity；
 * 两者均可选，未传则不自动联动（仍可用命令式方法）。
 *
 * @example
 * useMaptalksLayerControl(layer, { visible: () => show.value, opacity: () => alpha.value });
 */
export interface UseMaptalksLayerControlOpts {
  /** 响应式可见性：true → show，false → hide */
  visible?: MaybeRefOrGetter<boolean>;
  /** 响应式不透明度（0–1），变化时调用图层 setOpacity */
  opacity?: MaybeRefOrGetter<number>;
}

/**
 * `useMaptalksLayerControl` 的返回。
 *
 * @description 暴露图层显隐 / 透明度 / 层级的命令式方法。
 *
 * @example
 * const { show, hide, toggle, setOpacity, bringToFront, bringToBack } = useMaptalksLayerControl(layer);
 */
export interface UseMaptalksLayerControlReturn {
  /** 显示图层 */
  show: () => void;
  /** 隐藏图层 */
  hide: () => void;
  /** 在显示 / 隐藏之间切换 */
  toggle: () => void;
  /** 设置图层不透明度（0–1） */
  setOpacity: (opacity: number) => void;
  /** 将图层置于同级最上层 */
  bringToFront: () => void;
  /** 将图层置于同级最下层 */
  bringToBack: () => void;
}

// ───────────────────────────────── useMaptalksRegistry ─────────────────────────────────

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

// ───────────────────────────────── useMaptalksCamera ─────────────────────────────────

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
  panTo: (coord: [number, number], options?: Record<string, unknown>) => void;
  /** 按像素偏移平移，offset 为 [x, y] 或 maptalks Point */
  panBy: (
    offset: [number, number] | Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => void;
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

// ───────────────────────────────── useMaptalksSource ─────────────────────────────────

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

// ───────────────────────────────── Preset Base + Layer Options ─────────────────────────────────

/**
 * 预设图层（带 source 的）通用可选项。
 *
 * @description 预设接受命名源（按 `runtimeConfig.sources` 解析）或内联源对象，并可覆盖图层 id 与选项。
 *
 * @example
 * useMaptalksTileLayer(map, { source: 'base', id: 'baseLayer' });
 */
export interface UseMaptalksPresetBaseOpts {
  /** 数据源：源名（字符串，按配置解析）或内联源对象 */
  source?: string | MaptalksSource;
  /** 图层 id，缺省自动生成 */
  id?: string | number;
  /** 透传给图层构造器的额外选项（预设覆写为具体 CombinedOptions + MaybeRefOrGetter） */
  options?: unknown;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除图层，默认 `true` */
  autoDispose?: boolean;
}

/** useMaptalksTileLayer 的 opts 参数 */
export type UseMaptalksTileLayerOpts = Omit<UseMaptalksPresetBaseOpts, 'options'> & {
  options?: MaptalksTileLayerOptions | MaybeRefOrGetter<MaptalksTileLayerOptions | undefined>;
};

/** useMaptalksVectorTileLayer 的 opts 参数 */
export type UseMaptalksVectorTileLayerOpts = Omit<UseMaptalksPresetBaseOpts, 'options'> & {
  options?: MaptalksVectorTileLayerOptions | MaybeRefOrGetter<MaptalksVectorTileLayerOptions | undefined>;
};

/** useMaptalksGLTFLayer 的 opts 参数 */
export type UseMaptalksGLTFLayerOpts = Omit<UseMaptalksPresetBaseOpts, 'options'> & {
  options?: MaptalksGLTFLayerOptions | MaybeRefOrGetter<MaptalksGLTFLayerOptions | undefined>;
};

/** useMaptalksWMSLayer 的 opts 参数 */
export type UseMaptalksWMSLayerOpts = Omit<UseMaptalksPresetBaseOpts, 'options'> & {
  options?: MaptalksWMSLayerOptions | MaybeRefOrGetter<MaptalksWMSLayerOptions | undefined>;
};

/**
 * useMaptalksImageLayer 的 opts 参数。
 *
 * @description ImageLayer 不需要数据源解析，直接接受图片数组与构造选项。
 * images 为 `{ url, extent, opacity? }` 对象数组。
 *
 * @example
 * useMaptalksImageLayer(map, { images: [{ url: 'a.png', extent: [xmin, ymin, xmax, ymax] }] });
 */
export interface UseMaptalksImageLayerOpts {
  /** 图层 id，缺省自动生成 */
  id?: string | number;
  /** 图片数组 */
  images?: MaybeRefOrGetter<Array<{ url: string; extent: unknown; opacity?: number }> | undefined>;
  /** 透传给 ImageLayer 构造器的完整选项 */
  options?: MaybeRefOrGetter<MaptalksImageLayerOptions | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除图层，默认 true */
  autoDispose?: boolean;
}

// ───────────────────────────────── useMaptalksInstance ─────────────────────────────────

/**
 * `useMaptalksInstance` 的返回（按名获取的响应式地图）。
 *
 * @example
 * const map: MaptalksInstanceRef = useMaptalksInstance('main');
 */
export type MaptalksInstanceRef = ComputedRef<MaptalksMap | null>;

// ───────────────────────────────── useMaptalksExport ─────────────────────────────────

/**
 * `useMaptalksExport` 的导出选项。
 *
 * @description 透传给 maptalks `toDataURL` 的图片选项，未建模键经索引签名透传。
 *
 * @example
 * const png = toDataURL({ mimeType: 'image/png' });
 */
export interface UseMaptalksExportOpts {
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
  toDataURL: (options?: UseMaptalksExportOpts) => string | null;
  /** 导出为 Blob（map 为 null resolve null；失败 reject 并经 logger 记录） */
  toBlob: (options?: UseMaptalksExportOpts) => Promise<Blob | null>;
  /** 触发浏览器下载（map 为 null no-op） */
  download: (filename: string, options?: UseMaptalksExportOpts) => void;
}

// ───────────────────────────────── useMaptalksSync ─────────────────────────────────

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
export interface UseMaptalksSyncOpts {
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
  /** 是否已启用同步 */
  isEnabled: Ref<boolean>;
}

// ───────────────────────────────── useMaptalksGeometry ─────────────────────────────────

/**
 * `useMaptalksGeometry` 的可选项。
 *
 * @description 响应式坐标 / symbol / properties（shallow watch）+ 事件 + 自动销毁。
 *
 * @example
 * useMaptalksGeometry(layer, factory, { coordinates: () => coords.value, events: { click } });
 */
export interface UseMaptalksGeometryOpts {
  /** 响应式坐标（shallow watch，替换才更新） */
  coordinates?: MaybeRefOrGetter<unknown>;
  /** 响应式 symbol（透传，含静态对象、组合 symbol 数组、zoom-stops 数组） */
  symbol?: MaybeRefOrGetter<
    Record<string, unknown> | Array<Record<string, unknown>> | Array<[number, Record<string, unknown>]> | undefined
  >;
  /** 响应式业务属性 */
  properties?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
  /** 选项整体变化时触发全量重建（remove + recreate），对标 useMaptalksInfoWindow 的 options 重建机制 */
  options?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 几何 id（统一从预设选项中声明） */
  id?: string | number;
  /** 响应式可见性：false 隐藏几何但不销毁 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 是否响应鼠标/触摸事件 */
  interactive?: MaybeRefOrGetter<boolean | undefined>;
  /** 是否可编辑（出现编辑锚点） */
  editable?: MaybeRefOrGetter<boolean | undefined>;
  /** 鼠标悬停 CSS cursor */
  cursor?: MaybeRefOrGetter<string | undefined>;
  /** 是否可拖拽 */
  draggable?: MaybeRefOrGetter<boolean | undefined>;
  /** 拖拽时是否显示影子 */
  dragShadow?: MaybeRefOrGetter<boolean | undefined>;
  /** 拖拽约束轴（true 或 'x' / 'y'） */
  dragOnAxis?: MaybeRefOrGetter<boolean | string | undefined>;
  /** 是否仅在屏幕轴向拖拽 */
  dragOnScreenAxis?: MaybeRefOrGetter<boolean | undefined>;
  /** 几何在图层内的叠放顺序 */
  zIndex?: MaybeRefOrGetter<number | undefined>;
  /** 是否处理反子午线跨越 */
  antiMeridian?: MaybeRefOrGetter<boolean | undefined>;
  /** 缺省投影 */
  defaultProjection?: MaybeRefOrGetter<string | undefined>;
  /** 量测方式（如 'EPSG:4326'） */
  measure?: MaybeRefOrGetter<string | undefined>;
  /** 旋转角度（度） */
  rotateAngle?: MaybeRefOrGetter<number | undefined>;
  /** 旋转锚点 */
  rotatePivot?: MaybeRefOrGetter<[number, number] | undefined>;
  /**
   * 额外响应式属性（形状/文本几何的 radius/width/height/angles/content 等）。
   * 逐项 shallow watch，变化时调 `apply` 写回几何。
   */
  extraProps?: Array<{
    value: MaybeRefOrGetter<unknown>;
    apply: (geo: MaptalksGeometry, value: unknown) => void;
  }>;
}

/**
 * `useMaptalksGeometry` 及各几何预设的返回。
 *
 * @description 暴露响应式几何实例与命令式显隐/移除。泛型参数支持几何窄类型。
 *
 * @example
 * const { geometry, remove } = useMaptalksMarker(layer, { coordinates: [0, 0] });
 *
 * @template T - 几何具体类型，默认 MaptalksGeometry
 */
export interface UseMaptalksGeometryReturn<T extends MaptalksGeometry = MaptalksGeometry> {
  /** 几何实例（创建前为 null） */
  geometry: ShallowRef<T | null>;
  /** 显示几何 */
  show: () => void;
  /** 隐藏几何 */
  hide: () => void;
  /** 命令式移除并销毁几何 */
  remove: () => void;
}

// ───────────────────────────────── useMaptalksVectorLayer (Base) ─────────────────────────────────

/**
 * `useMaptalksVectorLayer` 的可选项。
 *
 * @description 图层 id / 透传选项 / 自动销毁。
 *
 * @example
 * useMaptalksVectorLayer(map, { id: 'geo' });
 */
export interface UseMaptalksVectorLayerBaseOpts {
  /** 图层 id，缺省自动生成 */
  id?: string | number;
  /** 透传给 VectorLayer 构造器的选项 */
  options?: MaptalksVectorLayerOptions;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除图层，默认 true */
  autoDispose?: boolean;
}

/** useMaptalksVectorLayer 的 opts 参数 */
export type UseMaptalksVectorLayerOpts = Omit<UseMaptalksVectorLayerBaseOpts, 'options'> & {
  options?: MaptalksVectorLayerOptions | MaybeRefOrGetter<MaptalksVectorLayerOptions | undefined>;
};

// ───────────────────────────────── Geometry Preset Base ─────────────────────────────────

/**
 * 所有几何预设 Option 的共享基类。
 *
 * @description 几何预设共享字段（properties / events / id / autoDispose），
 * 各预设接口独立 extends 本接口。
 */
export interface GeometryPresetBase {
  /** 响应式 properties */
  properties?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 事件名 → 处理器 */
  events?: Record<string, MaptalksEventHandler>;
  /** 几何 id */
  id?: string | number;
  /** 自动销毁，默认 true */
  autoDispose?: boolean;
  /** 透传原生几何选项 */
  [key: string]: unknown;
}

// ───────────────────────────────── Geometry Preset Options (Marker, LineString, ...) ─────────────────────────────────

/**
 * Marker 预设可选项（对标 useMaptalksInfoWindowSpecOptions 的 options-based 模式）。
 *
 * @description 坐标保留在顶层；其余全部原生字段经 options 透传（含 symbol / properties / draggable 等）。
 *
 * @example
 * useMaptalksMarker(layer, { coordinates: () => pos.value, options: { symbol: { markerType: 'ellipse' }, draggable: true } });
 */
export interface UseMaptalksMarkerOpts {
  /** 响应式 Marker 坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 透传给 Marker 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMarkerOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * LineString 预设可选项。
 *
 * @description 坐标保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksLineString(layer, { coordinates: () => path.value, options: { symbol: { lineColor: '#ff0000' } } });
 */
export interface UseMaptalksLineStringOpts {
  /** 响应式 LineString 坐标 */
  coordinates: MaybeRefOrGetter<number[][]>;
  /** 透传给 LineString 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksLineStringOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * Polygon 预设可选项。
 *
 * @description 坐标保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksPolygon(layer, { coordinates: () => rings.value, options: { symbol: { polygonFill: '#00ff00' } } });
 */
export interface UseMaptalksPolygonOpts {
  /** 响应式 Polygon 坐标（单环二维数组或环形/多洞三维数组） */
  coordinates: MaybeRefOrGetter<number[][][] | number[][]>;
  /** 透传给 Polygon 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksPolygonOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * MultiPoint 预设可选项。
 */
export interface UseMaptalksMultiPointOpts {
  /** 响应式 MultiPoint 坐标 */
  coordinates: MaybeRefOrGetter<number[][]>;
  /** 透传给 MultiPoint 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiPointOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * MultiLineString 预设可选项。
 */
export interface UseMaptalksMultiLineStringOpts {
  /** 响应式 MultiLineString 坐标 */
  coordinates: MaybeRefOrGetter<number[][][]>;
  /** 透传给 MultiLineString 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiLineStringOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * MultiPolygon 预设可选项。
 */
export interface UseMaptalksMultiPolygonOpts {
  /** 响应式 MultiPolygon 坐标 */
  coordinates: MaybeRefOrGetter<number[][][][]>;
  /** 透传给 MultiPolygon 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiPolygonOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

// ───────────────────────────────── useMaptalksGeoJSON ─────────────────────────────────

/**
 * GeoJSON 数据（宽松建模）。
 *
 * @description FeatureCollection / Feature / Geometry 对象；不引入完整 GeoJSON 类型，保持「不依赖外部类型」。
 *
 * @example
 * const data: GeoJSONData = { type: 'FeatureCollection', features: [] };
 */
export type GeoJSONData = Record<string, unknown>;

/**
 * `useMaptalksGeoJSON` 的可选项。
 *
 * @description 响应式 GeoJSON 数据（替换触发清空重建）+ 统一 symbol + 自动销毁。
 *
 * @example
 * useMaptalksGeoJSON(layer, { data: () => geojson.value, symbol: { markerType: 'ellipse' } });
 */
export interface UseMaptalksGeoJSONOpts {
  /** 响应式 GeoJSON 数据 */
  data: MaybeRefOrGetter<GeoJSONData>;
  /** 统一应用到所有几何的 symbol（可选）；仅在 data 重建时应用，独立改 symbol 不重新应用 */
  symbol?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * `useMaptalksGeoJSON` 的返回。
 *
 * @description 暴露已创建的几何数组（GeoJSON 可能产生多个）与命令式移除。
 *
 * @example
 * const { geometries, remove } = useMaptalksGeoJSON(layer, { data: () => geojson.value });
 */
export interface UseMaptalksGeoJSONReturn {
  /** 已创建的几何数组 */
  geometries: ShallowRef<MaptalksGeometry[]>;
  /** 命令式移除全部几何 */
  remove: () => void;
}

// ───────────────────────────────── Shape Geometry Preset Options ─────────────────────────────────

/**
 * Circle 预设可选项。
 *
 * @description 中心坐标 + 半径保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksCircle(layer, { coordinates: () => center.value, radius: () => r.value, options: { symbol: { polygonFill: '#00ff00' } } });
 */
export interface UseMaptalksCircleOpts {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 响应式半径（米） */
  radius: MaybeRefOrGetter<number>;
  /** 透传给 Circle 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksCircleOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * Rectangle 预设可选项。
 *
 * @description 坐标 + 宽高保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksRectangle(layer, { coordinates: () => topLeft.value, width: () => w.value, height: () => h.value, options: { draggable: true } });
 */
export interface UseMaptalksRectangleOpts {
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 Rectangle 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksRectangleOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * Ellipse 预设可选项。
 *
 * @description 坐标 + 宽高保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksEllipse(layer, { coordinates: () => center.value, width: () => w.value, height: () => h.value });
 */
export interface UseMaptalksEllipseOpts {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 Ellipse 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksEllipseOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * Sector 预设可选项。
 *
 * @description 坐标 + 半径 + 起止角度保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksSector(layer, { coordinates: () => center.value, radius: () => r.value, startAngle: () => 0, endAngle: () => 90 });
 */
export interface UseMaptalksSectorOpts {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 响应式半径（米） */
  radius: MaybeRefOrGetter<number>;
  /** 响应式起始角（度） */
  startAngle: MaybeRefOrGetter<number>;
  /** 响应式结束角（度） */
  endAngle: MaybeRefOrGetter<number>;
  /** 透传给 Sector 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksSectorOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

// ───────────────────────────────── Text Geometry Preset Options ─────────────────────────────────

/**
 * `useMaptalksLabel` 的可选项（对标 useMaptalksInfoWindowSpecOptions 的 options-based 模式）。
 *
 * @description 必需字段（content / coordinates）在顶层；其余全部原生字段经 `options` 字段透传，
 * IDE 通过 `MaptalksLabelOptions` 获得 symbol / properties / textSymbol / draggable 等完整补全。
 *
 * @example
 * useMaptalksLabel(layer, {
 *   content: () => text.value,
 *   coordinates: () => anchor.value,
 *   options: { symbol: { textSize: 16 }, draggable: true },
 * });
 */
export interface UseMaptalksLabelOpts {
  /** 响应式文本内容 */
  content: MaybeRefOrGetter<string>;
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 透传给 Label 构造器的完整选项（symbol / properties / textSymbol / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksLabelOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * TextBox 预设可选项。
 *
 * @description 文本内容 + 坐标 + 宽高保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksTextBox(layer, { content: () => text.value, coordinates: () => anchor.value, width: () => w.value, height: () => h.value });
 */
export interface UseMaptalksTextBoxOpts {
  /** 响应式文本内容 */
  content: MaybeRefOrGetter<string>;
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<[number, number]>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 TextBox 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksTextBoxOptions | undefined>;
  /** 几何 id */
  id?: string | number;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

// ───────────────────────────────── Tool Options / Return ─────────────────────────────────

/**
 * `useMaptalksDistanceTool` / `useMaptalksAreaTool` 的可选项。
 *
 * @description 透传工具构造选项 + 事件绑定 + 自动销毁控制。泛型参数 `TNative` 接受从 maptalks-gl
 * 推导的构造选项类型，IDE 可提示所有字段。
 *
 * @example
 * useMaptalksDistanceTool(map, { options: { language: 'zh' }, events: { measure: onMeasure } });
 */
export interface UseMaptalksToolOpts<TNative = Record<string, unknown>> {
  /** 透传给工具构造器的选项 */
  options?: MaybeRefOrGetter<(Partial<TNative> & Record<string, unknown>) | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 `true` */
  autoDispose?: boolean;
}

/**
 * `useMaptalksDistanceTool` / `useMaptalksAreaTool` 的返回。
 *
 * @description 暴露响应式工具实例与命令式移除。
 *
 * @example
 * const { tool, remove } = useMaptalksDistanceTool(map);
 */
export interface UseMaptalksToolReturn {
  /** 工具实例（创建前为 null） */
  tool: ShallowRef<MaptalksMapTool | null>;
  /** 命令式移除并销毁工具 */
  remove: () => void;
}

// ───────────────────────────────── useMaptalksControl ─────────────────────────────────

/**
 * `useMaptalksControl` 的返回。
 *
 * @description 暴露响应式控件实例与命令式移除方法。
 *
 * @example
 * const { control, remove } = useMaptalksControl(map, (mt) => new mt.control.Zoom());
 */
export interface UseMaptalksControlReturn {
  /** 控件实例（创建前为 null） */
  control: ShallowRef<MaptalksControl | null>;
  /** 命令式移除并销毁控件 */
  remove: () => void;
}
