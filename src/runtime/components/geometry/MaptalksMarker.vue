<template><slot /></template>

<script setup lang="ts">
/**
 * 标记点几何组件（Marker）。
 *
 * @description 对 `useMaptalksMarker` 的声明式封装。在父级 MaptalksVectorLayer 内创建 Marker，
 * 支持响应式坐标、symbol 样式、显隐控制。通过 GEOMETRY_LAYER_KEY inject 获取图层引用，
 * 并通过 GEOMETRY_KEY provide 向子组件（如 MaptalksGeometryInfoWindow）传递 geometry 引用。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksMarker :coordinates="[121,31]" :options="{ symbol: { markerType: 'ellipse', markerFill: '#f00' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject, provide } from 'vue'

import { useMaptalksMarker } from '../../composables/geometry/useMaptalksMarker'
import { GEOMETRY_LAYER_KEY, GEOMETRY_KEY } from '../../core/map-context'
import type { MaptalksMarkerOptions, MaptalksEventHandler } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: [number, number]
    /** 几何图形唯一标识 */
    id?: string | number
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksMarkerOptions
    /** 原生事件名 → 处理器映射（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean
  }>(),
  { autoDispose: true, options: undefined },
)

const emit = defineEmits<{
  click: [e: unknown]
  dblclick: [e: unknown]
  mouseenter: [e: unknown]
  mouseout: [e: unknown]
}>()

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksMarker 必须在 MaptalksVectorLayer 内使用')
const { geometry, show, hide, remove } = useMaptalksMarker(layer, {
  coordinates: () => props.coordinates,
  options: () => props.options,
  visible: () => props.visible,
  id: props.id,
  autoDispose: props.autoDispose,
  events: {
    ...props.events,
    click: (e) => emit('click', e),
    dblclick: (e) => emit('dblclick', e),
    mouseenter: (e) => emit('mouseenter', e),
    mouseout: (e) => emit('mouseout', e),
  },
})
// 向子组件（如 MaptalksGeometryInfoWindow）提供 geometry 引用
provide(GEOMETRY_KEY, geometry)
defineExpose({ geometry, show, hide, remove })
</script>
