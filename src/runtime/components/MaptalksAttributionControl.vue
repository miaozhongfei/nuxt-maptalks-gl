<template><!-- maptalks attribution control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 版权归属控件组件。
 *
 * @description 对 `useMaptalksAttribution` 的声明式封装。在地图上添加版权/归属信息指示器，
 * 支持 `:options` 透传位置、内容等配置。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksAttributionControl :options="{ position: 'bottom-right', content: 'Powered by maptalks' }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksAttribution } from '../composables/useMaptalksAttribution'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()
/** 版权归属控件配置（position / content 等） */

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksAttributionControl 必须在 MaptalksMap 内使用')
const { control, remove } = useMaptalksAttribution(map, () => props.options)
defineExpose({ control, remove })
</script>
