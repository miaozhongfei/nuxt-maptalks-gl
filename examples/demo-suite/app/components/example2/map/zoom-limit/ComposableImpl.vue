<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">minZoom {{ minZoom }}</span>
        <USlider v-model="minZoom" :min="1" :max="15" :step="1" />
      </div>
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">maxZoom {{ maxZoom }}</span>
        <USlider v-model="maxZoom" :min="15" :max="19" :step="1" />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">当前缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const minZoom = ref(12)
const maxZoom = ref(16)
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 14,
  // 初始上下限与滑杆默认值一致，确保首次加载即生效
  minZoom: 12,
  maxZoom: 16,
})
useMaptalksTileLayer(map, { source: 'osm' })
const cam = useMaptalksCamera(map)
// 滑杆变化时通过 camera composable 更新缩放范围
watch([minZoom, maxZoom], ([min, max]) => {
  if (map.value) cam.setZoomRange(min, max)
}, { immediate: true })

const status = computed(() => (isReady.value ? '地图已创建（minZoom/maxZoom 滑杆热更新）' : '加载中…'))
</script>
