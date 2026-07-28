<template>
  <div />
</template>

<script setup lang="ts">
/**
 * 标记级信息窗组件（MarkerInfoWindow，内联于 Marker 几何的弹窗）。
 *
 * @description 对 `useMaptalksMarkerInfoWindow` 的声明式封装。在父级 MaptalksMarker 上注册 setInfoWindow，
 * 通过 `<slot />` 传入 Vue 组件内容（自动 createApp mount 保留响应式）。标记级信息窗只属于该 Marker——
 * 点击自动弹出、点击别处自动关闭。支持响应式 options、事件绑定、`defineExpose({ show, hide })` 程序式控制。
 * 必须在 MaptalksMarker 内使用。
 *
 * @example
 * ```vue
 * <MaptalksMarker :coordinates="[121,31]">
 *   <MaptalksMarkerInfoWindow :options="{ title: '站点', custom: true }">
 *     <div class="iw-content"><strong>站点详情</strong></div>
 *   </MaptalksMarkerInfoWindow>
 * </MaptalksMarker>
 * ```
 */
import { createApp, h, inject, onBeforeUnmount, toValue, useSlots, watch } from 'vue'
import type { App } from 'vue'

import { useMaptalksMarkerInfoWindow } from '../composables/useMaptalksMarkerInfoWindow'
import { MARKER_GEOMETRY_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksInfoWindowOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 marker.setInfoWindow() 的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
    options?: MaptalksInfoWindowOptions
    /** 事件名 → 处理器（自动 on/off，与 @open / @close 共存） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, autoDispose: true },
)

const slots = useSlots()
let slotApp: App | null = null

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

const { show, hide } = useMaptalksMarkerInfoWindow(geometry, {
  options: () => props.options,
  events: props.events,
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

/** 暴露 show/hide 方法，供 template ref 访问 */
defineExpose({ show, hide })
</script>
