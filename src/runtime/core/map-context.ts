import type { InjectionKey, ShallowRef } from 'vue'
import type { MaptalksGeometry, MaptalksMap, MaptalksVectorLayer } from '../types'

// 声明式组件的 provide/inject 通道
// MaptalksMap provide(map) → 任何 Maptalks* 图层/控件 inject(map)
export const MAP_KEY: InjectionKey<ShallowRef<MaptalksMap | null>> = Symbol('maptalksMap')

// MaptalksVectorLayer provide(layer) → 几何组件（Marker/LineString/Polygon）inject(layer)
export const GEOMETRY_LAYER_KEY: InjectionKey<ShallowRef<MaptalksVectorLayer | null>> = Symbol('maptalksVectorLayer')

// MaptalksMarker provide(geometry) → MaptalksGeometryInfoWindow inject(geometry)
export const GEOMETRY_KEY: InjectionKey<ShallowRef<MaptalksGeometry | null>> = Symbol('maptalksGeometry')
