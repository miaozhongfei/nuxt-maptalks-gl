<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 分组和 GLTFLayer 逃生舱。</p>

    <div class="grid grid-cols-1 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">GroupGLLayer · GL 图层分组</h2></template>
        <MaptalksMap ref="mapCmp1" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:400px">
          <MaptalksTileLayer source="osm" />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">useMaptalksGroupGLLayer 创建 GL 容器图层（空容器）。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 3D 建筑拉伸（VectorLayer + height）</h2></template>
        <MaptalksMap ref="mapCmp2" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:400px">
          <MaptalksTileLayer source="osm" />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">VectorLayer + Polygon properties.height 实现建筑拉伸。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1：GroupGLLayer（创建 GL 容器）
const mapCmp1 = ref<{ map: MaptalksMap | null } | null>(null);
const map1 = computed(() => mapCmp1.value?.map ?? null);
const { layer: glLayer } = useMaptalksGroupGLLayer(map1, {});

// 卡片 2：VectorLayer + Polygon
const mapCmp2 = ref<{ map: MaptalksMap | null } | null>(null);
const map2 = computed(() => mapCmp2.value?.map ?? null);
const { layer: bldVec } = useMaptalksVectorLayer(map2);
useMaptalksPolygon(bldVec, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  symbol: { polygonFill: '#2563eb', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#1d4ed8' },
});
useMaptalksPolygon(bldVec, {
  coordinates: [[121.474, 31.229], [121.477, 31.229], [121.477, 31.2305], [121.474, 31.2305]],
  symbol: { polygonFill: '#dc2626', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#991b1b' },
});
</script>
