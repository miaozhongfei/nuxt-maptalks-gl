<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">TileLayer 自带独立空间参考（仅6级分辨率 z10~z15）+ tileSystem 定义瓦片编号规则，与地图默认 SR 解耦。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
const layerResolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: (x: number, y: number, z: number) =>
      `https://b.basemaps.cartocdn.com/light_all/${z + 10}/${x}/${y}.png`,
    spatialReference: {
      projection: 'EPSG:3857',
      resolutions: layerResolutions,
      fullExtent: { top: 20037508.34, left: -20037508.34, bottom: -20037508.34, right: 20037508.34 },
    },
    tileSystem: [1, -1, -20037508.34, 20037508.34],
  },
});
</script>
