<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 w-96">
      <span class="text-sm w-24 shrink-0">zoom {{ zoom.toFixed(1) }}</span>
      <USlider v-model="zoom" :min="12" :max="17" :step="0.1" />
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })
// 逃生舱：相机 ref 读取方向（拖动地图回流），set 方向走原生 setZoom 无动画（已建模）
const cam = useMaptalksCamera(map)
const zoom = computed({
  get: () => cam.zoom.value ?? 14,
  set: (v) => {
    map.value?.setZoom(v, { animation: false })
  },
})

const status = computed(() => (isReady.value ? '地图已创建（原生 setZoom 细微缩放）' : '加载中…'))
</script>
