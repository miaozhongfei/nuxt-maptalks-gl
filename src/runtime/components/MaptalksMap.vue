<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, onScopeDispose, provide, ref, shallowRef, watch } from 'vue'
import { loadMaptalks } from '../core/loader'
import { mapRegistry } from '../core/registry'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import { applyMapConfigProps } from '../core/map-props'
import type { MaptalksCoordinate, MaptalksMap, UseMaptalksOptions } from '../types'

const props = withDefaults(defineProps<{
  center?: MaptalksCoordinate | [number, number]; zoom?: number
  pitch?: number; bearing?: number
  minZoom?: number; maxZoom?: number
  draggable?: boolean; dragPitch?: boolean; dragRotate?: boolean; zoomable?: boolean
  name?: string; options?: Record<string, unknown>
}>(), { options: () => ({}) })

const emit = defineEmits<{ ready: [map: MaptalksMap]; error: [err: MaptalksError] }>()

const el = ref<HTMLElement | null>(null)
const map = shallowRef<MaptalksMap | null>(null)
const isReady = ref(false)
const error = ref<MaptalksError | null>(null)

function buildOpts(): Record<string, unknown> {
  const o: Record<string, unknown> = { ...props.options }
  if (props.center !== undefined) o.center = props.center
  if (props.zoom !== undefined) o.zoom = props.zoom
  if (props.pitch !== undefined) o.pitch = props.pitch
  if (props.bearing !== undefined) o.bearing = props.bearing
  if (props.minZoom !== undefined) o.minZoom = props.minZoom
  if (props.maxZoom !== undefined) o.maxZoom = props.maxZoom
  if (props.draggable !== undefined) o.draggable = props.draggable
  if (props.dragPitch !== undefined) o.dragPitch = props.dragPitch
  if (props.dragRotate !== undefined) o.dragRotate = props.dragRotate
  if (props.zoomable !== undefined) o.zoomable = props.zoomable
  return o
}

if (import.meta.client && props.name) mapRegistry.register(props.name, map)

onMounted(async () => {
  const dom = el.value; if (!dom) return
  try {
    const mt = await loadMaptalks()
    const m = new mt.Map(dom, buildOpts())
    map.value = m; isReady.value = true; emit('ready', m)
  } catch (e) { error.value = e as MaptalksError; emit('error', e as MaptalksError) }
})

function destroy() { map.value?.remove(); map.value = null; isReady.value = false }
onBeforeUnmount(destroy); onScopeDispose(destroy)

provide(MAP_KEY, map)
defineExpose({ map, isReady, error })

// 运行时同步 prop
watch(() => [props.minZoom, props.maxZoom, props.draggable, props.dragPitch, props.dragRotate, props.zoomable], () => {
  if (!map.value) return
  applyMapConfigProps(map.value, { minZoom: props.minZoom, maxZoom: props.maxZoom, draggable: props.draggable, dragPitch: props.dragPitch, dragRotate: props.dragRotate, zoomable: props.zoomable })
})
</script>
