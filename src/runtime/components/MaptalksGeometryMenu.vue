<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * 几何体级右键菜单组件（GeometryMenu）。
 *
 * @description 对 `useMaptalksGeometryMenu` 的声明式封装。通过 `inject(GEOMETRY_KEY)` 获取
 * 父级几何体组件的 geometry 引用。支持两种模式：
 * 1. **标准模式**：`options.items` 数组 → composable 内部调 `menu.setItems(items)`
 * 2. **自定义模式**：`options.custom: true` + `<slot />` → `createApp` 子应用 mount → `menu.setItems(el)`
 *
 * 必须在提供 `GEOMETRY_KEY` 的几何体组件（如 MaptalksMarker）内使用。
 *
 * @example
 * <!-- 标准模式 -->
 * <MaptalksMarker :coordinates="[121,31]">
 *   <MaptalksGeometryMenu :options="{ width: 160, items: menuItems }" />
 * </MaptalksMarker>
 *
 * @example
 * <!-- 自定义模式 -->
 * <MaptalksMarker :coordinates="[121,31]">
 *   <MaptalksGeometryMenu :options="{ custom: true }">
 *     <div class="p-2"><UButton @click="zoomIn">放大</UButton></div>
 *   </MaptalksGeometryMenu>
 * </MaptalksMarker>
 */
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksGeometryMenu } from '../composables/useMaptalksGeometryMenu'
import type { UseMaptalksGeometryMenuOpts } from '../composables/useMaptalksGeometryMenu'
import { GEOMETRY_KEY } from '../core/map-context'
import type { MaptalksEventHandler, MaptalksMenuOptions } from '../types'

const props = withDefaults(
  defineProps<{
    /** 透传给 `ui.Menu` 构造器的选项（含中文字段注释，详见 MaptalksMenuOptions） */
    options?: MaptalksMenuOptions
    /** 事件名 → 处理器（自动 on/off，如 showstart / hide） */
    events?: Record<string, MaptalksEventHandler>
    /** 组件销毁时自动 `removeMenu`，默认 true */
    autoDispose?: boolean
  }>(),
  { options: undefined, events: undefined, autoDispose: true },
)

// 从祖先几何体组件获取 geometry 引用（如 MaptalksMarker）
const geometry = inject(GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksGeometryMenu 必须在提供 GEOMETRY_KEY 的几何体组件内使用')

const slots = defineSlots()

// skipNextUpdate 防止 `onUpdated` 在 `show()` 调用后重复 mount
let skipNextUpdate = false
// slotApp 是 createApp 子应用实例，用于 slot → DOM → menu.setItems() 挂载
let slotApp: App | null = null

// 用 dequal 深比较避免模板内联字面量每次渲染触发 composable 重建
const stableOpts = ref<Record<string, unknown> | undefined>(undefined)
watch(
  () => props.options,
  (o) => {
    if (dequal(o, stableOpts.value)) return
    if (!o) { stableOpts.value = undefined; return }
    // 过滤 undefined 字段，避免 { custom: undefined } 被 dequal 判定为不同
    const filtered: Record<string, unknown> = { ...o }
    for (const k of Object.keys(filtered)) {
      if (filtered[k] === undefined) delete filtered[k]
    }
    stableOpts.value = Object.keys(filtered).length > 0 ? filtered : undefined
  },
  { immediate: true },
)

const menuOpts: UseMaptalksGeometryMenuOpts = {
  options: () => stableOpts.value as MaptalksMenuOptions | undefined,
  events: props.events,
  autoDispose: props.autoDispose,
}

const { menu, show, hide } = useMaptalksGeometryMenu(geometry, menuOpts)

/** 创建 Vue 子应用 mount 到临时 DOM，将 slot 内容注入 Menu.setItems */
function mountSlotContent() {
  if (!menu.value || !slots.default) return
  if (slotApp) { slotApp.unmount(); slotApp = null }
  const mountEl = document.createElement('div')
  slotApp = createApp({ render: () => h('div', null, slots.default?.()) })
  slotApp.mount(mountEl)
  delete mountEl.dataset.vApp
  menu.value.setItems(mountEl)
}

// Menu 实例就绪后，如果是自定义模式且有 slot 内容，则挂载 slot
watch(() => menu.value, (v) => {
  if (!v) return
  if (props.options?.custom && slots.default) mountSlotContent()
}, { immediate: true })

// 父组件更新时重新 mount slot（show() 触发的跳过）
onUpdated(() => {
  if (!props.options?.custom) return
  if (skipNextUpdate) { skipNextUpdate = false; return }
  if (menu.value?.isVisible?.()) return
  mountSlotContent()
})

onBeforeUnmount(() => { if (slotApp) { slotApp.unmount(); slotApp = null } })

/** 暴露 Menu 实例与 show/hide 方法，供 template ref 程序式控制 */
defineExpose({ menu, show, hide })
</script>
