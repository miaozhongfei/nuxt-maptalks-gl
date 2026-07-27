<template><!-- maptalks tile layer · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject, watch } from 'vue'

import { useMaptalksTileLayer } from '../composables/presets/useMaptalksTileLayer'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksTileLayerCombinedOptions, MaptalksSource } from '../types'

const props = withDefaults(
  defineProps<{
    source?: string | MaptalksSource
    id?: string
    options?: MaptalksTileLayerCombinedOptions
    autoDispose?: boolean
    visible?: boolean
    events?: Record<string, MaptalksEventHandler>
  }>(),
  { options: () => ({}), autoDispose: true, visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksTileLayer 必须在 MaptalksMap 内使用')
const { layer, show, hide } = useMaptalksTileLayer(map, {
  source: props.source,
  id: props.id,
  options: props.options,
  autoDispose: props.autoDispose,
  events: props.events,
})

watch([() => props.visible, layer], ([v, l]) => { if (!l) return; if (v) show(); else hide() }, { immediate: true })

defineExpose({ layer, show, hide })
</script>
