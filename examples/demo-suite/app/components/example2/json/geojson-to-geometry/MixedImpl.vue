<template>
  <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  <p class="text-sm text-muted mt-2">组合：组件建图 + Composable 转换 GeoJSON（对应官网 11.1）。</p>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const geojson = { type: 'Point', coordinates: [121.5057, 31.2453] }
useMaptalksGeoJSON(map, geojson)
</script>
