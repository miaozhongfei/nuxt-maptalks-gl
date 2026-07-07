<template>
  <!-- 插槽内容在本组件内渲染（保持响应式），用隐藏容器承载，再把该 DOM 交给 InfoWindow.setContent。
       这样坐标/内容变化时 Vue 直接 patch 该 DOM，信息框文本自动更新，无需重挂、无跨 app 响应式问题。 -->
  <div style="display: none">
    <div ref="contentEl"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, ref, useSlots, watch } from 'vue'

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

const contentEl = ref<HTMLElement | null>(null)

const iwOpts: UseMaptalksInfoWindowOptions = {
  options: () => props.options,
  coordinates: () => props.coordinates ?? props.geometry,
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

// InfoWindow 实例与内容 DOM 都就绪后：设置内容（仅当提供了插槽）并按 visible 显示
watch(
  [() => infoWindow.value, contentEl],
  ([iw, el]) => {
    if (!iw) return
    if (el && slots.default) iw.setContent(el)
    if (props.visible) iw.show(props.coordinates ?? props.geometry)
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

// coordinates/geometry 变化 → 若可见则重新 show 定位（内容 DOM 已响应式，文本自动更新）
watch(
  () => props.coordinates ?? props.geometry,
  (coord) => {
    if (infoWindow.value && props.visible && coord !== undefined) {
      infoWindow.value.show(coord)
    }
  },
)

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide })

onBeforeUnmount(() => {
  infoWindow.value?.hide()
})
</script>
