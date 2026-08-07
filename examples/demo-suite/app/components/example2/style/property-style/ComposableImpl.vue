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
// markerFillOpacity: { property: 'heat', type: 'identity' } 按 properties.heat 值驱动不透明度
const sym = { markerType: 'ellipse', markerFill: 'rgb(216,115,149)', markerFillOpacity: { property: 'heat', type: 'identity' }, markerLineWidth: 0, markerLineOpacity: 1, markerWidth: 40, markerHeight: 40 } as const
for (let i = 0; i < 10; i++) {
  useMaptalksMarker(layer, {
    coordinates: [121.4832 + i * 0.005, 31.2453],
    options: { symbol: sym, properties: { heat: 1 - i * 0.1 } },
  })
}

const status = computed(() => (isReady.value ? '地图已创建（属性驱动样式）' : '加载中…'))
</script>
