<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { provide, ref, shallowRef, watch } from 'vue'
import { useMaptalks } from '../composables/useMaptalks'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksCoordinate, MaptalksMap, MaptalksMapOptions, MaptalksNativeMapOptions, UseMaptalksOptions } from '../types'

const props = withDefaults(defineProps<{
  center?: [number, number]; zoom?: number
  pitch?: number; bearing?: number
  minZoom?: number; maxZoom?: number
  draggable?: boolean; dragPitch?: boolean; dragRotate?: boolean; zoomable?: boolean
  name?: string; options?: Partial<MaptalksMapOptions> & Partial<MaptalksNativeMapOptions>
  baseLayer?: string | { source?: string; options?: Record<string, unknown> }
}>(), { options: () => ({}) })

const emit = defineEmits<{ ready: [map: MaptalksMap]; error: [err: MaptalksError] }>()

const el = ref<HTMLElement | null>(null)

function buildOpts(): UseMaptalksOptions {
  const o: UseMaptalksOptions = { name: props.name, ...props.options }
  if (props.baseLayer !== undefined) o.baseLayer = props.baseLayer;
  if (props.center !== undefined) o.center = props.center
  if (props.zoom !== undefined) o.zoom = props.zoom
  if (props.pitch !== undefined) o.pitch = props.pitch
  if (props.bearing !== undefined) o.bearing = props.bearing
  if (props.minZoom !== undefined) o.minZoom = props.minZoom
  if (props.maxZoom !== undefined) o.maxZoom = props.maxZoom
  // 交互开关必须写进构造选项：maptalks 使用值的判断需要首次传入，仅靠 watch 在 toggle 场景下可能因异步调度丢失配置回路
  if (props.draggable !== undefined) o.draggable = props.draggable
  if (props.dragPitch !== undefined) o.dragPitch = props.dragPitch
  if (props.dragRotate !== undefined) o.dragRotate = props.dragRotate
  if (props.zoomable !== undefined) o.zoomable = props.zoomable
  return o
}

const { map, isReady, error } = useMaptalks(el, buildOpts())

provide(MAP_KEY, map)
defineExpose({ map, isReady, error })

watch(isReady, (v) => { if (v && map.value) emit('ready', map.value) })
watch(error, (e) => { if (e) emit('error', e) })

// 运行时 prop 同步——每一项独立 watch 避免组合数组在异步调度下丢失变更
watch(
  () => props.minZoom,
  (v) => { if (v !== undefined && map.value) map.value.setMinZoom(v) },
)
watch(
  () => props.maxZoom,
  (v) => { if (v !== undefined && map.value) map.value.setMaxZoom(v) },
)
watch(
  () => props.draggable,
  (v) => { if (v !== undefined && map.value) map.value.config({ draggable: v }) },
)
watch(
  () => props.dragPitch,
  (v) => { if (v !== undefined && map.value) map.value.config({ dragPitch: v }) },
)
watch(
  () => props.dragRotate,
  (v) => { if (v !== undefined && map.value) map.value.config({ dragRotate: v }) },
)
watch(
  () => props.zoomable,
  (v) => { if (v !== undefined && map.value) map.value.config({ zoomable: v }) },
)
</script>
