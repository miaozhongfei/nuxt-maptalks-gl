<template><!-- maptalks sector · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 扇形几何组件（Sector）。
 *
 * @description 对 `useMaptalksSector` 的声明式封装。在父级 MaptalksVectorLayer 内创建 Sector，
 * 以中心点 + 半径 + 起止角度（度）定义。支持响应式坐标/半径/角度、symbol 样式、显隐控制与事件绑定。纯逻辑组件，不渲染 DOM。
 * 必须在 MaptalksVectorLayer 内使用。
 *
 * @example
 * ```vue
 * <MaptalksVectorLayer>
 *   <MaptalksSector :coordinates="[121,31]" :radius="1000" :start-angle="0" :end-angle="90" :options="{ symbol: { polygonFill: '#0f08' } }" @click="onClick" />
 * </MaptalksVectorLayer>
 * ```
 */
import { inject } from 'vue'

import { useMaptalksSector } from '../composables/presets/useMaptalksSector'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksSectorOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(
  defineProps<{
    /** 扇形圆心坐标 */
    coordinates: [number, number]
    /** 半径（米） */
    radius: number
    /** 起始角度（度） */
    startAngle: number
    /** 结束角度（度） */
    endAngle: number
    /** 几何图形唯一标识 */
    id?: string | number
    /** 是否可见 */
    visible?: boolean
    /** 透传给几何构造器的完整选项（symbol / properties / draggable 等所有原生字段） */
    options?: MaptalksSectorOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksSector 必须在 MaptalksVectorLayer 内使用')
const { geometry, show, hide, remove } = useMaptalksSector(layer, {
  coordinates: () => props.coordinates,
  radius: () => props.radius,
  startAngle: () => props.startAngle,
  endAngle: () => props.endAngle,
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
