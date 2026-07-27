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
    source?: string | MaptalksSource
    id?: string
    options?: MaptalksTileLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
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
