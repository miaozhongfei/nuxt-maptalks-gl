<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 动画特效</h1>
    <p class="text-muted mb-6">演示几何动画（平移、缩放、样式过渡）。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">Marker 平移动画</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="moveMarker()">移动 Marker</UButton><span class="text-sm text-muted">原生 geometry.animate()</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">样式闪烁效果</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="flashMarker()">闪烁</UButton><span class="text-sm text-muted">原生 geometry.setSymbol()</span></div></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: vec1 } = useMaptalksVectorLayer(map1);
const { geometry: g1 } = useMaptalksMarker(vec1, {
  coordinates: [121.47, 31.23],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 },
});
function moveMarker() {
  const geo = toValue(g1) as { animate?: (opts: Record<string, unknown>, animOpts?: Record<string, unknown>, cb?: () => void) => void } | null;
  geo?.animate?.({ coordinates: [121.50, 31.24] }, { duration: 1500 });
  setTimeout(() => geo?.animate?.({ coordinates: [121.47, 31.23] }, { duration: 1500 }), 2000);
}

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: vec2 } = useMaptalksVectorLayer(map2);
const { geometry: g2 } = useMaptalksMarker(vec2, {
  coordinates: [121.5, 31.24],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 },
});
let flashing = false;
function flashMarker() {
  if (flashing) return;
  flashing = true;
  const geo = toValue(g2) as { setSymbol?: (s: Record<string, unknown>) => void } | null;
  for (let i = 0; i < 6; i++) {
    setTimeout(() => geo?.setSymbol?.({ markerFill: i % 2 === 0 ? '#f59e0b' : '#dc2626' }), i * 400);
  }
  setTimeout(() => { flashing = false; }, 3000);
}
</script>
