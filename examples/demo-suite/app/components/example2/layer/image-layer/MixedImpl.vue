<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

useMaptalksImageLayer(map, {
  images: [
    { url: '/images/1.png', extent: [121.49, 31.235, 121.51, 31.255], opacity: 1 },
    { url: '/images/2.png', extent: [121.5, 31.24, 121.52, 31.26], opacity: 0.4 },
  ],
})

const status = computed(() => (map.value ? '地图已创建（图片图层已叠加）' : '加载中…'))
</script>
