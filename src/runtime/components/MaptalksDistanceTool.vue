<template><!-- maptalks distance tool · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 距离测量工具组件。
 *
 * @description 对 `useMaptalksDistanceTool` 的声明式封装。启用后用户可在地图上绘制线段测量距离，
 * 测量结果通过 `@measure` 事件返回。支持 `:options` 配置测量符号样式、`:events` 绑定原生事件。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksDistanceTool :options="{ symbol: { lineColor: '#00f' } }" @measure="onMeasure" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksDistanceTool } from '../composables/useMaptalksDistanceTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksDistanceToolOptions } from '../types'

const props = defineProps<{
  /** 距离测量工具配置（symbol 样式等） */
  options?: MaptalksDistanceToolOptions
  /** 原生事件名 → 处理器映射 */
  events?: Record<string, (event: unknown) => void>
}>()

const emit = defineEmits<{
  measure: [event: unknown]
  click: [event: unknown]
}>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDistanceTool 必须在 MaptalksMap 内使用')

const allEvents: Record<string, (event: unknown) => void> = { ...props.events }
const origMeasure = allEvents['measure']
const origClick = allEvents['click']
allEvents['measure'] = (e: unknown) => {
  origMeasure?.(e)
  emit('measure', e)
}
allEvents['click'] = (e: unknown) => {
  origClick?.(e)
  emit('click', e)
}

const { tool, remove } = useMaptalksDistanceTool(map, { options: () => props.options, events: allEvents })
defineExpose({ tool, remove })
</script>
