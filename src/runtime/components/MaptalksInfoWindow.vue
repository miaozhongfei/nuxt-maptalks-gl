<template>
  <div ref="contentHost" style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, onUpdated, ref, watch } from 'vue'

import { useMaptalksInfoWindow } from '../composables/useMaptalksInfoWindow'
import type { UseMaptalksInfoWindowOptions } from '../composables/useMaptalksInfoWindow'
import { MAP_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{
    /** InfoWindow 弹出框坐标 */
    coordinates?: unknown
    /** InfoWindow 弹出框坐标（别名，与 coordinates 二选一） */
    geometry?: unknown
    /** 是否可见，默认 true */
    visible?: boolean
    /** 透传给 InfoWindow 构造器的选项 */
    options?: {
      title?: string
      width?: number
      height?: number
      custom?: boolean
      autoPan?: boolean
      single?: boolean
      animation?: string
      autoOpenOn?: string | null
      dx?: number
      dy?: number
      [key: string]: unknown
    }
  }>(),
  { visible: true, options: undefined },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates ?? props.geometry
const contentHost = ref<HTMLElement | null>(null)
let skipNextUpdate = false

// JSON 深比 + 过滤 undefined，防止内联字面量 :options="{ animation:'scale' }" 每次渲染触发 composable 重建
const stableOpts = ref<Record<string, unknown> | undefined>(undefined)
let prevJson: string | undefined

watch(
  () => props.options,
  (o) => {
    const json = JSON.stringify(o ?? null)
    if (json === prevJson) return;
    prevJson = json
    if (!o) { stableOpts.value = undefined; return; }
    const filtered: Record<string, unknown> = {}
    for (const k of Object.keys(o)) {
      const v = (o as Record<string, unknown>)[k]
      if (v !== undefined) filtered[k] = v
    }
    stableOpts.value = Object.keys(filtered).length > 0 ? filtered : undefined
  },
  { immediate: true },
)

const iwOpts: UseMaptalksInfoWindowOptions = {
  options: () => stableOpts.value,
  ...(coord() === undefined ? {} : { coordinates: coord }),
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

// 类比 MaptalksMarkerInfoWindow：infoWindow + contentHost 双就绪时 setContent(innerHTML)
watch(
  [() => infoWindow.value, contentHost],
  ([iw, host]) => {
    if (iw && host) iw.setContent(host.innerHTML)
  },
)

// 父组件数据变化时复制更新的 slot 内容（show() 触发的更新跳过，避免打断动画）
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  const iw = infoWindow.value
  const host = contentHost.value
  if (iw && host) iw.setContent(host.innerHTML)
})

// visible prop → show/hide（immediate 确保初始值也生效）
watch(
  () => props.visible,
  (v) => {
    if (!infoWindow.value) return;
    if (v) {
      skipNextUpdate = true;
      if (coord() !== undefined) infoWindow.value.show(coord());
    } else {
      infoWindow.value.hide();
    }
  },
  { immediate: true },
);

// coordinates/geometry 变化 → 若可见则重新 show 定位
watch(
  () => props.coordinates ?? props.geometry,
  (c) => {
    if (infoWindow.value && props.visible && c !== undefined) {
      skipNextUpdate = true;
      infoWindow.value.show(c);
    }
  },
)

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide })
</script>
