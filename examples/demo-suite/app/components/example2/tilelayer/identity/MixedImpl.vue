<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[0, 0]"
    :zoom="2"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
    :options="{ spatialReference: srIdentity }"
  />
</template>

<script setup lang="ts">
// IDENTITY 平面坐标系：无投影，直接以平面坐标渲染（常用于室内图/游戏地图）
const srIdentity = {
  projection: 'identity',
  resolutions: [32, 16, 8, 4, 2, 1],
  fullExtent: { top: 10000, left: -10000, bottom: -10000, right: 10000 },
};

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
// 壳提供 SR + 中心点，桥接 map 后走 composable 加几何
const { layer } = useMaptalksVectorLayer(map);
useMaptalksMarker(layer, { coordinates: [0, 0] });
useMaptalksRectangle(layer, {
  coordinates: [500, 500],
  width: 2000,
  height: 1200,
  options: { symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } },
});
useMaptalksCircle(layer, {
  coordinates: [-1500, -800],
  radius: 400,
  options: { symbol: { polygonFill: '#22c55e', polygonOpacity: 0.3, lineColor: '#16a34a', lineWidth: 2 } },
});
</script>
