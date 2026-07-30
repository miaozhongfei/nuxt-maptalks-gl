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
import { inject, watch } from 'vue'

import { useMaptalksDrawTool } from '../composables/useMaptalksDrawTool'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{
  /** 初始绘制模式，默认 'Point' */
  mode?: string
  /** 透传给 DrawTool 构造器的额外选项 */
  options?: Record<string, unknown>
}>()

const emit = defineEmits<{ drawend: [geometry: unknown] }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDrawTool 必须在 MaptalksMap 内使用')

const { tool, enabled, mode: currentMode, result, enable, disable, setMode } = useMaptalksDrawTool(map, {
  mode: props.mode ?? 'Point',
  options: props.options,
})

watch(result, (geo) => { if (geo) emit('drawend', geo) })

/** 暴露 tool 实例与控制方法，供 template ref 访问 */
defineExpose({ tool, enabled, mode: currentMode, enable, disable, setMode })
</script>
