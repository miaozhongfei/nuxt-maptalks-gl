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
    coordinates?: unknown
    geometry?: unknown
    visible?: boolean
    options?: Record<string, unknown>
  }>(),
  { visible: true, options: undefined },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates ?? props.geometry
const contentHost = ref<HTMLElement | null>(null)
let skipNextUpdate = false

// JSON 深比防内联字面量每次渲染触发 composable 重建
const stableOpts = ref<Record<string, unknown> | undefined>(undefined)
let prevJson: string | undefined

watch(
  () => props.options,
  (o) => {
    const json = JSON.stringify(o ?? null)
    if (json === prevJson) return;
    prevJson = json
    if (!o) { stableOpts.value = undefined; return; }
    const filtered: Record<string, unknown> = { ...o }
    for (const k of Object.keys(filtered)) {
      if (filtered[k] === undefined) delete filtered[k]
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

// infoWindow + contentHost 双就绪时 setContent(innerHTML)
watch(
  [() => infoWindow.value, contentHost],
  ([iw, host]) => {
    if (iw && host) iw.setContent(host.innerHTML)
  },
)

// 父组件数据变化时复制更新的 slot 内容，show() 后仍同步（content 保证最新，RAF 保证 show 在下一帧不会被打断）
onUpdated(() => {
  const iw = infoWindow.value
  const host = contentHost.value
  if (iw && host) iw.setContent(host.innerHTML)
  if (skipNextUpdate) skipNextUpdate = false
})

// 合并 visible + coordinates 为单个 watcher，用 prevVisible 追踪避免坐标变化触发误 hide
let prevVisible = props.visible;
watch(
  [() => props.visible, () => props.coordinates ?? props.geometry],
  ([v, c]) => {
    if (!infoWindow.value) return;
    const visibleChanged = v !== prevVisible;
    prevVisible = v;
    if (v && c !== undefined) { skipNextUpdate = true; show(c); }
    else if (!v && visibleChanged) hide();
  },
  { immediate: true },
)

defineExpose({ infoWindow, show, hide })
</script>
