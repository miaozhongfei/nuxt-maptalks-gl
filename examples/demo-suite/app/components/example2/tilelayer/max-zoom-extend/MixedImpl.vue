<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="20"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      :options="{ spatialReference: srExtended }"
    />
    <p class="text-sm text-muted mt-2">当前 zoom：{{ (cam.zoom.value ?? 0).toFixed(2) }}（可超过默认 20 级上限）</p>
  </div>
</template>

<script setup lang="ts">
const resolutions = Array.from({ length: 23 }, (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** i));
const srExtended = { projection: 'EPSG:3857', resolutions };
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  maxAvailableZoom: 18,
};
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { options: tileOptions });
const cam = useMaptalksCamera(map);
</script>
