import type { InjectionKey, ShallowRef } from 'vue'
import type { MaptalksMap, MaptalksVectorLayer } from '../types'

// 声明式组件层的 provide/inject 键：
// MaptalksMap provide(map) → 任何 Maptalks* 图层子组件 inject(map)
export const MAP_KEY: InjectionKey<ShallowRef<MaptalksMap | null>> = Symbol('maptalksMap')

// MaptalksVectorLayer provide(layer) → 几何子组件（Marker/LineString/Polygon）inject(layer)
export const GEOMETRY_LAYER_KEY: InjectionKey<ShallowRef<MaptalksVectorLayer | null>> = Symbol('maptalksVectorLayer')
