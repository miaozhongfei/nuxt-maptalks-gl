<template><!-- maptalks scale control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 比例尺控件组件。
 *
 * @description 对 `useMaptalksScale` 的声明式封装。在地图角落添加比例尺指示器，
 * 支持 `:options` 透传位置、单位等配置。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksScaleControl :options="{ position: 'bottom-left', metric: true, imperial: false }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksScale } from '../composables/useMaptalksScale'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()
/** 比例尺控件配置（position / metric / imperial 等） */

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksScaleControl 必须在 MaptalksMap 内使用')
const { control, remove } = useMaptalksScale(map, () => props.options)
defineExpose({ control, remove })
</script>
