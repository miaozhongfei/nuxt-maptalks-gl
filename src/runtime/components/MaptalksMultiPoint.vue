<template><!-- maptalks multipoint · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksMultiPoint } from '../composables/presets/useMaptalksMultiPoint'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksMultiPointCombinedOptions, MultiPointCoordinates } from '../types'

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: MultiPointCoordinates
    /** 几何图形唯一标识 */
    id?: string
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksMultiPointCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksMultiPoint 必须在 MaptalksVectorLayer 内使用')
useMaptalksMultiPoint(layer, {
  coordinates: () => props.coordinates,
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
