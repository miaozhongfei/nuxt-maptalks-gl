<template><!-- maptalks compass control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 指南针控件组件。
 *
 * @description 对 `useMaptalksCompass` 的声明式封装。在地图上添加指南针指示器，
 * 支持 `:options` 透传位置、样式等配置。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksCompassControl :options="{ position: 'top-right' }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksCompass } from '../composables/useMaptalksCompass'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()
/** 指南针控件配置（position 等） */

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksCompassControl 必须在 MaptalksMap 内使用')
const { control, remove } = useMaptalksCompass(map, () => props.options)
defineExpose({ control, remove })
</script>
