<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide, ref, shallowRef, watch } from 'vue'
import { loadMaptalks } from '../core/loader'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksMap } from '../types'

const props = withDefaults(defineProps<{
  center?: unknown; zoom?: number; pitch?: number; bearing?: number
  minZoom?: number; maxZoom?: number
  draggable?: boolean; dragPitch?: boolean; dragRotate?: boolean; zoomable?: boolean
  name?: string; options?: Record<string, unknown>
}>(), { options: () => ({}) })

const emit = defineEmits<{ ready: [map: MaptalksMap]; error: [err: MaptalksError] }>()

const el = ref<HTMLElement | null>(null)
const map = shallowRef<MaptalksMap | null>(null)
const isReady = ref(false)

function buildOpts(): Record<string, unknown> {
  const o: Record<string, unknown> = { ...props.options }
  if (props.center !== undefined) o.center = props.center
  if (props.zoom !== undefined) o.zoom = props.zoom
  if (props.pitch !== undefined) o.pitch = props.pitch
  if (props.bearing !== undefined) o.bearing = props.bearing
  if (props.minZoom !== undefined) o.minZoom = props.minZoom
  if (props.maxZoom !== undefined) o.maxZoom = props.maxZoom
  return o
}

onMounted(async () => {
  const dom = el.value; if (!dom) return
  try {
    const mt = await loadMaptalks()
    const m = new mt.Map(dom, buildOpts())
    map.value = m; isReady.value = true; emit('ready', m)
  } catch (e) { emit('error', e as MaptalksError) }
})

onBeforeUnmount(() => { map.value?.remove(); map.value = null })

provide(MAP_KEY, map)
defineExpose({ map, isReady })
</script>
