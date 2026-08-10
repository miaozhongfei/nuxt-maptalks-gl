<template><!-- maptalks layer-switcher control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 图层选择控件组件。
 *
 * @description 对 `useMaptalksLayerSwitcher` 的声明式封装。在地图上添加图层选择器（hover 展开底图/叠加图层面板），
 * 支持 `:options` 透传位置、分组标题等配置，`:events` 绑定控件事件（add / remove / positionchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksLayerSwitcherControl :options="{ position: 'top-right', baseTitle: '底图', overlayTitle: '图层' }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksLayerSwitcher } from '../../composables/control/useMaptalksLayerSwitcher'
import { MAP_KEY } from '../../core/map-context'
import type { MaptalksEventHandler, MaptalksLayerSwitcherOptions } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.LayerSwitcher` 构造器的选项（含中文字段注释，详见 MaptalksLayerSwitcherOptions） */
    options?: MaptalksLayerSwitcherOptions
    /** 控件事件名 → 处理器（自动 on/off，add / remove / positionchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksLayerSwitcherControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksLayerSwitcher(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
