<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="3"
      :options="{ spatialReference }"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">自定义 6 级 LOD：zoom 只在 0 ~ 5 之间变化（滚轮试试）。</p>
    <p class="text-sm text-muted">当前 zoom：{{ (cam.zoom.value ?? 0).toFixed(2) }}（范围 0 ~ 5）</p>
    <div class="flex items-center gap-2 mt-2">
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
const spatialReference = { projection: 'EPSG:3857', resolutions };
const customSR = { projection: 'EPSG:3857', resolutions };

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const customMode = ref(true);
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: (x: number, y: number, z: number) => {
      const offset = customMode.value ? 10 : 0;
      return `https://b.basemaps.cartocdn.com/light_all/${z + offset}/${x}/${y}.png`;
    },
  },
});
const cam = useMaptalksCamera(map);

function applyCustom() {
  customMode.value = true;
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  m?.setSpatialReference(customSR);
  m?.setZoom(3);
}
function applyDefault() {
  customMode.value = false;
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  m?.setSpatialReference(null);
  m?.setZoom(14);
}
</script>
