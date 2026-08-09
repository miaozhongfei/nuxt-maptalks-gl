<template><!-- maptalks textbox · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 文本框几何组件（TextBox）。
 *
 * @description 对 `useMaptalksTextBox` 的声明式封装。在父级 MaptalksVectorLayer 内创建 TextBox，
 * 在指定坐标 + 宽高范围内显示自动换行文本。支持响应式文本内容/坐标/宽高、symbol 样式、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksTextBox content="详细介绍文本" :coordinates="[121,31]" :width="200" :height="80" :options="{ symbol: { textSize: 12 } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksTextBox } from '../../composables/geometry/useMaptalksTextBox'
import { GEOMETRY_LAYER_KEY } from '../../core/map-context'
import type { MaptalksTextBoxOptions, MaptalksEventHandler } from '../../types'

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
    /** 几何图形唯一标识 */
    id?: string | number
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksTextBoxOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksTextBox 必须在 MaptalksVectorLayer 内使用')
const { geometry, show, hide, remove } = useMaptalksTextBox(layer, {
  content: () => props.content,
  coordinates: () => props.coordinates,
  width: () => props.width,
  height: () => props.height,
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
