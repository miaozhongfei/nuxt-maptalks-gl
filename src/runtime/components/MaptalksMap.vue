<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide, ref, shallowRef, watch } from 'vue'
import { loadMaptalks } from '../core/loader'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksCoordinate, MaptalksMap } from '../types'

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
  return o
}

onMounted(async () => {
  const dom = el.value; if (!dom) return
  try {
    const mt = await loadMaptalks()
    const m = new mt.Map(dom, buildOpts())
    map.value = m; isReady.value = true; emit('ready', m)
  } catch (e) { error.value = e as MaptalksError; emit('error', e as MaptalksError) }
})

function destroy() { map.value?.remove(); map.value = null; isReady.value = false }
onBeforeUnmount(destroy)

provide(MAP_KEY, map)
defineExpose({ map, isReady, error })

// 运行时 prop 同步——setTimeout 避免 Vue 响应式队列内操作 maptalks DOM
watch(
  () => [props.minZoom, props.maxZoom, props.draggable, props.dragPitch, props.dragRotate, props.zoomable] as const,
  () => {
    const m = map.value
    if (!m) return
    setTimeout(() => {
      const mn = props.minZoom; if (mn !== undefined) m.setMinZoom(mn)
      const mx = props.maxZoom; if (mx !== undefined) m.setMaxZoom(mx)
      const conf: Record<string, boolean> = {}
      const d = props.draggable; if (d !== undefined) conf.draggable = d
      const dp = props.dragPitch; if (dp !== undefined) conf.dragPitch = dp
      const dr = props.dragRotate; if (dr !== undefined) conf.dragRotate = dr
      const z = props.zoomable; if (z !== undefined) conf.zoomable = z
      if (Object.keys(conf).length > 0) m.config(conf)
    })
  },
)
</script>
