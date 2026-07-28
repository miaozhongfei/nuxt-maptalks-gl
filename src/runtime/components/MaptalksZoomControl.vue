<template><!-- maptalks zoom control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 缩放控件组件。
 *
 * @description 对 `useMaptalksZoom` 的声明式封装。在地图上添加 +/- 缩放按钮控件，
 * 支持 `:options` 透传位置、样式等配置。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksZoomControl :options="{ position: 'top-left' }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksZoom } from '../composables/useMaptalksZoom'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()
/** 缩放控件配置（position 等） */

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksZoomControl 必须在 MaptalksMap 内使用')
const { control, remove } = useMaptalksZoom(map, () => props.options)
defineExpose({ control, remove })
</script>
