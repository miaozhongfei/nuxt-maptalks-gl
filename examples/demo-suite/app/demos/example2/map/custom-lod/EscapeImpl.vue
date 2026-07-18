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
// 自定义 LOD：仅 6 级分辨率（对应 Web 墨卡托 z10~z15，逐级减半）
const resolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
const customSR = { projection: 'EPSG:3857', resolutions };

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：原生 setSpatialReference 运行时切换 LOD
function applyCustom() {
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  m?.setSpatialReference(customSR);
  m?.setZoom(3);
}
function applyDefault() {
  const m = map.value as unknown as { setSpatialReference: (sr: unknown) => void; setZoom: (z: number) => void } | null;
  // 传 null 让 maptalks 回退到默认空间参考
  m?.setSpatialReference(null);
  m?.setZoom(14);
}
</script>
