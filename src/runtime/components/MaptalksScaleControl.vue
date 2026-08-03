<template><!-- maptalks scale control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 比例尺控件组件。
 *
 * @description 对 `useMaptalksScale` 的声明式封装。在地图上添加比例尺指示器，
 * 支持 `:options` 透传位置、米制/英制等配置，`:events` 绑定控件事件（add / remove / positionchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksScaleControl :options="{ position: 'bottom-left', metric: true }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksScale } from '../composables/useMaptalksScale'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksScaleOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Scale` 构造器的选项（含中文字段注释，详见 MaptalksScaleOptions） */
    options?: MaptalksScaleOptions
    /** 控件事件名 → 处理器（自动 on/off，仅 add / remove / positionchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksScaleControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksScale(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
