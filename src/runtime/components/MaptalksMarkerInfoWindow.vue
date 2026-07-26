<template>
  <div />
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, toValue, useSlots, watch } from 'vue'
import type { App } from 'vue'

import { useMaptalksMarkerInfoWindow } from '../composables/useMaptalksMarkerInfoWindow'
import { MARKER_GEOMETRY_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksInfoWindowCombinedOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 marker.setInfoWindow() 的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
    options?: MaptalksInfoWindowCombinedOptions
    /** 事件名 → 处理器（自动 on/off，与 @open / @close 共存） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()
let slotApp: App | null = null

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

const { open, close } = useMaptalksMarkerInfoWindow(geometry, {
  options: () => props.options,
  events: {
    ...props.events,
    open: () => emit('open'),
    close: () => emit('close'),
  },
  autoDispose: props.autoDispose,
})

/** 用 createApp().mount() 渲染 slot 到 detached DOM，保留 Vue 事件/生命周期 */
function mountSlotContent() {
  const iw = (toValue(geometry) as { getInfoWindow?: () => { setContent?: (c: HTMLElement) => void } | null })?.getInfoWindow?.();
  if (!iw || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  iw.setContent?.(mountEl);
}

// geometry 就绪后挂载 slot 内容到 marker InfoWindow
watch(() => toValue(geometry), (g) => { if (g) mountSlotContent(); }, { immediate: true })

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

defineExpose({ open, close })
</script>
