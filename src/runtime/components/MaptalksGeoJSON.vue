<template><!-- maptalks geojson · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksGeoJSON } from '../composables/useMaptalksGeoJSON'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { GeoJSONData } from '../types'

const props = withDefaults(
  defineProps<{
    data: GeoJSONData
    symbol?: Record<string, unknown>
    autoDispose?: boolean
  }>(),
  { autoDispose: true },
)

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksGeoJSON 必须在 MaptalksVectorLayer 内使用')
useMaptalksGeoJSON(layer, {
  data: () => props.data,
  symbol: () => props.symbol,
  autoDispose: props.autoDispose,
});
</script>
