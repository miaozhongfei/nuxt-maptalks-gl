<template><!-- maptalks tile layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksTileLayer } from '../composables/presets/useMaptalksTileLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksNativeTileLayerOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource
    id?: string
    options?: Partial<MaptalksNativeTileLayerOptions> & Record<string, unknown>
    autoDispose?: boolean
  }>(),
  { options: () => ({}), autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksTileLayer 必须在 MaptalksMap 内使用')
useMaptalksTileLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
});
</script>
