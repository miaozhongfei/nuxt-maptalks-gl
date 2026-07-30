<template><!-- maptalks label · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 文本标注几何组件（Label）。
 *
 * @description 对 `useMaptalksLabel` 的声明式封装。在父级 MaptalksVectorLayer 内创建 Label，
 * 在指定坐标显示文本。支持响应式文本内容/坐标、textSymbol 样式（字号/颜色/对齐等）、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksLabel content="广州市" :coordinates="[113.27,23.13]" :options="{ textSymbol: { textSize: 16, textFill: '#333' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksLabel } from '../composables/presets/useMaptalksLabel'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksLabelOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(
  defineProps<{
    /** 文本内容 */
    content: string
    /** 标注坐标 */
    coordinates: [number, number]
    /** 几何图形唯一标识 */
    id?: string | number
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / textSymbol / draggable 等所有原生字段） */
    options?: MaptalksLabelOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksLabel 必须在 MaptalksVectorLayer 内使用')

const { geometry, show, hide, remove } = useMaptalksLabel(layer, {
  content: () => props.content,
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
});
defineExpose({ geometry, show, hide, remove })
</script>
