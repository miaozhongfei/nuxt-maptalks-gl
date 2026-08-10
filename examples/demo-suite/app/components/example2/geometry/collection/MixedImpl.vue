<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 桥接 + GeometryCollection 工厂：集合内混装 点/线/面 三种子几何（构造器已建模）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v')
  const collection = new mt.GeometryCollection([
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
    }),
    new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
      symbol: { lineColor: '#dc2626', lineWidth: 3 },
    }),
    new mt.Polygon([[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]], {
      symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 },
    }),
  ])
  layer.addGeometry(collection)
  return layer
})

const status = computed(() => (map.value ? '地图已创建（GeometryCollection 集合）' : '加载中…'))
</script>
