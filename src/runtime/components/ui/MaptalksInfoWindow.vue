<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * 地图级信息窗组件（InfoWindow）。
 *
 * @description 对 `useMaptalksInfoWindow` 的声明式封装。在指定坐标弹出地图信息窗，
 * 通过 `<slot />` 传入 Vue 组件内容（自动 createApp mount 保留响应式）。支持响应式坐标/显隐/options、事件绑定、
 * `defineExpose({ infoWindow, show, hide })` 程序式控制。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksInfoWindow :coordinates="[121,31]" :visible="showPopup" :options="{ title: '标题', custom: true }">
 *   <div class="content"><h3>Slot 内容</h3><p>支持 Vue 响应式</p></div>
 * </MaptalksInfoWindow>
 * ```
 */
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksInfoWindow } from '../../composables/ui/useMaptalksInfoWindow'
import type { UseMaptalksInfoWindowOpts } from '../../composables/ui/useMaptalksInfoWindow'
import { MAP_KEY } from '../../core/map-context'
import type { MaptalksEventHandler, MaptalksInfoWindowOptions } from '../../types'

const props = withDefaults(
  defineProps<{
    /** InfoWindow 弹出框坐标 */
    coordinates?: [number, number]
    /** 是否可见，默认 true */
    visible?: boolean
    /** 透传给 InfoWindow 构造器的选项（含中文字段注释，详见 MaptalksInfoWindowOptions） */
    options?: MaptalksInfoWindowOptions
    /** 事件名 → 处理器（自动 on/off） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除 InfoWindow，默认 true */
    autoDispose?: boolean
  }>(),
  { visible: true, options: undefined, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates
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

const iwOpts: UseMaptalksInfoWindowOpts = {
  options: () => stableOpts.value,
  events: props.events,
  autoDispose: props.autoDispose,
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

// InfoWindow 实例就绪后挂载 slot 内容并补初始 visible 状态
watch(() => infoWindow.value, (v) => {
  if (!v) return;
  mountSlotContent();
  // 组件初始化时 visible 可能已是 true，但 visible watch immediate 时 infoWindow 尚未创建
  // 此处补检查，确保默认 visible 生效
  if (props.visible && props.coordinates) show(props.coordinates);
}, { immediate: true })

// 父组件更新时重新 mount（show() 触发的更新跳过，避免打断动画）
// 弹框可见时跳过重挂载——避免 slot 内输入/交互（v-model 等）触发重建导致弹框中断
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  if (infoWindow.value?.isVisible?.()) return;
  mountSlotContent();
})

// 合并 visible + coordinates 为单个 watcher，用 prevVisible 追踪避免坐标变化触发误 hide
let prevVisible: boolean | undefined;
watch(
  [() => props.visible, () => props.coordinates],
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

/** 暴露 InfoWindow 原生实例与 show/hide 方法，供 template ref 访问 */
defineExpose({ infoWindow, show, hide })
</script>
