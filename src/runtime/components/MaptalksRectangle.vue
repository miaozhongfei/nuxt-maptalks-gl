<template><!-- maptalks rectangle · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksRectangle } from '../composables/presets/useMaptalksRectangle'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksCoordinate } from '../types'

const props = withDefaults(
  defineProps<{
    coordinates: MaptalksCoordinate | [number, number]
    width: number
    height: number
    symbol?: Record<string, unknown>
    properties?: Record<string, unknown>
    id?: string
    autoDispose?: boolean
  }>(),
  { autoDispose: true },
)

const emit = defineEmits<{
  click: [e: unknown]
  dblclick: [e: unknown]
  mouseenter: [e: unknown]
  mouseout: [e: unknown]
}>()

const layer = inject(GEOMETRY_LAYER_KEY)
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksRectangle 必须在 MaptalksVectorLayer 内使用')
useMaptalksRectangle(layer, {
  coordinates: () => props.coordinates,
  width: () => props.width,
  height: () => props.height,
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
