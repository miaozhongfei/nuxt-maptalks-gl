<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 矩形
useMaptalksRectangle(layer, {
  coordinates: [121.488, 31.258],
  width: 1200,
  height: 800,
  symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 },
});
// 圆
useMaptalksCircle(layer, {
  coordinates: [121.5057, 31.2453],
  radius: 600,
  symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 },
});
// 椭圆
useMaptalksEllipse(layer, {
  coordinates: [121.522, 31.252],
  width: 1400,
  height: 700,
  symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 },
});
// 扇形
useMaptalksSector(layer, {
  coordinates: [121.497, 31.238],
  radius: 900,
  startAngle: 0,
  endAngle: 90,
  symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 },
});
</script>
