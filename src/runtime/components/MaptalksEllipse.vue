<template><!-- maptalks ellipse · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksEllipse } from '../composables/presets/useMaptalksEllipse'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksEllipseCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 椭圆中心坐标 */
    coordinates: [number, number]
    /** 宽度（米） */
    width: number
    /** 高度（米） */
    height: number
    /** 几何图形唯一标识 */
    id?: string
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksEllipseCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksEllipse 必须在 MaptalksVectorLayer 内使用')
useMaptalksEllipse(layer, {
  coordinates: () => props.coordinates,
  width: () => props.width,
  height: () => props.height,
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
</script>
