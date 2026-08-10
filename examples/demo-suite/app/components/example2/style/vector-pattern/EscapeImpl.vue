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
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'diamond', markerFill: '#2563eb', markerLineColor: '#1e3a8a', markerLineWidth: 2, markerWidth: 30, markerHeight: 30 },
}))

const status = computed(() => (isReady.value ? '地图已创建（模式填充标注）' : '加载中…'))
</script>
