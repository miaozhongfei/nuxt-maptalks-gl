<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * 几何体级信息窗组件（GeometryInfoWindow，内联于 Marker/几何体 的弹窗）。
 *
 * @description 对 `useMaptalksGeometryInfoWindow` 的声明式封装。在父级几何体组件（如 MaptalksMarker）上注册 setInfoWindow，
 * 通过 `<slot />` 传入 Vue 组件内容（自动 createApp mount 保留响应式）。几何体级信息窗只属于该几何体——
 * 点击自动弹出、点击别处自动关闭。支持响应式 options、事件绑定、`defineExpose({ infoWindow, show, hide })` 程序式控制。
 * 父组件更新时重新挂载 slot 内容（弹框可见时跳过，避免输入中断）。必须在提供 GEOMETRY_KEY 的几何体组件内使用。
 *
 * @example
 * ```vue
 * <MaptalksMarker :coordinates="[121,31]">
 *   <MaptalksGeometryInfoWindow :options="{ title: '站点', custom: true }">
 *     <div class="iw-content"><strong>站点详情</strong></div>
 *   </MaptalksGeometryInfoWindow>
 * </MaptalksMarker>
 * ```
 */
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksGeometryInfoWindow } from '../composables/useMaptalksGeometryInfoWindow'
import type { UseMaptalksGeometryInfoWindowOpts } from '../composables/useMaptalksGeometryInfoWindow'
import { GEOMETRY_KEY } from '../core/map-context'
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

const geometry = inject(GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksGeometryInfoWindow 必须在提供 GEOMETRY_KEY 的几何体组件内使用')

const slots = defineSlots()
let skipNextUpdate = false
let slotApp: App | null = null

// dequal 深比较防内联字面量每次渲染触发 composable 重建
const stableOpts = ref<Record<string, unknown> | undefined>(undefined)

watch(
  () => props.options,
  (o) => {
    if (dequal(o, stableOpts.value)) return;
    if (!o) { stableOpts.value = undefined; return; }
    const filtered: Record<string, unknown> = { ...o }
    for (const k of Object.keys(filtered)) {
      if (filtered[k] === undefined) delete filtered[k]
    }
    stableOpts.value = Object.keys(filtered).length > 0 ? filtered : undefined
  },
  { immediate: true },
)

const iwOpts: UseMaptalksGeometryInfoWindowOpts = {
  options: () => stableOpts.value,
  events: props.events,
  autoDispose: props.autoDispose,
}

const { infoWindow, show, hide } = useMaptalksGeometryInfoWindow(geometry, iwOpts)

/** 创建 Vue 子应用 mount 到临时 DOM，将完整 DOM（含事件）注入 InfoWindow.setContent */
function mountSlotContent() {
  const iw = infoWindow.value;
  if (!iw || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  iw.setContent(mountEl);
}

// 原生 InfoWindow 实例就绪后挂载 slot 内容（geometry 就绪 → setInfoWindow → composable 同步实例 ref）
watch(() => infoWindow.value, (v) => { if (v) mountSlotContent(); }, { immediate: true })

// 父组件更新时重新 mount（show() 触发的更新跳过，避免打断动画）
// 弹框可见时跳过重挂载——避免 slot 内输入/交互（v-model 等）触发重建导致弹框中断
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  if (infoWindow.value?.isVisible?.()) return;
  mountSlotContent();
})

// show 由外部 template ref 调用——前置 skipNextUpdate，下次父级重渲染时跳过重挂载（防动画打断）
const showExposed = (): void => {
  skipNextUpdate = true;
  show();
}

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

/** 暴露原生 InfoWindow 实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ infoWindow, show: showExposed, hide })
</script>
