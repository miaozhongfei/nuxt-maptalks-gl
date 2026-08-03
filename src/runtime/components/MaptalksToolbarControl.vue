<template><!-- maptalks toolbar control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 工具条控件组件。
 *
 * @description 对 `useMaptalksToolbar` 的声明式封装。在地图上添加工具条控件（按钮列表 + 子菜单），
 * 支持 `:options` 透传位置、方向、按钮项等配置。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksToolbarControl :options="{ position: 'top-right', items: [{ item: '放大' }] }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksToolbar } from '../composables/useMaptalksToolbar'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksToolbarOptions } from '../types'

const props = defineProps<{ options?: MaptalksToolbarOptions }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksToolbarControl 必须在 MaptalksMap 内使用')
const { control, remove } = useMaptalksToolbar(map, () => props.options)
defineExpose({ control, remove })
</script>
