<template>
  <!-- 插槽内容在本组件模板内渲染（Vue 完整控制，响应式自然生效）。
       用隐藏容器承载，再用 nextTick 取 innerHTML 快照传给 InfoWindow.setContent。
       不传真实 DOM 元素——maptalks 会把 DOM 移走，导致 Vue 失去追踪。 -->
  <div style="display: none">
    <div ref="slotWrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'

import { useMaptalksInfoWindow } from '../composables/useMaptalksInfoWindow'
import type { UseMaptalksInfoWindowOptions } from '../composables/useMaptalksInfoWindow'
import { MAP_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{
    /** InfoWindow 弹出框坐标 */
    coordinates?: unknown
    /** InfoWindow 弹出框坐标（别名，与 coordinates 二选一） */
    geometry?: unknown
    /** 是否可见，默认 true */
    visible?: boolean
    /** 透传给 InfoWindow 构造器的选项 */
    options?: Record<string, unknown>
  }>(),
  {
    visible: true,
    options: () => ({}),
  },
)

const slots = useSlots()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const slotWrapper = ref<HTMLElement | null>(null)

const iwOpts: UseMaptalksInfoWindowOptions = {
  options: () => props.options,
  coordinates: () => props.coordinates ?? props.geometry,
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

/** 用 nextTick 确保插槽已渲染，取 innerHTML 快照传给 setContent（不传 DOM 元素，避免 maptalks 移走导致 Vue 失去追踪） */
async function applyContent(): Promise<void> {
  if (!infoWindow.value || !slots.default || !slotWrapper.value) return
  await nextTick()
  infoWindow.value.setContent(slotWrapper.value.innerHTML)
}

// InfoWindow 实例就绪后，挂载内容并按 visible 显示
watch(
  () => infoWindow.value,
  async (v) => {
    if (!v) return
    await applyContent()
    if (props.visible) v.show(props.coordinates ?? props.geometry)
  },
  { immediate: true },
)

// visible prop → show/hide（immediate 确保初始值也生效）
watch(
  () => props.visible,
  (v) => {
    if (!infoWindow.value) return
    if (v) {
      infoWindow.value.show(props.coordinates ?? props.geometry)
    } else {
      infoWindow.value.hide()
    }
  },
  { immediate: true },
)

// coordinates/geometry 变化 → 先等插槽重渲染（flush:post 确保父组件插槽 DOM 已更新），取最新 innerHTML 再 show
watch(
  () => props.coordinates ?? props.geometry,
  async (coord) => {
    if (!infoWindow.value || !props.visible || coord === undefined) return
    await applyContent()
    infoWindow.value.show(coord)
  },
  { flush: 'post' },
)

// 初始挂载：若 infoWindow 已就绪则设置内容
onMounted(async () => {
  if (infoWindow.value) await applyContent()
})

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide })

onBeforeUnmount(() => {
  infoWindow.value?.hide()
})
</script>
