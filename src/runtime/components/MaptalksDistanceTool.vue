<template><!-- maptalks distance tool · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksDistanceTool } from '../composables/useMaptalksDistanceTool'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksDistanceToolOptions } from '../types'

const props = defineProps<{
  options?: MaptalksDistanceToolOptions
  events?: Record<string, (event: unknown) => void>
}>()

const emit = defineEmits<{
  measure: [event: unknown]
  click: [event: unknown]
}>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksDistanceTool 必须在 MaptalksMap 内使用')

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

useMaptalksDistanceTool(map, { options: () => props.options, events: allEvents })
</script>
