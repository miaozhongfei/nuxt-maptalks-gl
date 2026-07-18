<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="20"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
    :options="{ spatialReference: srExtended }"
  />
</template>

<script setup lang="ts">
// 把空间参考扩到 22 级（默认 3857 预设为 0~20 级），瓦片源只有 18 级 → maxAvailableZoom 超采样放大
const resolutions = Array.from({ length: 23 }, (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** i));
const srExtended = { projection: 'EPSG:3857', resolutions };
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // 超过 18 级后用 18 级瓦片放大渲染
  maxAvailableZoom: 18,
};

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { options: tileOptions });
</script>
