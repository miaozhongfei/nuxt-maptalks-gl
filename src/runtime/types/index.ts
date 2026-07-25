/* eslint-disable max-lines */
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';
import {
  type AreaTool,
  type DistanceTool,
  type DrawTool,
  type GLTFLayer,
  type GroupGLLayer,
  Map as _MaptalksMapClass,
  Marker as _MarkerClass,
  type TileLayer,
  ui,
  type VectorLayer,
  type VectorTileLayer,
  type WMSTileLayer,
} from 'maptalks-gl'

import type { MaptalksError, MaptalksErrorCode } from '../core/errors';

/**
 * 从用户安装的 maptalks-gl 版本推导的 Map 构造选项类型（全部 76 字段）。
 *
 * @description 用 `ConstructorParameters<typeof Map>[1]` 提取构造函数第二个参数的类型，
 * 与安装的 maptalks-gl 版本保持同步，IDE 可提示所有选项字段。
 */
export type MaptalksNativeMapOptions = ConstructorParameters<typeof _MaptalksMapClass>[1]

/**
 * Map 构造选项的组合类型：建模字段（MaptalksMapOptions）+ 原生字段（MaptalksNativeMapOptions）。
 *
 * @description `Partial<MaptalksMapOptions> & Partial<MaptalksNativeMapOptions>`，
 * 用户构建 `ref<MaptalksMapCombinedOptions>({})` 时获得完整 IDE 补全。
 *
 * @example
 * const opts: MaptalksMapCombinedOptions = { center: [113.27, 23.13], zoom: 10, minZoom: 3 };
 */
export type MaptalksMapCombinedOptions = Partial<MaptalksMapOptions> & Partial<MaptalksNativeMapOptions>

/**
 * maptalks-gl 原生 InfoWindow 构造选项类型（推导自安装版本）。
 *
 * @description 用 `ConstructorParameters<typeof ui.InfoWindow>[0]` 提取构造函数参数类型，
 * IDE 可提示 title / content / custom / animation / autoPan / single / width / height / dx / dy / autoOpenOn 等字段。
 */
export type MaptalksNativeInfoWindowOptions = ConstructorParameters<typeof ui.InfoWindow>[0]

/**
 * maptalks-gl 原生 marker.setInfoWindow() 的选项类型。
 *
 * @description 与 InfoWindow 构造器使用相同的 `InfoWindowOptionsType`，
 * IDE 可提示 title / content / custom / animation / autoPan / single / width / height / dx / dy / autoOpenOn 等字段。
 */
export type MaptalksNativeMarkerInfoWindowOptions = ConstructorParameters<typeof ui.InfoWindow>[0]

/**
 * InfoWindow 常用选项（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 涵盖 maptalks InfoWindow 构造器 / marker.setInfoWindow() 的常用字段，
 * 并为每个字段提供中文说明。未列出的原生字段通过 `[key: string]: unknown` 透传。
 *
 * @example
 * const iwOpts: MaptalksInfoWindowOptions = { title: '标题', content: '<div>内容</div>', animation: 'scale' };
 */
export interface MaptalksInfoWindowOptions {
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
export type MaptalksMarkerInfoWindowOptions = MaptalksInfoWindowOptions;

/**
 * InfoWindow 构造选项的组合类型：建模字段（中文注释）+ 原生字段（IDE 补全）。
 *
 * @description `Partial<MaptalksInfoWindowOptions> & Omit<Partial<MaptalksNativeInfoWindowOptions>, keyof MaptalksInfoWindowOptions>`，
 * 用户构建 `ref<MaptalksInfoWindowCombinedOptions>({})` 时获得完整 IDE 补全。
 *
 * @example
 * const opts: MaptalksInfoWindowCombinedOptions = { title: '标题', content: '<div>内容</div>', animation: 'scale' };
 */
export type MaptalksInfoWindowCombinedOptions = Partial<MaptalksInfoWindowOptions>
  & Omit<Partial<MaptalksNativeInfoWindowOptions>, keyof MaptalksInfoWindowOptions>;

/**
 * 从 maptalks-gl 推导的 TileLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof TileLayer>[1]`，IDE 可提示 urlTemplate / opacity / zIndex 等所有字段。
 */
export type MaptalksNativeTileLayerOptions = ConstructorParameters<typeof TileLayer>[1]

/**
 * TileLayer 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeTileLayerOptions> & Record<string, unknown>`，
 * 允许用户传任意额外字段（透传给 maptalks 原生构造器）。
 *
 * @example
 * const opts: MaptalksTileLayerCombinedOptions = { urlTemplate: 'https://.../{z}/{x}/{y}.png' };
 */
export type MaptalksTileLayerCombinedOptions = Partial<MaptalksNativeTileLayerOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 VectorTileLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof VectorTileLayer>[1]`。
 */
export type MaptalksNativeVectorTileLayerOptions = ConstructorParameters<typeof VectorTileLayer>[1]

/**
 * VectorTileLayer 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeVectorTileLayerOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksVectorTileLayerCombinedOptions = { style: 'https://.../style.json' };
 */
export type MaptalksVectorTileLayerCombinedOptions = Partial<MaptalksNativeVectorTileLayerOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 GLTFLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof GLTFLayer>[1]`。
 */
export type MaptalksNativeGLTFLayerOptions = ConstructorParameters<typeof GLTFLayer>[1]

/**
 * GLTFLayer 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeGLTFLayerOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksGLTFLayerCombinedOptions = { url: 'https://.../model.gltf' };
 */
export type MaptalksGLTFLayerCombinedOptions = Partial<MaptalksNativeGLTFLayerOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 WMSTileLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof WMSTileLayer>[1]`。
 */
export type MaptalksNativeWMSTileLayerOptions = ConstructorParameters<typeof WMSTileLayer>[1]

/**
 * 从 maptalks-gl 推导的 GroupGLLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof GroupGLLayer>[2]`（第三个参数）。
 */
export type MaptalksNativeGroupGLLayerOptions = ConstructorParameters<typeof GroupGLLayer>[2]

/**
 * GroupGLLayer 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeGroupGLLayerOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksGroupGLLayerCombinedOptions = { lighting: { ambient: '#fff' } };
 */
export type MaptalksGroupGLLayerCombinedOptions = Partial<MaptalksNativeGroupGLLayerOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 VectorLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof VectorLayer>[2]`（第三个参数，geometries 之后）。
 */
export type MaptalksNativeVectorLayerOptions = ConstructorParameters<typeof VectorLayer>[2]

/**
 * VectorLayer 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeVectorLayerOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksVectorLayerCombinedOptions = { enableSimplify: false };
 */
export type MaptalksVectorLayerCombinedOptions = Partial<MaptalksNativeVectorLayerOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 DrawTool 构造选项类型。
 *
 * @description `ConstructorParameters<typeof DrawTool>[0]`（第一个参数）。
 */
export type MaptalksNativeDrawToolOptions = ConstructorParameters<typeof DrawTool>[0]

/**
 * 从 maptalks-gl 推导的 DistanceTool 构造选项类型。
 *
 * @description `ConstructorParameters<typeof DistanceTool>[0]`。
 */
export type MaptalksNativeDistanceToolOptions = ConstructorParameters<typeof DistanceTool>[0]

/**
 * DistanceTool 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeDistanceToolOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksDistanceToolCombinedOptions = { symbol: { lineColor: '#ff0000' } };
 */
export type MaptalksDistanceToolCombinedOptions = Partial<MaptalksNativeDistanceToolOptions> & Record<string, unknown>

/**
 * 从 maptalks-gl 推导的 AreaTool 构造选项类型。
 *
 * @description `ConstructorParameters<typeof AreaTool>[0]`。
 */
export type MaptalksNativeAreaToolOptions = ConstructorParameters<typeof AreaTool>[0]

/**
 * AreaTool 构造选项的用户输入类型。
 *
 * @description `Partial<MaptalksNativeAreaToolOptions> & Record<string, unknown>`。
 *
 * @example
 * const opts: MaptalksAreaToolCombinedOptions = { symbol: { polygonFill: '#00ff00' } };
 */
export type MaptalksAreaToolCombinedOptions = Partial<MaptalksNativeAreaToolOptions> & Record<string, unknown>

/**
 * 从用户安装的 maptalks-gl 版本推导的几何构造选项类型。
 *
 * @description 用 `ConstructorParameters<typeof Marker>[1]` 提取构造函数第二个参数的类型
 * （所有几何共享同一个 GeometryOptionsType 基类），与安装的 maptalks-gl 版本保持同步，
 * IDE 可提示全部原生几何字段。
 */
export type MaptalksNativeGeometryOptions = ConstructorParameters<typeof _MarkerClass>[1]

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
  /** 底图图层 */
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
 * 相机视图描述（用于 animateTo / flyTo 等）。
 *
 * @description 描述目标视图的中心、缩放、俯仰、方位，字段均可选。
 *
 * @example
 * const view: MaptalksViewLike = { center: [113.27, 23.13], zoom: 12, pitch: 45 };
 */
export interface MaptalksViewLike {
  /** 目标中心，支持坐标对象或 [lng, lat] 数组 */
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
  /** WMS 图层构造器（OGC WMS 服务，与 TileLayer 同构：id + options） */
  WMSLayer?: new (id: string, options: Record<string, unknown>) => MaptalksLayer;
  /** WMS 图层构造器的 maptalks-gl 实际导出名（maptalks 核心导出为 WMSTileLayer） */
  WMSTileLayer?: new (id: string, options: Record<string, unknown>) => MaptalksLayer;
  /** GroupGLLayer 构造器（承载 GL 图层与光照/后处理） */
  GroupGLLayer?: new (
    id: string,
    layers: MaptalksLayer[],
    options?: Record<string, unknown>,
  ) => MaptalksLayer;
  /** GLTFLayer 构造器 */
  GLTFLayer?: new (id: string, options?: Record<string, unknown>) => MaptalksLayer;
  /** VectorLayer 构造器（承载几何） */
  VectorLayer?: new (id: string, options?: Record<string, unknown>) => MaptalksVectorLayer;
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
  ui?: { InfoWindow?: new (options?: Record<string, unknown>) => MaptalksInfoWindow };
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
export interface UseMaptalksOptions extends MaptalksMapOptions, Omit<Partial<MaptalksNativeMapOptions>, keyof MaptalksMapOptions> {
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
  /** 命令式应用一组图层选项 */
  update: (options: Record<string, unknown>) => void;
  /** 命令式移除并销毁图层 */
  remove: () => void;
}

/**
 * `useMaptalksLayerControl` 的可选项。
 *
 * @description 响应式 `visible` 驱动 show/hide，响应式 `opacity` 驱动 setOpacity；
 * 两者均可选，未传则不自动联动（仍可用命令式方法）。
 *
 * @example
 * useMaptalksLayerControl(layer, { visible: () => show.value, opacity: () => alpha.value });
 */
export interface UseMaptalksLayerControlOptions {
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
  /** 是否已启用同步 */
  isEnabled: Ref<boolean>;
}

/**
 * maptalks 几何图形实例的结构化建模（仅声明本模块使用到的成员）。
 *
 * @description 通过结构化类型描述几何，核心读写/事件方法给出签名，索引签名提供逃生舱口。
 *
 * @example
 * const geo: MaptalksGeometry | null = useMaptalksMarker(layer, { coordinates: [0, 0] }).geometry.value;
 * geo?.setSymbol({ markerType: 'ellipse' });
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
  /** 设置业务属性 */
  setProperties(props: Record<string, unknown>): MaptalksGeometry;
  /** 读取业务属性 */
  getProperties(): Record<string, unknown>;
  /** 绑定事件 */
  on(events: string, handler: MaptalksEventHandler): MaptalksGeometry;
  /** 解绑事件 */
  off(events: string, handler: MaptalksEventHandler): MaptalksGeometry;
  /** 序列化为 GeoJSON */
  toGeoJSON(): unknown;
  /** 设置半径（Circle/Sector） */
  setRadius?(radius: number): MaptalksGeometry;
  /** 设置宽度（Rectangle/Ellipse/TextBox） */
  setWidth?(width: number): MaptalksGeometry;
  /** 设置高度（Rectangle/Ellipse/TextBox） */
  setHeight?(height: number): MaptalksGeometry;
  /** 设置起始角（Sector） */
  setStartAngle?(angle: number): MaptalksGeometry;
  /** 设置结束角（Sector） */
  setEndAngle?(angle: number): MaptalksGeometry;
  /** 设置文本内容（Label/TextBox） */
  setContent?(content: string): MaptalksGeometry;
  /** 显示几何图形 */
  show?(): MaptalksGeometry;
  /** 隐藏几何图形 */
  hide?(): MaptalksGeometry;
  /** 带动画过渡 show 显示（Line / Polygon 几何逐段绘制动画） */
  animateShow?(opts?: Record<string, unknown>): void;
  /** 样式动画过渡（interpolate） */
  animate?(styles: Record<string, unknown>, opts?: Record<string, unknown>): void;
  /** 沿路径移动动画 */
  moveAlong?(path: unknown, opts?: Record<string, unknown>): void;
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

/** Marker 坐标：单点 */
export type MarkerCoordinates = [number, number];
/** LineString 坐标：点序列 */
export type LineStringCoordinates = Array<[number, number]>;
/** Polygon 坐标：外环 + 内环（环为点序列） */
export type PolygonCoordinates = Array<Array<[number, number]>>;

/**
 * `useMaptalksGeometry` 的可选项。
 *
 * @description 响应式坐标 / symbol / properties（shallow watch）+ 事件 + 自动销毁。
 *
 * @example
 * useMaptalksGeometry(layer, factory, { coordinates: () => coords.value, events: { click } });
 */
export interface UseMaptalksGeometryOptions {
  /** 响应式坐标（shallow watch，替换才更新） */
  coordinates?: MaybeRefOrGetter<unknown>;
  /** 响应式 symbol（透传，含静态对象或 zoom-stops 数组） */
  symbol?: MaybeRefOrGetter<
    Record<string, unknown> | Array<[number, Record<string, unknown>]> | undefined
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
  id?: string;
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
 * @description 暴露响应式几何实例与命令式移除。
 *
 * @example
 * const { geometry, remove } = useMaptalksMarker(layer, { coordinates: [0, 0] });
 */
export interface UseMaptalksGeometryReturn {
  /** 几何实例（创建前为 null） */
  geometry: ShallowRef<MaptalksGeometry | null>;
  /** 命令式移除并销毁几何 */
  remove: () => void;
}

/**
 * `useMaptalksVectorLayer` 的可选项。
 *
 * @description 图层 id / 透传选项 / 自动销毁。
 *
 * @example
 * useMaptalksVectorLayer(map, { id: 'geo' });
 */
export interface UseMaptalksVectorLayerOptions {
  /** 图层 id，缺省自动生成 */
  id?: string;
  /** 透传给 VectorLayer 构造器的选项 */
  options?: Record<string, unknown>;
  /** 作用域销毁时是否自动移除图层，默认 true */
  autoDispose?: boolean;
}

/**
 * 所有几何预设 Option 的共享基类。
 *
 * @description 继承原生全部几何构造选项（从安装的 maptalks-gl 版本自动推导）+ 模块通用字段。
 * 每个具体的预设类型（Marker / LineString / Circle / Label 等）独立 extends 本接口，
 * 不存在跨几何类型的继承链条——原生几何之间也没有这样的继承关系。
 */
export interface GeometryPresetBase extends Omit<Partial<MaptalksNativeGeometryOptions>, 'id' | 'symbol' | 'properties'> {
  /** 响应式 properties */
  properties?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 事件名 → 处理器 */
  events?: Record<string, MaptalksEventHandler>;
  /** 几何 id */
  id?: string;
  /** 自动销毁，默认 true */
  autoDispose?: boolean;
}

/**
 * Marker 预设可选项（对标 useMaptalksInfoWindowOptions 的 options-based 模式）。
 *
 * @description 坐标保留在顶层；其余全部原生字段经 options 透传（含 symbol / properties / draggable 等）。
 *
 * @example
 * useMaptalksMarker(layer, { coordinates: () => pos.value, options: { symbol: { markerType: 'ellipse' }, draggable: true } });
 */
export interface UseMaptalksMarkerOptions {
  /** 响应式 Marker 坐标 */
  coordinates: MaybeRefOrGetter<MarkerCoordinates>;
  /** 透传给 Marker 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMarkerCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksLineStringOptions {
  /** 响应式 LineString 坐标 */
  coordinates: MaybeRefOrGetter<LineStringCoordinates>;
  /** 透传给 LineString 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksLineStringCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksPolygonOptions {
  /** 响应式 Polygon 坐标 */
  coordinates: MaybeRefOrGetter<PolygonCoordinates>;
  /** 透传给 Polygon 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksPolygonCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/** MultiPoint 坐标：点序列 */
export type MultiPointCoordinates = Array<[number, number]>;
/** MultiLineString 坐标：线序列 */
export type MultiLineStringCoordinates = Array<Array<[number, number]>>;
/** MultiPolygon 坐标：多边形序列（每个多边形为环数组） */
export type MultiPolygonCoordinates = Array<Array<Array<[number, number]>>>;

/**
 * MultiPoint 预设可选项。
 */
export interface UseMaptalksMultiPointOptions {
  /** 响应式 MultiPoint 坐标 */
  coordinates: MaybeRefOrGetter<MultiPointCoordinates>;
  /** 透传给 MultiPoint 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiPointCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksMultiLineStringOptions {
  /** 响应式 MultiLineString 坐标 */
  coordinates: MaybeRefOrGetter<MultiLineStringCoordinates>;
  /** 透传给 MultiLineString 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiLineStringCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksMultiPolygonOptions {
  /** 响应式 MultiPolygon 坐标 */
  coordinates: MaybeRefOrGetter<MultiPolygonCoordinates>;
  /** 透传给 MultiPolygon 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksMultiPolygonCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

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
export interface UseMaptalksGeoJSONOptions {
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

/** 形状/文本几何的坐标：单点（中心/角点/锚点） */
export type ShapeCoordinates = [number, number];

/**
 * Circle 预设可选项。
 *
 * @description 中心坐标 + 半径保留在顶层；其余全部原生字段经 options 透传。
 *
 * @example
 * useMaptalksCircle(layer, { coordinates: () => center.value, radius: () => r.value, options: { symbol: { polygonFill: '#00ff00' } } });
 */
export interface UseMaptalksCircleOptions {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 响应式半径（米） */
  radius: MaybeRefOrGetter<number>;
  /** 透传给 Circle 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksCircleCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksRectangleOptions {
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 Rectangle 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksRectangleCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksEllipseOptions {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 Ellipse 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksEllipseCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksSectorOptions {
  /** 响应式中心坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 响应式半径（米） */
  radius: MaybeRefOrGetter<number>;
  /** 响应式起始角（度） */
  startAngle: MaybeRefOrGetter<number>;
  /** 响应式结束角（度） */
  endAngle: MaybeRefOrGetter<number>;
  /** 透传给 Sector 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksSectorCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**

/**
 * `useMaptalksLabel` 的可选项（对标 useMaptalksInfoWindowOptions 的 options-based 模式）。
 *
 * @description 必需字段（content / coordinates）在顶层；其余全部原生字段经 `options` 字段透传，
 * IDE 通过 `MaptalksLabelCombinedOptions` 获得 symbol / properties / textSymbol / draggable 等完整补全。
 *
 * @example
 * useMaptalksLabel(layer, {
 *   content: () => text.value,
 *   coordinates: () => anchor.value,
 *   options: { symbol: { textSize: 16 }, draggable: true },
 * });
 */
export interface UseMaptalksLabelOptions {
  /** 响应式文本内容 */
  content: MaybeRefOrGetter<string>;
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 透传给 Label 构造器的完整选项（symbol / properties / textSymbol / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksLabelCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
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
export interface UseMaptalksTextBoxOptions {
  /** 响应式文本内容 */
  content: MaybeRefOrGetter<string>;
  /** 响应式坐标 */
  coordinates: MaybeRefOrGetter<ShapeCoordinates>;
  /** 响应式宽度（米） */
  width: MaybeRefOrGetter<number>;
  /** 响应式高度（米） */
  height: MaybeRefOrGetter<number>;
  /** 透传给 TextBox 构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
  options?: MaybeRefOrGetter<MaptalksTextBoxCombinedOptions | undefined>;
  /** 几何 id */
  id?: string;
  /** 响应式可见性 */
  visible?: MaybeRefOrGetter<boolean | undefined>;
  /** 事件名 → 处理器（自动 on/off） */
  events?: Record<string, MaptalksEventHandler>;
  /** 作用域销毁时是否自动移除，默认 true */
  autoDispose?: boolean;
}

/**
 * 几何构造选项的公共高频字段（带中文注释，遵循 AGENTS.md 强制类型提示规则）。
 *
 * @description 所有几何类型共享这些字段；各 preset 的建模 interface 继承此后可追加独有字段。
 * 未列出的原生字段经 `MaptalksNativeGeometryOptions` 补齐 IDE 自动补全。
 *
 * @example
 * const opts: MaptalksMarkerOptions = { symbol: { markerType: 'ellipse' }, draggable: true };
 */
export interface MaptalksGeometryBaseOptions {
  /** 渲染样式（支持 zoom-stops 数组） */
  symbol?: Record<string, unknown> | Array<[number, Record<string, unknown>]>;
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
export interface MaptalksMarkerOptions extends MaptalksGeometryBaseOptions {}
/** LineString 常用选项 */
export interface MaptalksLineStringOptions extends MaptalksGeometryBaseOptions {}
/** Polygon 常用选项 */
export interface MaptalksPolygonOptions extends MaptalksGeometryBaseOptions {}
/** MultiPoint 常用选项 */
export interface MaptalksMultiPointOptions extends MaptalksGeometryBaseOptions {}
/** MultiLineString 常用选项 */
export interface MaptalksMultiLineStringOptions extends MaptalksGeometryBaseOptions {}
/** MultiPolygon 常用选项 */
export interface MaptalksMultiPolygonOptions extends MaptalksGeometryBaseOptions {}
/** Circle 常用选项 */
export interface MaptalksCircleOptions extends MaptalksGeometryBaseOptions {}
/** Rectangle 常用选项 */
export interface MaptalksRectangleOptions extends MaptalksGeometryBaseOptions {}
/** Ellipse 常用选项 */
export interface MaptalksEllipseOptions extends MaptalksGeometryBaseOptions {}
/** Sector 常用选项 */
export interface MaptalksSectorOptions extends MaptalksGeometryBaseOptions {}
/** Label 常用选项 */
export interface MaptalksLabelOptions extends MaptalksGeometryBaseOptions {
  /** 文字专属样式（textSize / textFill / textWeight / textHaloRadius 等） */
  textSymbol?: Record<string, unknown>;
  /** 文字背景框样式（boxFill / boxOpacity / boxLineColor / boxLineWidth 等） */
  boxStyle?: Record<string, unknown>;
}
/** TextBox 常用选项 */
export interface MaptalksTextBoxOptions extends MaptalksGeometryBaseOptions {
  /** 文字专属样式（textSize / textFill / textWeight / textHaloRadius 等） */
  textSymbol?: Record<string, unknown>;
  /** 文字背景框样式（boxFill / boxOpacity / boxLineColor / boxLineWidth 等） */
  boxStyle?: Record<string, unknown>;
}

/** Marker 组件 options prop 类型——建模字段（中文注释）+ 原生字段（IDE 补全） */
export type MaptalksMarkerCombinedOptions = Partial<MaptalksMarkerOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMarkerOptions>;
/** LineString 组件 options prop 类型 */
export type MaptalksLineStringCombinedOptions = Partial<MaptalksLineStringOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksLineStringOptions>;
/** Polygon 组件 options prop 类型 */
export type MaptalksPolygonCombinedOptions = Partial<MaptalksPolygonOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksPolygonOptions>;
/** MultiPoint 组件 options prop 类型 */
export type MaptalksMultiPointCombinedOptions = Partial<MaptalksMultiPointOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiPointOptions>;
/** MultiLineString 组件 options prop 类型 */
export type MaptalksMultiLineStringCombinedOptions = Partial<MaptalksMultiLineStringOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiLineStringOptions>;
/** MultiPolygon 组件 options prop 类型 */
export type MaptalksMultiPolygonCombinedOptions = Partial<MaptalksMultiPolygonOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksMultiPolygonOptions>;
/** Circle 组件 options prop 类型 */
export type MaptalksCircleCombinedOptions = Partial<MaptalksCircleOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksCircleOptions>;
/** Rectangle 组件 options prop 类型 */
export type MaptalksRectangleCombinedOptions = Partial<MaptalksRectangleOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksRectangleOptions>;
/** Ellipse 组件 options prop 类型 */
export type MaptalksEllipseCombinedOptions = Partial<MaptalksEllipseOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksEllipseOptions>;
/** Sector 组件 options prop 类型 */
export type MaptalksSectorCombinedOptions = Partial<MaptalksSectorOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksSectorOptions>;
/** Label 组件 options prop 类型 */
export type MaptalksLabelCombinedOptions = Partial<MaptalksLabelOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksLabelOptions>;
/** TextBox 组件 options prop 类型 */
export type MaptalksTextBoxCombinedOptions = Partial<MaptalksTextBoxOptions>
  & Omit<Partial<MaptalksNativeGeometryOptions>, keyof MaptalksTextBoxOptions>;

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
 * `useMaptalksDistanceTool` / `useMaptalksAreaTool` 的可选项。
 *
 * @description 透传工具构造选项 + 事件绑定 + 自动销毁控制。泛型参数 `TNative` 接受从 maptalks-gl
 * 推导的构造选项类型，IDE 可提示所有字段。
 *
 * @example
 * useMaptalksDistanceTool(map, { options: { language: 'zh' }, events: { measure: onMeasure } });
 */
export interface UseMaptalksToolOptions<TNative = Record<string, unknown>> {
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
 * 动画 composable 通用返回。
 *
 * @description 每个动画 composable 返回统一的播放 / 停止 / 状态控制。
 *
 * @example
 * const { play, stop, isPlaying } = useMaptalksGeomAnimate(geo, { styles });
 */
export interface UseMaptalksAnimationReturn {
  /** 播放动画 */
  play: () => void;
  /** 停止动画 */
  stop: () => void;
  /** 是否正在播放 */
  isPlaying: Ref<boolean>;
}

/**
 * `useMaptalksGeomAnimate` 的可选项。
 *
 * @description 响应式 styles（插值目标样式）+ 动画参数 + 自动播放控制。
 *
 * @example
 * useMaptalksGeomAnimate(geo, { styles: () => ({ symbol: { markerWidth: 30 } }), autoPlay: true });
 */
export interface UseMaptalksGeomAnimateOptions {
  /** 响应式插值目标样式 */
  styles: MaybeRefOrGetter<Record<string, unknown>>;
  /** 动画参数（duration/easing 等），透传给 `geometry.animate()` */
  opts?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 就绪即播放，默认 `true` */
  autoPlay?: boolean;
}

/**
 * `useMaptalksMoveAlong` 的可选项。
 *
 * @description 响应式路径 + 动画参数 + 自动播放控制。
 *
 * @example
 * useMaptalksMoveAlong(geo, { path: () => lineCoords.value, autoPlay: true });
 */
export interface UseMaptalksMoveAlongOptions {
  /** 响应式路径（坐标数组） */
  path: MaybeRefOrGetter<unknown>;
  /** 动画参数（duration/easing/speed 等），透传给 `geometry.moveAlong()` */
  opts?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 就绪即播放，默认 `true` */
  autoPlay?: boolean;
}

/**
 * `useMaptalksLineAnimateShow` / `useMaptalksPolygonAnimateShow` 的可选项。
 *
 * @description 动画参数 + 自动播放控制。
 *
 * @example
 * useMaptalksLineAnimateShow(geo, { opts: { duration: 2000 }, autoPlay: true });
 */
export interface UseMaptalksAnimateShowOptions {
  /** 动画参数，透传给 `geometry.animateShow()` */
  opts?: MaybeRefOrGetter<Record<string, unknown> | undefined>;
  /** 就绪即播放，默认 `true` */
  autoPlay?: boolean;
}

/**
 * `useMaptalksViewFollow` 的可选项。
 *
 * @description 启用门控 + 自动播放控制 + 跟随参数。
 *
 * @example
 * useMaptalksViewFollow(map, geo, { autoPlay: true });
 */
export interface UseMaptalksViewFollowOptions {
  /** 就绪即播放，默认 `true` */
  autoPlay?: boolean;
}
