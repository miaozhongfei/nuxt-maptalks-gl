<template><!-- maptalks toolbar control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 工具条控件组件。
 *
 * @description 对 `useMaptalksToolbar` 的声明式封装。在地图上添加工具条控件（按钮列表 + 子菜单），
 * 支持 `:options` 透传位置、方向、按钮项等配置，`:events` 绑定控件事件（add / remove / positionchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksToolbarControl
 *   :options="{ position: 'top-right', items: [{ item: '放大' }] }"
 *   :events="{ positionchange: () => console.log('位置变化') }"
 * />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksToolbar } from '../composables/useMaptalksToolbar'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksToolbarOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Toolbar` 构造器的选项（含中文字段注释，详见 MaptalksToolbarOptions） */
    options?: MaptalksToolbarOptions
    /** 控件事件名 → 处理器（自动 on/off，仅 add / remove / positionchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksToolbarControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksToolbar(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
