<template>
  <div>
    <!-- 组合：组件建图 + camera zoom 双向滑杆 -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
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
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const cam = useMaptalksCamera(map)
const zoom = computed({
  get: () => cam.zoom.value ?? 14,
  set: (v) => {
    cam.zoom.value = v
  },
})

const status = computed(() => (map.value ? '地图已创建（0.1 步进细微缩放）' : '加载中…'))
</script>
