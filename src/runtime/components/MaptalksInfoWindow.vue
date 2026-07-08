<template>
  <div ref="contentHost" style="display: none">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, onUpdated, ref, watch } from 'vue'

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

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates ?? props.geometry

const iwOpts: UseMaptalksInfoWindowOptions = {
  ...(props.options === undefined ? {} : { options: () => props.options }),
  ...(coord() === undefined ? {} : { coordinates: coord }),
}

const { infoWindow, show, hide } = useMaptalksInfoWindow(map, iwOpts)

const contentHost = ref<HTMLElement | null>(null)
let skipNextUpdate = false

// 类比 MaptalksMarkerInfoWindow：infoWindow + contentHost 双就绪时 setContent(innerHTML)
// 不在 iwOpts 里传 content——reload 是 async 的，此时 contentHost 已就绪，watcher 会同步 setContent
watch(
  [() => infoWindow.value, contentHost],
  ([iw, host]) => {
    if (iw && host) iw.setContent(host.innerHTML)
  },
)

// 父组件数据变化时复制更新的 slot 内容（show() 触发的更新跳过，避免打断动画）
onUpdated(() => {
  if (skipNextUpdate) { skipNextUpdate = false; return; }
  const iw = infoWindow.value
  const host = contentHost.value
  if (iw && host) iw.setContent(host.innerHTML)
})

// visible prop → show/hide（immediate 确保初始值也生效）
watch(
  () => props.visible,
  (v) => {
    if (!infoWindow.value) return;
    if (v) {
      skipNextUpdate = true;
      if (coord() !== undefined) infoWindow.value.show(coord());
    } else {
      infoWindow.value.hide();
    }
  },
  { immediate: true },
);

// coordinates/geometry 变化 → 若可见则重新 show 定位
watch(
  () => props.coordinates ?? props.geometry,
  (c) => {
    if (infoWindow.value && props.visible && c !== undefined) {
      skipNextUpdate = true;
      infoWindow.value.show(c);
    }
  },
)

// 暴露命令式 show/hide，供父组件通过 template ref 调用
defineExpose({ infoWindow, show, hide })
</script>
