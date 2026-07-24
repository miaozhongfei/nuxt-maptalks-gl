<template><!-- maptalks multilinestring · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksMultiLineString } from '../composables/presets/useMaptalksMultiLineString'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksMultiLineStringCombinedOptions, MultiLineStringCoordinates } from '../types'

const props = withDefaults(
  defineProps<{
    /** 几何图形坐标 */
    coordinates: MultiLineStringCoordinates
    /** 渲染样式（详见 Symbol 类型定义） */
    symbol?: Record<string, unknown>
    /** 自定义属性 */
    properties?: Record<string, unknown>
    /** 几何图形唯一标识 */
    id?: string
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean
    /** 透传给几何构造器的额外选项（含中文字段注释，详见 MaptalksMultiLineStringCombinedOptions） */
    options?: MaptalksMultiLineStringCombinedOptions
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
  ...props.options,
  coordinates: () => props.coordinates,
  symbol: () => props.symbol,
  properties: () => props.properties,
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
