<template><slot /></template>

<script setup lang="ts">
import { inject, provide } from 'vue'
import type { ShallowRef } from 'vue'

import { useMaptalksVectorLayer } from '../composables/presets/useMaptalksVectorLayer'
import { GEOMETRY_LAYER_KEY, MAP_KEY } from '../core/map-context'
import type { MaptalksNativeVectorLayerOptions, MaptalksVectorLayer } from '../types'

const props = withDefaults(
  defineProps<{
    id?: string
    options?: Partial<MaptalksNativeVectorLayerOptions> & Record<string, unknown>
    autoDispose?: boolean
  }>(),
  { options: () => ({}), autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksVectorLayer 必须在 MaptalksMap 内使用')
const { layer } = useMaptalksVectorLayer(map, {
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
})

// 把 VectorLayer 引用 provide 给子几何组件
// useMaptalksVectorLayer 返回 ShallowRef<MaptalksLayer | null>，但此处实例确为 VectorLayer
provide(GEOMETRY_LAYER_KEY, layer as ShallowRef<MaptalksVectorLayer | null>)
</script>
