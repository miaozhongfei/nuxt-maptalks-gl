<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { provide, ref, shallowRef, watch, nextTick } from 'vue'
import { useMaptalks } from '../composables/useMaptalks'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksCoordinate, MaptalksMap, MaptalksMapOptions, MaptalksNativeMapOptions, UseMaptalksOptions } from '../types'

const props = withDefaults(defineProps<{
  center?: MaptalksCoordinate | [number, number]; zoom?: number
  pitch?: number; bearing?: number
  minZoom?: number; maxZoom?: number
  draggable?: boolean; dragPitch?: boolean; dragRotate?: boolean; zoomable?: boolean
  name?: string; options?: Partial<MaptalksMapOptions> & Partial<MaptalksNativeMapOptions>
}>(), { options: () => ({}) })

const emit = defineEmits<{ ready: [map: MaptalksMap]; error: [err: MaptalksError] }>()

const el = ref<HTMLElement | null>(null)

function buildOpts(): UseMaptalksOptions {
  const o: UseMaptalksOptions = { name: props.name, ...props.options }
  if (props.center !== undefined) o.center = props.center
  if (props.zoom !== undefined) o.zoom = props.zoom
  if (props.pitch !== undefined) o.pitch = props.pitch
  if (props.bearing !== undefined) o.bearing = props.bearing
  if (props.minZoom !== undefined) o.minZoom = props.minZoom
  if (props.maxZoom !== undefined) o.maxZoom = props.maxZoom
  return o
}

const { map, isReady, error } = useMaptalks(el, buildOpts())

provide(MAP_KEY, map)
defineExpose({ map, isReady, error })

watch(isReady, (v) => { if (v && map.value) emit('ready', map.value) })
watch(error, (e) => { if (e) emit('error', e) })

// 运行时 prop 同步——nextTick 确保在 Vue DOM 稳定后操作 maptalks
watch(
  () => [props.minZoom, props.maxZoom, props.draggable, props.dragPitch, props.dragRotate, props.zoomable] as const,
  () => {
    const m = map.value
    if (!m) return
    nextTick(() => {
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
