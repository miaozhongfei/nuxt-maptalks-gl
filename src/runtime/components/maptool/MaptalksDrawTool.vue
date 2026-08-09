<template><!-- maptalks draw tool · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 绘制工具组件（DrawTool）。
 *
 * @description 对 `useMaptalksDrawTool` 的声明式封装。启用后用户可在地图上绘制点/线/面/圆/矩形。
 * 支持 `:mode` 初始绘制模式、`:options` 配置绘制样式、`@drawend` 事件获取结果。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksDrawTool ref="dt" mode="Polygon" @drawend="(e) => result = e" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksDrawTool } from '../../composables/maptool/useMaptalksDrawTool'
import { MAP_KEY } from '../../core/map-context'
import type { MaptalksDrawToolOptions, MaptalksEventHandler } from '../../types'

const props = withDefaults(defineProps<{
  /** 初始绘制模式，默认 'Point' */
  mode?: string
  /** 透传给 DrawTool 构造器的选项 */
  options?: MaptalksDrawToolOptions
  /** 组件销毁时自动移除工具，默认 true */
  autoDispose?: boolean
  /** 原生事件名 → 处理器映射 */
  events?: Record<string, MaptalksEventHandler>
}>(), { mode: 'Point', options: () => ({}), autoDispose: true })

const emit = defineEmits<{ drawend: [geometry: unknown] }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDrawTool 必须在 MaptalksMap 内使用')

const { tool, enabled, mode, enable, disable, setMode, remove } = useMaptalksDrawTool(map, {
  mode: props.mode,
  options: () => props.options,
  autoDispose: props.autoDispose,
  events: { ...props.events, drawend: (e) => emit('drawend', e) },
})
defineExpose({ tool, enabled, mode, enable, disable, setMode, remove })
</script>
