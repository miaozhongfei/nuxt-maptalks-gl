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
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => mc.value?.map ?? null)

useMaptalksImageLayer(map, {
  images: [
    { url: '/images/logo-h.png', extent: [121.49, 31.235, 121.51, 31.255], opacity: 1 },
    { url: '/images/logo-h.png', extent: [121.50, 31.240, 121.52, 31.260], opacity: 0.4 },
  ],
})
</script>
