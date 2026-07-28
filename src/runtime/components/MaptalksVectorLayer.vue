<template><slot /></template>

<script setup lang="ts">
/**
 * 矢量图层组件（VectorLayer，承载几何图形）。
 *
 * @description 对 `useMaptalksVectorLayer` 的声明式封装。创建 VectorLayer 并纳管生命周期，
 * 通过 provide/inject 向子几何组件（MaptalksMarker / LineString / Polygon 等）传递图层引用。
 * 支持 `:visible` 声明式显隐、`:events` 原生事件绑定、`defineExpose({ layer, show, hide })` 程序式控制。
 * 必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksMap :center="[121,31]" :zoom="13" base-layer="osm">
 *   <MaptalksVectorLayer id="myLayer" :visible="showGeo" :events="{ click: onLayerClick }">
 *     <MaptalksMarker :coordinates="[121,31]" />
 *   </MaptalksVectorLayer>
 * </MaptalksMap>
 * ```
 */
import { computed, inject, provide, watch } from 'vue'
import type { ShallowRef } from 'vue'

import { useMaptalksVectorLayer } from '../composables/presets/useMaptalksVectorLayer'
import { GEOMETRY_LAYER_KEY, MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksVectorLayerOptions, MaptalksVectorLayer } from '../types'

const props = withDefaults(
  defineProps<{
    /** 图层 id，缺省自动生成 */
    id?: string
    /** 透传给 VectorLayer 构造器的选项 */
    options?: MaptalksVectorLayerOptions
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
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksVectorLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksVectorLayer(map, {
  id: props.id,
  options: computed(() => props.options),
  autoDispose: props.autoDispose,
  events: props.events,
})

// 把 VectorLayer 引用 provide 给子几何组件
// useMaptalksVectorLayer 返回 ShallowRef<MaptalksLayer | null>，但此处实例确为 VectorLayer
provide(GEOMETRY_LAYER_KEY, layer as ShallowRef<MaptalksVectorLayer | null>)

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

/** 暴露 layer 实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ layer, show, hide })
</script>
