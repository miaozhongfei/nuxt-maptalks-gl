<template><!-- maptalks panel control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 面板控件组件。
 *
 * @description 对 `useMaptalksPanel` 的声明式封装。在地图上添加可拖拽/带关闭按钮的面板，
 * 支持 `:options` 透传位置、内容等配置，`:events` 绑定控件事件（add / remove / positionchange / close / contentchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksPanelControl :options="{ position: 'top-right', content: '面板内容', closeButton: true }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksPanel } from '../composables/useMaptalksPanel'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksPanelOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Panel` 构造器的选项（含中文字段注释，详见 MaptalksPanelOptions） */
    options?: MaptalksPanelOptions
    /** 控件事件名 → 处理器（自动 on/off，add / remove / positionchange / close / contentchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksPanelControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksPanel(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
