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
useMaptalksGeometry(layer, (mt) => new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
  symbol: { lineColor: '#2563eb', lineWidth: 4, lineDasharray: [10, 5], lineCap: 'round', lineJoin: 'round' },
}))

const status = computed(() => (isReady.value ? '地图已创建（线样式）' : '加载中…'))
</script>
