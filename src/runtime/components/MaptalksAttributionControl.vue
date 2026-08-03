<template><!-- maptalks attribution control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 版权归属控件组件。
 *
 * @description 对 `useMaptalksAttribution` 的声明式封装。在地图上添加版权/归属信息指示器，
 * 支持 `:options` 透传位置、内容等配置，`:events` 绑定控件事件（add / remove / positionchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksAttributionControl :options="{ position: 'bottom-right', content: 'Powered by maptalks' }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksAttribution } from '../composables/useMaptalksAttribution'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksAttributionOptions, MaptalksEventHandler } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Attribution` 构造器的选项（含中文字段注释，详见 MaptalksAttributionOptions） */
    options?: MaptalksAttributionOptions
    /** 控件事件名 → 处理器（自动 on/off，仅 add / remove / positionchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksAttributionControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksAttribution(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
