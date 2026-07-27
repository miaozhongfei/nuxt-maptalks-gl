<template><!-- maptalks group gl layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject, watch } from 'vue'

import { useMaptalksGroupGLLayer } from '../composables/presets/useMaptalksGroupGLLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksLayer, MaptalksGroupGLLayerCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    id?: string
    layers?: MaptalksLayer[]
    options?: MaptalksGroupGLLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { layers: () => [], options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGroupGLLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksGroupGLLayer(map, {
  id: props.id,
  layers: props.layers,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

watch(() => props.visible, (v) => { if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
