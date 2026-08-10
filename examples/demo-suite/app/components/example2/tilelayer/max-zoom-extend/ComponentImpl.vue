<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="20"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      :options="{ spatialReference: srExtended }"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">当前 zoom：{{ (cam.zoom.value ?? 0).toFixed(2) }}（可超过默认 20 级上限）</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const resolutions = Array.from({ length: 23 }, (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** i))
const srExtended = { projection: 'EPSG:3857', resolutions }
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  maxAvailableZoom: 18,
}
const cam = useMaptalksCamera(map)

const status = computed(() => (map.value ? '地图已创建（maxZoom 扩到 22 级）' : '加载中…'))
</script>
