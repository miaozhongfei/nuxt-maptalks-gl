<template><!-- maptalks area tool · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksAreaTool } from '../composables/useMaptalksAreaTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksNativeAreaToolOptions } from '../types'

const props = defineProps<{
  options?: Partial<MaptalksNativeAreaToolOptions> & Record<string, unknown>
  events?: Record<string, (event: unknown) => void>
}>()

const emit = defineEmits<{
  measure: [event: unknown]
  click: [event: unknown]
}>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksAreaTool 必须在 MaptalksMap 内使用')

const allEvents: Record<string, (event: unknown) => void> = { ...props.events }
const origMeasure = allEvents['measure']
const origClick = allEvents['click']
allEvents['measure'] = (e: unknown) => {
  origMeasure?.(e)
  emit('measure', e)
}
allEvents['click'] = (e: unknown) => {
  origClick?.(e)
  emit('click', e)
}

useMaptalksAreaTool(map, { options: () => props.options, events: allEvents })
</script>
