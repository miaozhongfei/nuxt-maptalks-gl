<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksUIMarker } from '../composables/useMaptalksUIMarker'
import type { UseMaptalksUIMarkerOptions } from '../composables/useMaptalksUIMarker'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksUIMarkerCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** UIMarker 坐标 */
    coordinates?: [number, number]
    /** 是否可见，默认 true */
    visible?: boolean
    /** 透传给 UIMarker 构造器的选项（含中文字段注释，详见 MaptalksUIMarkerOptions） */
    options?: MaptalksUIMarkerCombinedOptions
    /** 事件名 → 处理器（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除 UIMarker，默认 true */
    autoDispose?: boolean
  }>(),
  { visible: true, options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksUIMarker 必须在 MaptalksMap 内使用')

const slots = defineSlots()
let skipNextUpdate = false
let slotApp: App | null = null

// dequal 深比较防止内联字面量每次渲染触发 composable 重建
const stableOpts = ref<MaptalksUIMarkerCombinedOptions | undefined>(undefined)
let prevRaw: MaptalksUIMarkerCombinedOptions | undefined

watch(
  () => props.options,
  (o) => {
    // 用原始 options（无注入 coordinates）比较，避免每次重渲染都触发重建
    if (dequal(o, prevRaw)) return;
    prevRaw = o;
    if (!o) { stableOpts.value = undefined; return; }
    const filtered: Record<string, unknown> = { ...o }
    for (const k of Object.keys(filtered)) {
      if (filtered[k] === undefined) delete filtered[k]
    }
    // 将 coordinates 注入 options 供 composable 取用
    filtered.coordinates = props.coordinates;
    stableOpts.value = filtered as MaptalksUIMarkerCombinedOptions
  },
  { immediate: true },
)

const uimOpts: UseMaptalksUIMarkerOptions = {
  options: () => stableOpts.value,
  events: props.events,
  autoDispose: props.autoDispose,
}

const { uiMarker, show, hide } = useMaptalksUIMarker(map, uimOpts)

/** 创建 Vue 子应用 mount 到临时 DOM，将完整 DOM（含事件）注入 UIMarker.setContent */
function mountSlotContent() {
  if (!uiMarker.value || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  uiMarker.value.setContent(mountEl);
}

// UIMarker 实例就绪后挂载 slot 内容并补初始 visible 状态
watch(() => uiMarker.value, (v) => {
  if (!v) return;
  mountSlotContent();
  if (props.visible && props.coordinates) {
    v.setCoordinates(props.coordinates);
    skipNextUpdate = true; show();
  } else if (!props.visible) {
    // composable 无条件 show，此处按 visible 状态补 hide
    v.hide();
  }
}, { immediate: true })

// 父组件更新时重新 mount（show() 触发的更新跳过）
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  mountSlotContent();
})

// 合并 visible + coordinates 为单个 watcher
let prevVisible: boolean | undefined;
watch(
  [() => props.visible, () => props.coordinates],
  ([v, c]) => {
    if (!uiMarker.value) return;
    const visibleChanged = v !== prevVisible;
    prevVisible = v;
    if (v) {
      if (c) uiMarker.value.setCoordinates(c);
      skipNextUpdate = true; show();
    }
    else if (!v && visibleChanged) hide();
  },
  { immediate: true },
)

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

defineExpose({ uiMarker, show, hide })
</script>
