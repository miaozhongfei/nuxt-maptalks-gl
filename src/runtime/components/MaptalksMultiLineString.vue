<template><!-- maptalks multilinestring · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksMultiLineString } from '../composables/presets/useMaptalksMultiLineString'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksMultiLineStringCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: Array<Array<[number, number]>>
    /** 几何图形唯一标识 */
    id?: string
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksMultiLineStringCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksMultiLineString 必须在 MaptalksVectorLayer 内使用')
useMaptalksMultiLineString(layer, {
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
