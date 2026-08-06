<template>
  <div>
    <!-- 组合：组件建图 + camera composable 设置/解除限制 -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="cam.setMaxExtent(EXT)">设置限制</UButton>
      <UButton size="sm" color="neutral" @click="cam.setMaxExtent(null)">解除限制</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const EXT = { xmin: 121.47, ymin: 31.22, xmax: 121.55, ymax: 31.27 }
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const cam = useMaptalksCamera(map)

const status = computed(() => (map.value ? '地图已创建（maxExtent 区域限制）' : '加载中…'))
</script>
