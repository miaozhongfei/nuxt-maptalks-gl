<template>
  <div ref="slotHost" style="display: none" />
</template>

<script setup lang="ts">
import { h, inject, onBeforeUnmount, render, watch } from 'vue'

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
  { visible: true, options: undefined },
)

const slots = defineSlots()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates ?? props.geometry

const iwOpts: UseMaptalksInfoWindowOptions = {
  ...(props.options === undefined ? {} : { options: () => props.options }),
  ...(coord() === undefined ? {} : { coordinates: coord }),
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

let mountEl: HTMLElement | null = null;

/** 将 slot 内容 render 到临时 DOM，再注入 InfoWindow.setContent（不用 createApp 避免 data-v-app 干扰动画） */
function mountSlotContent() {
  if (!infoWindow.value || !slots.default) return;
  // 清理旧渲染
  if (mountEl) { render(null, mountEl); mountEl = null; }
  mountEl = document.createElement('div');
  render(h('div', null, slots.default?.()), mountEl);
  infoWindow.value.setContent(mountEl);
}

// InfoWindow 实例就绪后挂载 slot 内容
watch(
  () => infoWindow.value,
  (v) => {
    if (v) {
      mountSlotContent();
      if (props.visible && coord() !== undefined) v.show(coord());
    }
  },
);

let visibleJustBecameTrue = false;

// visible prop → show/hide（immediate 确保初始值也生效）
watch(
  () => props.visible,
  (v) => {
    if (!infoWindow.value) return;
    if (v) {
      visibleJustBecameTrue = true;
      if (coord() !== undefined) infoWindow.value.show(coord());
    } else {
      infoWindow.value.hide();
    }
  },
  { immediate: true },
);

// coordinates/geometry 变化 → 若可见则重新 show 定位（跳过因 visible 变化触发的同 tick 重复调用）
watch(
  () => props.coordinates ?? props.geometry,
  (c) => {
    if (visibleJustBecameTrue) { visibleJustBecameTrue = false; return; }
    if (infoWindow.value && props.visible && c !== undefined) {
      infoWindow.value.show(c);
    }
  },
)

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide });

onBeforeUnmount(() => {
  if (mountEl) { render(null, mountEl); mountEl = null; }
});
</script>
