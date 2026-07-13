<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 分组和 Polygon 逃生舱。</p>

    <div class="grid grid-cols-1 gap-4">
      <!-- 卡片 1：GroupGLLayer + Polygon -->
      <UCard>
        <template #header><h2 class="font-semibold">GroupGLLayer · GL 图层分组</h2></template>
        <MaptalksMap ref="mapCmp1" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:400px" />
        <template #footer><span class="text-sm text-muted">useMaptalksGroupGLLayer + Polygon。</span></template>
      </UCard>

      <!-- 卡片 2：direct composable + native Polygon 逃生舱 -->
      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 Polygon 创建</h2></template>
        <MaptalksMap ref="mapCmp2" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:400px" />
        <template #footer><span class="text-sm text-muted">useMaptalksVectorLayer + native new mt.Polygon() 逃生舱。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1：GroupGLLayer + Polygon
const mapCmp1 = ref<{ map: MaptalksMap | null } | null>(null);
const map1 = computed(() => mapCmp1.value?.map ?? null);
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: glLayer } = useMaptalksGroupGLLayer(map1, {});
useMaptalksPolygon(glLayer, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  symbol: { polygonFill: '#8b5cf6', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#6d28d9' },
});

// 卡片 2：MaptalksMap 组件 + native Polygon 逃生舱
const mapCmp2 = ref<{ map: MaptalksMap | null } | null>(null);
const map2 = computed(() => mapCmp2.value?.map ?? null);
// 先 TileLayer
useMaptalksTileLayer(map2, { source: 'osm' });
// 后 VectorLayer（在上面）
const { layer: bldVec } = useMaptalksVectorLayer(map2);
// composable preset Polygon（确定可行）
useMaptalksPolygon(bldVec, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  symbol: { polygonFill: '#2563eb', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#1d4ed8' },
});
// 逃生舱：原生 Polygon
watch(() => toValue(bldVec), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const p = new mt.Polygon(
      [[121.474, 31.229], [121.477, 31.229], [121.477, 31.2305], [121.474, 31.2305]],
      { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#991b1b' } },
    );
    p.addTo(layer as Parameters<typeof p.addTo>[0]);
  });
});
</script>
