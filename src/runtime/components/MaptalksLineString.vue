<template><!-- maptalks linestring · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksLineString } from '../composables/presets/useMaptalksLineString'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksLineStringCombinedOptions, LineStringCoordinates } from '../types'

const props = withDefaults(
  defineProps<{
    coordinates: LineStringCoordinates
    symbol?: Record<string, unknown>
    properties?: Record<string, unknown>
    id?: string
    autoDispose?: boolean
    options?: MaptalksLineStringCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksLineString 必须在 MaptalksVectorLayer 内使用')
useMaptalksLineString(layer, {
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
});
</script>
