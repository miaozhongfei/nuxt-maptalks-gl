<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="applyCustom">切到自定义 6 级 LOD</UButton>
      <UButton size="sm" color="neutral" @click="applyDefault">恢复默认 LOD</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const resolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
const customSR = { projection: 'EPSG:3857', resolutions };

const el = ref<HTMLElement | null>(null);
// 跟踪当前是否在自定义 SR 模式，urlTemplate 函数据此决定是否加 10 偏移
const customMode = ref(false);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
// 使用函数型 urlTemplate：默认 SR 下 z 即真实级别；自定义 SR 下 z 是 LOD 索引，需 +10
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: (x: number, y: number, z: number) => {
      const offset = customMode.value ? 10 : 0;
      return `https://b.basemaps.cartocdn.com/light_all/${z + offset}/${x}/${y}.png`;
    },
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  },
});

function applyCustom() {
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  customMode.value = true;
  m?.setSpatialReference(customSR);
  m?.setZoom(3);
}
function applyDefault() {
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  customMode.value = false;
  m?.setSpatialReference(null);
  m?.setZoom(14);
}
</script>
