<template><!-- maptalks textbox · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksTextBox } from '../composables/presets/useMaptalksTextBox'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksTextBoxCombinedOptions } from '../types'
const props = withDefaults(
  defineProps<{
    /** 文本内容 */
    content: string
    /** 文本框坐标 */
    coordinates: [number, number]
    /** 宽度（米） */
    width: number
    /** 高度（米） */
    height: number
    /** 渲染样式（详见 Symbol 类型定义） */
    symbol?: Record<string, unknown>
    /** 自定义属性 */
    properties?: Record<string, unknown>
    /** 几何图形唯一标识 */
    id?: string
    /** 组件销毁时自动移除几何图形，默认 true */
    autoDispose?: boolean
    /** 透传给几何构造器的额外选项（含中文字段注释，详见 MaptalksTextBoxCombinedOptions） */
    options?: MaptalksTextBoxCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksTextBox 必须在 MaptalksVectorLayer 内使用')
useMaptalksTextBox(layer, {
  ...props.options,
  content: () => props.content,
  coordinates: () => props.coordinates,
  width: () => props.width,
  height: () => props.height,
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
