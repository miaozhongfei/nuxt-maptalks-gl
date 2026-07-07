<template>
  <div ref="slotHost" style="display: none" />
</template>

<script setup lang="ts">
import { createApp, h, inject, onBeforeUnmount, onMounted, onUpdated, watch } from 'vue'
import type { App } from 'vue'

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

const slots = defineSlots()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const iwOpts: UseMaptalksInfoWindowOptions = {
  options: () => props.options,
  coordinates: () => props.coordinates ?? props.geometry,
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

let slotApp: App | null = null;

/** 创建 Vue 子应用 mount 到临时 DOM，将 DOM 元素注入 InfoWindow.setContent。 */
function mountSlotContent() {
  if (!infoWindow.value || !slots.default) return;
  // 销毁旧的应用
  if (slotApp) {
    slotApp.unmount();
    slotApp = null;
  }
  const mountEl = document.createElement('div');
  slotApp = createApp({
    render() {
      return h('div', null, slots.default?.());
    },
  });
  slotApp.mount(mountEl);
  infoWindow.value.setContent(mountEl);
}

// InfoWindow 实例就绪后挂载 slot 内容
watch(
  () => infoWindow.value,
  (v) => {
    if (v) {
      mountSlotContent();
      if (props.visible) v.show(props.coordinates ?? props.geometry);
    }
  },
);

// 父组件每次更新时重新 mount slot 内容，确保 Vue 响应式组件也能反映变化
onMounted(() => mountSlotContent());
onUpdated(() => mountSlotContent());

// visible prop → show/hide（immediate 确保初始值也生效）
watch(
  () => props.visible,
  (v) => {
    if (!infoWindow.value) return;
    if (v) {
      infoWindow.value.show(props.coordinates ?? props.geometry);
    } else {
      infoWindow.value.hide();
    }
  },
  { immediate: true },
);

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide });

onBeforeUnmount(() => {
  if (slotApp) {
    slotApp.unmount();
    slotApp = null;
  }
});
</script>
