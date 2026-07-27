<template><!-- maptalks tile layer · 纯逻辑组件 --></template>

<script setup lang="ts">
/**
 * 栅格瓦片图层组件（TileLayer）。
 *
 * @description 对 `useMaptalksTileLayer` 的声明式封装。支持命名源或内联 urlTemplate，
 * 自动解析数据源并创建 TileLayer。支持 `:visible` 声明式显隐、`:events` 原生事件绑定、
 * `defineExpose({ layer, show, hide })` 程序式控制。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksTileLayer source="osm" :visible="showBase" />
 * <MaptalksTileLayer :options="{ urlTemplate: 'https://.../{z}/{x}/{y}.png' }" />
 * ```
 */
import { inject, watch } from 'vue'

import { useMaptalksTileLayer } from '../composables/presets/useMaptalksTileLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksTileLayerCombinedOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    /** 数据源：源名（字符串，按配置解析）或内联源对象 */
    source?: string | MaptalksSource
    /** 图层 id，缺省自动生成 */
    id?: string
    /** 透传给 TileLayer 构造器的选项 */
    options?: MaptalksTileLayerCombinedOptions
    /** 组件销毁时自动移除图层，默认 true */
    autoDispose?: boolean
    /** 是否可见，默认 true */
    visible?: boolean
    /** 事件名 → 处理器（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksTileLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksTileLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
