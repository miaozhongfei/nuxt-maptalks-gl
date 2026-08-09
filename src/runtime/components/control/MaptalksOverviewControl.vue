<template><!-- maptalks overview control · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 鹰眼控件组件。
 *
 * @description 对 `useMaptalksOverview` 的声明式封装。在地图上添加鹰眼小地图（内嵌全局视野预览 + 展开/收起按钮），
 * 支持 `:options` 透传位置、尺寸等配置，`:events` 绑定控件事件（add / remove / positionchange），
 * `:autoDispose` 控制销毁时是否自动移除。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksOverviewControl :options="{ position: 'bottom-right', size: [150, 110], maximize: true }" />
 * ```
 */
import { inject } from 'vue'

import { useMaptalksOverview } from '../../composables/control/useMaptalksOverview'
import { MAP_KEY } from '../../core/map-context'
import type { MaptalksEventHandler, MaptalksOverviewOptions } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Overview` 构造器的选项（含中文字段注释，详见 MaptalksOverviewOptions） */
    options?: MaptalksOverviewOptions
    /** 控件事件名 → 处理器（自动 on/off，add / remove / positionchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksOverviewControl 必须在 MaptalksMap 内使用')
const { control, show, hide, remove } = useMaptalksOverview(map, {
  options: () => props.options,
  events: props.events,
  autoDispose: props.autoDispose,
})
defineExpose({ control, show, hide, remove })
</script>
