<template><slot /></template>

<script setup lang="ts">
import { inject, provide } from 'vue'

import { useMaptalksMarker } from '../composables/presets/useMaptalksMarker'
import { GEOMETRY_LAYER_KEY, MARKER_GEOMETRY_KEY } from '../core/map-context'
import type { MaptalksMarkerCombinedOptions, MarkerCoordinates } from '../types'

const props = withDefaults(
  defineProps<{
    coordinates: MarkerCoordinates
    symbol?: Record<string, unknown>
    properties?: Record<string, unknown>
    id?: string
    autoDispose?: boolean
    options?: MaptalksMarkerCombinedOptions
  }>(),
  { autoDispose: true, options: undefined },
)

const emit = defineEmits<{
  click: [e: unknown]
  dblclick: [e: unknown]
  mouseenter: [e: unknown]
  mouseout: [e: unknown]
}>()

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksMarker 必须在 MaptalksVectorLayer 内使用')
const { geometry } = useMaptalksMarker(layer, {
  ...props.options,
  coordinates: () => props.coordinates,
  symbol: () => props.symbol,
  properties: () => props.properties,
  id: props.id,
  autoDispose: props.autoDispose,
  events: {
    click: (e) => emit('click', e),
    dblclick: (e) => emit('dblclick', e),
    mouseenter: (e) => emit('mouseenter', e),
    mouseout: (e) => emit('mouseout', e),
  },
})
// 向子组件（如 MaptalksMarkerInfoWindow）提供 geometry 引用
provide(MARKER_GEOMETRY_KEY, geometry)
</script>
