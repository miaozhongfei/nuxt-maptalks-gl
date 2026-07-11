<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'

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
const slots = defineSlots()
let skipNextUpdate = false
let slotApp: App | null = null

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
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

/** 创建 Vue 子应用 mount 到临时 DOM，将完整 DOM（含事件）注入 InfoWindow.setContent */
function mountSlotContent() {
  if (!infoWindow.value || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  infoWindow.value.setContent(mountEl);
}

// InfoWindow 实例就绪后挂载 slot 内容
watch(() => infoWindow.value, (v) => { if (v) mountSlotContent(); }, { immediate: true })

// 父组件更新时重新 mount（show() 触发的更新跳过，避免打断动画）
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  mountSlotContent();
})

// 合并 visible + coordinates 为单个 watcher，用 prevVisible 追踪避免坐标变化触发误 hide
let prevVisible: boolean | undefined;
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

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

defineExpose({ infoWindow, show, hide })
</script>
