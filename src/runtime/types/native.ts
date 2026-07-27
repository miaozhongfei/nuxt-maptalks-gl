/**
 * 从用户安装的 maptalks-gl 版本推导的原生构造选项类型。
 * 所有类型均通过 ConstructorParameters 从运行时构造函数自动推导，与安装版本保持同步。
 */

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

/**
 * 从用户安装的 maptalks-gl 版本推导的 Map 构造选项类型（全部 76 字段）。
 *
 * @description 用 `ConstructorParameters<typeof Map>[1]` 提取构造函数第二个参数的类型，
 * 与安装的 maptalks-gl 版本保持同步，IDE 可提示所有选项字段。
 */
export type MaptalksNativeMapOptions = ConstructorParameters<typeof _MaptalksMapClass>[1]

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
 * 从 maptalks-gl 推导的 TileLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof TileLayer>[1]`，IDE 可提示 urlTemplate / opacity / zIndex 等所有字段。
 */
export type MaptalksNativeTileLayerOptions = ConstructorParameters<typeof TileLayer>[1]

/**
 * 从 maptalks-gl 推导的 VectorTileLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof VectorTileLayer>[1]`。
 */
export type MaptalksNativeVectorTileLayerOptions = ConstructorParameters<typeof VectorTileLayer>[1]

/**
 * 从 maptalks-gl 推导的 GLTFLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof GLTFLayer>[1]`。
 */
export type MaptalksNativeGLTFLayerOptions = ConstructorParameters<typeof GLTFLayer>[1]

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
 * 从 maptalks-gl 推导的 VectorLayer 构造选项类型。
 *
 * @description `ConstructorParameters<typeof VectorLayer>[2]`（第三个参数，geometries 之后）。
 */
export type MaptalksNativeVectorLayerOptions = ConstructorParameters<typeof VectorLayer>[2]

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
 * 从 maptalks-gl 推导的 AreaTool 构造选项类型。
 *
 * @description `ConstructorParameters<typeof AreaTool>[0]`。
 */
export type MaptalksNativeAreaToolOptions = ConstructorParameters<typeof AreaTool>[0]

/**
 * 从用户安装的 maptalks-gl 版本推导的几何构造选项类型。
 *
 * @description 用 `ConstructorParameters<typeof Marker>[1]` 提取构造函数第二个参数的类型
 * （所有几何共享同一个 GeometryOptionsType 基类），与安装的 maptalks-gl 版本保持同步，
 * IDE 可提示全部原生几何字段。
 */
export type MaptalksNativeGeometryOptions = ConstructorParameters<typeof _MarkerClass>[1]

/**
 * 从用户安装的 maptalks-gl 版本推导的 UIMarker 构造选项类型。
 *
 * @description 用 `ConstructorParameters<typeof ui.UIMarker>[1]` 提取构造函数第二个参数的类型
 * （`ui.UIMarker` 构造器签名 `(coordinate, options)`），与安装的 maptalks-gl 版本保持同步，
 * IDE 可提示全部原生字段。
 */
export type MaptalksNativeUIMarkerOptions = ConstructorParameters<typeof ui.UIMarker>[1]
