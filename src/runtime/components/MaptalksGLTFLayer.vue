<template><!-- maptalks gltf layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksGLTFLayer } from '../composables/presets/useMaptalksGLTFLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksGLTFLayerCombinedOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource
    id?: string
    options?: MaptalksGLTFLayerCombinedOptions
    autoDispose?: boolean
  }>(),
  { options: () => ({}), autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksGLTFLayer 必须在 MaptalksMap 内使用')
const { show, hide } = useMaptalksGLTFLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
});

defineExpose({ show, hide })
</script>
