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
// 一体工厂：同一矢量图层创建矩形/圆/椭圆/扇形四种规则图形（addGeometry 已建模）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v')
  // 矩形：左上角 + 宽高
  layer.addGeometry(
    new mt.Rectangle([121.488, 31.258], 1200, 800, {
      symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 },
    }),
  )
  // 圆：中心 + 半径
  layer.addGeometry(
    new mt.Circle([121.5057, 31.2453], 600, {
      symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 },
    }),
  )
  // 椭圆：中心 + 宽高
  layer.addGeometry(
    new mt.Ellipse([121.522, 31.252], 1400, 700, {
      symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 },
    }),
  )
  // 扇形：中心 + 半径 + 起始角 + 结束角
  layer.addGeometry(
    new mt.Sector([121.497, 31.238], 900, 0, 90, {
      symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 },
    }),
  )
  return layer
})

const status = computed(() => (isReady.value ? '地图已创建（四种规则图形）' : '加载中…'))
</script>
