<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 3D 高度</h1>
    <p class="text-muted mb-6">演示相机俯仰角（pitch）、方位角（bearing）和 <code>useMaptalksCamera</code> 双向同步。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">useMaptalksCamera · 双向同步</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="flyTo3D()">飞到 3D 视角</UButton><UButton size="sm" @click="resetView()">复位</UButton><span class="text-sm text-muted">pitch: {{ pitch ?? '-' }}°, bearing: {{ bearing ?? '-' }}°</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 animateTo</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="animateToView()">动画飞行</UButton><span class="text-sm text-muted">原生 map.animateTo()</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · 3D 建筑（Polygon height + GroupGLLayer）</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:380px" />
        <template #footer><span class="text-sm text-muted">GroupGLLayer初始化WebGL + PolygonLayer + Polygon height。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { pitch, bearing } = useMaptalksCamera(map1);

function flyTo3D() { toValue(map1)?.animateTo({ pitch: 60, bearing: 45, zoom: 15 }, { duration: 2000 }); }
function resetView() { toValue(map1)?.animateTo({ pitch: 0, bearing: 0, zoom: 13 }, { duration: 1000 }); }

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
function animateToView() {
  toValue(map2)?.animateTo({ center: [121.5, 31.24], zoom: 15, pitch: 70, bearing: 30 }, { duration: 3000 });
}

// 卡片 3：3D 建筑 - PolygonLayer + GroupGLLayer 提供 WebGL 上下文 + Polygon height
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 15, pitch: 50 });
useMaptalksTileLayer(map3, { source: 'osm' });
// GroupGLLayer 初始化 WebGL 上下文后再添加 PolygonLayer
const { layer: glLayer3 } = useMaptalksGroupGLLayer(map3, {});
watch(() => toValue(glLayer3), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const pl = new mt.PolygonLayer('buildings');
    pl.addTo(toValue(map3)! as Record<string, unknown>);
    pl.addGeometry(new mt.Polygon(
      [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
      { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.7, lineWidth: 1 }, properties: { height: 300 } },
    ) as Parameters<typeof pl.addGeometry>[0]);
    pl.addGeometry(new mt.Polygon(
      [[121.474, 31.229], [121.477, 31.229], [121.477, 31.2305], [121.474, 31.2305]],
      { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.7, lineWidth: 1 }, properties: { height: 500 } },
    ) as Parameters<typeof pl.addGeometry>[0]);
  });
});
</script>
