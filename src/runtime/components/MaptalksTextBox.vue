<template><!-- maptalks textbox · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksTextBox } from '../composables/presets/useMaptalksTextBox'
import { GEOMETRY_LAYER_KEY } from '../core/map-context'
import type { MaptalksTextBoxCombinedOptions } from '../types'
const props = withDefaults(
  defineProps<{
    content: string
    coordinates: [number, number]
    width: number
    height: number
    symbol?: Record<string, unknown>
    properties?: Record<string, unknown>
    id?: string
    autoDispose?: boolean
    options?: MaptalksTextBoxCombinedOptions
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
if (!layer) throw new Error('[nuxt-maptalks-gl] MaptalksTextBox 必须在 MaptalksVectorLayer 内使用')
useMaptalksTextBox(layer, {
  ...props.options,
  content: () => props.content,
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
