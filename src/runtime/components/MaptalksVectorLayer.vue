<template><slot /></template>

<script setup lang="ts">
import { inject, provide, watch } from 'vue'
import type { ShallowRef } from 'vue'

import { useMaptalksVectorLayer } from '../composables/presets/useMaptalksVectorLayer'
import { GEOMETRY_LAYER_KEY, MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksVectorLayerCombinedOptions, MaptalksVectorLayer } from '../types'

const props = withDefaults(
  defineProps<{
    id?: string
    options?: MaptalksVectorLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksVectorLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksVectorLayer(map, {
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

// 把 VectorLayer 引用 provide 给子几何组件
// useMaptalksVectorLayer 返回 ShallowRef<MaptalksLayer | null>，但此处实例确为 VectorLayer
provide(GEOMETRY_LAYER_KEY, layer as ShallowRef<MaptalksVectorLayer | null>)

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
