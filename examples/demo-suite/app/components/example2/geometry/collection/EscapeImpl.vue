<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
// 工厂回调注入 maptalks-gl 命名空间（mt），创建底图
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
)
// GeometryCollection 一体工厂：集合内混装 点/线/面 三种子几何（构造器已建模）
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

const status = computed(() => (isReady.value ? '地图已创建（GeometryCollection 集合）' : '加载中…'))
</script>
