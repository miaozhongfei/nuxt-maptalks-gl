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
const { layer } = useMaptalksVectorLayer(map)
// 陆家嘴周边多点标注（工厂模式）
useMaptalksGeometry(layer, (mt) => new mt.MultiPoint([[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 },
}))

const status = computed(() => (isReady.value ? '地图已创建（MultiPoint 多点）' : '加载中…'))
</script>
