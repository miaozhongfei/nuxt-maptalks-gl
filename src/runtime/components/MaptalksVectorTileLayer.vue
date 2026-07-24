<template><!-- maptalks vector tile layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksVectorTileLayer } from '../composables/presets/useMaptalksVectorTileLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksVectorTileLayerCombinedOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource
    id?: string
    options?: MaptalksVectorTileLayerCombinedOptions
    autoDispose?: boolean
  }>(),
  { options: () => ({}), autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksVectorTileLayer 必须在 MaptalksMap 内使用')
useMaptalksVectorTileLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
});
</script>
