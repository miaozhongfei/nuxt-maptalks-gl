<template>
  <div ref="el" style="height: 100%; width: 100%">
    <!-- slot 内容挂 Vue 私有隐藏 div：避免 maptalks 地图容器（el）的 DOM 操作破坏 Vue 占位节点
         （v-if 切换时 patch insertBefore null） -->
    <div style="display: none"><slot /></div>
  </div>
</template>

<script setup lang="ts">
/**
 * 地图根组件——所有地图功能的起点。
 *
 * @description 对 `useMaptalks` 的声明式封装。在页面上渲染地图容器 div，创建 maptalks 地图实例并纳管生命周期。
 * 通过 provide/inject 将地图实例传递给所有子组件；支持声明式中心点、缩放、旋转等 prop 与运行时同步。
 * emit `ready`（地图就绪）和 `error`（加载失败）；expose `map` / `isReady` / `error` 供 template ref 访问。
 *
 * @example
 * ```vue
 * <MaptalksMap ref="mapRef" name="main" :center="[121,31]" :zoom="13" base-layer="osm" @ready="onReady" />
 * ```
 */
import { provide, ref, shallowRef, watch } from 'vue'
import { useMaptalks } from '../composables/useMaptalks'
import type { MaptalksError } from '../core/errors'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksCoordinate, MaptalksMap, MaptalksMapOptions, UseMaptalksOpts } from '../types'

const props = withDefaults(defineProps<{
  /** 地图中心点 [经度, 纬度] */
  center?: [number, number]
  /** 缩放级别 */
  zoom?: number
  /** 俯仰角（度，0=正视） */
  pitch?: number
  /** 旋转角（度，正北为 0） */
  bearing?: number
  /** 最小缩放级别 */
  minZoom?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 是否允许拖拽平移 */
  draggable?: boolean
  /** 是否允许拖拽修改俯仰角 */
  dragPitch?: boolean
  /** 是否允许拖拽修改旋转角 */
  dragRotate?: boolean
  /** 是否允许缩放 */
  zoomable?: boolean
  /** 地图实例名（多地图场景），默认 'default' */
  name?: string
  /** 透传给 maptalks Map 构造器的额外选项 */
  options?: MaptalksMapOptions
  /** 底图：源名（字符串）/ 内联源对象 / 多底图候选数组（自动打包 GroupTileLayer，第一项可见其余隐藏） */
  baseLayer?: string | { source?: string; options?: Record<string, unknown> } | Array<string | { id?: string | number; source?: string; options?: Record<string, unknown> }>
}>(), { options: () => ({}) })

const emit = defineEmits<{ ready: [map: MaptalksMap]; error: [err: MaptalksError] }>()

const el = ref<HTMLElement | null>(null)

function buildOpts(): UseMaptalksOpts {
  const o: UseMaptalksOpts = { name: props.name, ...props.options }
  if (props.baseLayer !== undefined) o.baseLayer = props.baseLayer;
  if (props.center !== undefined) o.center = props.center
  if (props.zoom !== undefined) o.zoom = props.zoom
  if (props.pitch !== undefined) o.pitch = props.pitch
  if (props.bearing !== undefined) o.bearing = props.bearing
  if (props.minZoom !== undefined) o.minZoom = props.minZoom
  if (props.maxZoom !== undefined) o.maxZoom = props.maxZoom
  // 交互开关必须在构造时生效：仅靠下方 watch config 时初始值无变化不会触发（如 8.1 全 false 禁用）
  if (props.draggable !== undefined) o.draggable = props.draggable
  if (props.dragPitch !== undefined) o.dragPitch = props.dragPitch
  if (props.dragRotate !== undefined) o.dragRotate = props.dragRotate
  if (props.zoomable !== undefined) o.zoomable = props.zoomable
  return o
}

const { map, isReady, error } = useMaptalks(el, buildOpts())

provide(MAP_KEY, map)
/** 暴露 map 实例与状态，供 template ref 访问 */
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
