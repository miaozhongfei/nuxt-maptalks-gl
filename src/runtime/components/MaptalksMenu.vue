<template>
  <div style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * 地图级右键菜单组件（MapMenu）。
 *
 * @description 对 `useMaptalksMenu` 的声明式封装。在 MaptalksMap 内渲染，
 * 通过 `inject(MAP_KEY)` 获取 map。支持两种模式：
 * 1. **标准模式**：`options.items` 数组 → composable 内部调 `menu.setItems(items)`
 * 2. **自定义模式**：`options.custom: true` + `<slot />` → `createApp` 子应用 mount → `menu.setItems(el)`
 *
 * 必须在 `<MaptalksMap>` 内使用。
 *
 * @example
 * <!-- 标准模式 -->
 * <MaptalksMenu :options="{ width: 160, items: menuItems }" />
 *
 * @example
 * <!-- 自定义模式 -->
 * <MaptalksMenu :options="{ custom: true }">
 *   <div class="p-2"><UButton @click="zoomIn">放大</UButton></div>
 * </MaptalksMenu>
 */
import { createApp, h, inject, onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import type { App } from 'vue'
import { dequal } from 'dequal'

import { useMaptalksMenu } from '../composables/useMaptalksMenu'
import type { UseMaptalksMenuOpts } from '../composables/useMaptalksMenu'
import { MAP_KEY } from '../core/map-context'
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

// 从祖先 MaptalksMap 获取 map 引用
const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksMenu 必须在 MaptalksMap 内使用')

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

const menuOpts: UseMaptalksMenuOpts = {
  options: () => stableOpts.value as MaptalksMenuOptions | undefined,
  events: props.events,
  autoDispose: props.autoDispose,
}

const { menu, show, hide } = useMaptalksMenu(map, menuOpts)

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
