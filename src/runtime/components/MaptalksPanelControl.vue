<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * 面板控件组件。
 *
 * @description 对 `useMaptalksPanel` 的声明式封装。在地图上添加可拖拽/带关闭按钮的面板，
 * 支持 `:options` 透传位置、内容等配置，`:visible` 声明式显隐，`:events` 绑定控件事件
 * （add / remove / positionchange / close / contentchange），`:autoDispose` 控制销毁时是否自动移除。
 * 传入 `<slot />` 时优先渲染 Vue 内容（createApp mount 保留响应式，slot 内输入/交互不中断），
 * 无 slot 时使用 `options.content`。必须在 MaptalksMap 内使用。
 *
 * @example
 * ```vue
 * <MaptalksPanelControl :options="{ position: 'top-right', closeButton: true }">
 *   <div class="p-3">面板内容：<b>{{ count }}</b></div>
 * </MaptalksPanelControl>
 * ```
 */
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksPanel } from '../composables/useMaptalksPanel'
import { MAP_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksPanelOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `control.Panel` 构造器的选项（含中文字段注释，详见 MaptalksPanelOptions） */
    options?: MaptalksPanelOptions
    /** 是否可见，默认 true */
    visible?: boolean
    /** 控件事件名 → 处理器（自动 on/off，add / remove / positionchange / close / contentchange） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动移除控件，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, visible: true, autoDispose: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksPanelControl 必须在 MaptalksMap 内使用')

const slots = defineSlots()
// show() 触发的更新标记：下次 onUpdated 时跳过重挂载，避免打断显隐流程
let skipNextUpdate = false
// slot 内容 Vue 子应用实例（重挂载前先 unmount 旧实例）
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

const { control, show, hide, remove } = useMaptalksPanel(map, {
  options: () => stableOpts.value,
  events: props.events,
  autoDispose: props.autoDispose,
})

/** 创建 Vue 子应用 mount 到临时 DOM，经 Panel.setContent 注入（无 slot 时走 options.content） */
function mountSlotContent() {
  const c = control.value;
  if (!c || !slots.default) return;
  if (slotApp) { slotApp.unmount(); slotApp = null; }
  const mountEl = document.createElement('div');
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  c.setContent(mountEl);
}

// 控件实例就绪后挂载 slot 内容并补初始 visible 状态
watch(() => control.value, (v) => {
  if (!v) return;
  mountSlotContent();
  if (!props.visible) hide();
}, { immediate: true })

// 父组件更新时重新 mount（show() 触发的更新跳过，避免打断显隐流程）
// 面板可见时跳过重挂载——避免 slot 内输入/交互（v-model 等）触发重建导致面板中断
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  if (control.value?.isVisible?.()) return;
  mountSlotContent();
})

// visible 变化 → show/hide（skipNextUpdate 跳过下次重挂载）
watch(() => props.visible, (v) => {
  if (!control.value) return;
  skipNextUpdate = true;
  if (v) show(); else hide();
}, { immediate: true })

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null; } })

/** 暴露 Panel 原生实例与 show/hide/remove 方法，供 template ref 访问 */
defineExpose({ control, show, hide, remove })
</script>
