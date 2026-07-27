/**
 * 图层/组件 defineExpose 暴露的类型。
 */

import type {
  MaptalksInfoWindow,
  MaptalksLayer,
  MaptalksMap,
  MaptalksUIMarker,
  MaptalksVectorLayer,
} from './structural';

/**
 * 图层组件 defineExpose 暴露的泛型基类。
 *
 * @description `defineExpose` 自动解包 ref，故 `layer` 为 `T | null`（非 ShallowRef）。
 * 6 个图层组件共享此模型：VectorLayer / TileLayer / VectorTileLayer / GroupGLLayer / GLTFLayer。
 *
 * @example
 * const vec = ref<MaptalksVectorLayerExposed | null>(null)
 * vec.value?.layer?.setOpacity(0.5)
 *
 * @template T - 图层具体类型，默认 MaptalksLayer
 */
export interface MaptalksLayerExposed<T extends MaptalksLayer = MaptalksLayer> {
  /** 图层原生实例（defineExpose 自动解包 ShallowRef），创建前为 null */
  layer: T | null;
  /** 显示图层 */
  show: () => void;
  /** 隐藏图层 */
  hide: () => void;
}

/** MaptalksVectorLayer 组件 defineExpose 暴露 */
export type MaptalksVectorLayerExposed = MaptalksLayerExposed<MaptalksVectorLayer>;

/** MaptalksTileLayer 组件 defineExpose 暴露 */
export type MaptalksTileLayerExposed = MaptalksLayerExposed<MaptalksLayer>;

/** MaptalksVectorTileLayer 组件 defineExpose 暴露 */
export type MaptalksVectorTileLayerExposed = MaptalksLayerExposed<MaptalksLayer>;

/** MaptalksGroupGLLayer 组件 defineExpose 暴露 */
export type MaptalksGroupGLLayerExposed = MaptalksLayerExposed<MaptalksLayer>;

/** MaptalksGLTFLayer 组件 defineExpose 暴露 */
export type MaptalksGLTFLayerExposed = MaptalksLayerExposed<MaptalksLayer>;

/** MaptalksWMSLayer 组件 defineExpose 暴露 */
export type MaptalksWMSLayerExposed = MaptalksLayerExposed<MaptalksLayer>;

/**
 * MaptalksInfoWindow 组件 defineExpose 暴露的类型。
 *
 * @description `show(coord?)` 可传坐标，`hide()` 隐藏，`infoWindow` 为原生实例。
 *
 * @example
 * const iw = ref<MaptalksInfoWindowExposed | null>(null)
 * iw.value?.show([121, 31])
 */
export interface MaptalksInfoWindowExposed {
  /** InfoWindow 原生实例（defineExpose 自动解包 ShallowRef） */
  infoWindow: MaptalksInfoWindow | null;
  /** 显示信息框（可选传坐标） */
  show: (coord?: unknown) => void;
  /** 隐藏信息框 */
  hide: () => void;
}

/**
 * MaptalksUIMarker 组件 defineExpose 暴露的类型。
 *
 * @description 与其他 UI 层一致：实例 + show/hide 命令。
 *
 * @example
 * const uim = ref<MaptalksUIMarkerExposed | null>(null)
 * uim.value?.show()
 */
export interface MaptalksUIMarkerExposed {
  /** UIMarker 原生实例（defineExpose 自动解包 ShallowRef） */
  uiMarker: MaptalksUIMarker | null;
  /** 显示标注 */
  show: () => void;
  /** 隐藏标注 */
  hide: () => void;
}

/**
 * MaptalksMarkerInfoWindow 组件 defineExpose 暴露的类型。
 *
 * @description Marker 级信息框仅暴露 show/hide，实例由父 Marker 管理。
 *
 * @example
 * const miw = ref<MaptalksMarkerInfoWindowExposed | null>(null)
 * miw.value?.show()
 */
export interface MaptalksMarkerInfoWindowExposed {
  /** 显示信息框 */
  show: () => void;
  /** 隐藏信息框 */
  hide: () => void;
}

/**
 * MaptalksMap 组件 defineExpose 暴露的类型。
 *
 * @description map / isReady / error 三个 ref 在 defineExpose 中自动解包。
 *
 * @example
 * const mc = ref<MaptalksMapExposed | null>(null)
 * console.log(mc.value?.isReady)
 */
export interface MaptalksMapExposed {
  /** 地图原生实例（defineExpose 自动解包 ShallowRef），创建前为 null */
  map: MaptalksMap | null;
  /** 地图是否已就绪 */
  isReady: boolean;
  /** 创建阶段的错误信息，无错误时为 null */
  error: string | null;
}
