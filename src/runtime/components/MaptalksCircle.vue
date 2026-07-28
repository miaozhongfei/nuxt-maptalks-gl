<template><!-- maptalks circle · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 圆形几何组件（Circle）。
 *
 * @description 对 `useMaptalksCircle` 的声明式封装。在父级 MaptalksVectorLayer 内创建 Circle，
 * 以中心点和半径（米）定义。支持响应式坐标/半径、symbol 样式、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksCircle :coordinates="[121,31]" :radius="500" :options="{ symbol: { lineColor: '#f00', polygonFill: '#f008' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksCircle } from '../composables/presets/useMaptalksCircle'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksCircleOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 圆心坐标 */
    coordinates: [number, number]
    /** 半径（米） */
    radius: number
    /** 几何图形唯一标识 */
    id?: string
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksCircleOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksCircle 必须在 MaptalksVectorLayer 内使用')
const { geometry, show, hide, remove } = useMaptalksCircle(layer, {
  coordinates: () => props.coordinates,
  radius: () => props.radius,
  options: () => props.options,
  visible: () => props.visible,
  id: props.id,
  autoDispose: props.autoDispose,
  events: {
    click: (e) => emit('click', e),
    dblclick: (e) => emit('dblclick', e),
    mouseenter: (e) => emit('mouseenter', e),
    mouseout: (e) => emit('mouseout', e),
  },
});
defineExpose({ geometry, show, hide, remove })
</script>
