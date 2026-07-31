<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="moveRight">平移</UButton>
      <UButton size="sm" variant="outline" @click="moveBack">复位</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

// 逃生舱：工厂模式创建 Marker
const { geometry } = useMaptalksGeometry(layer, (mt) =>
  new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 },
  }),
)

const translateOffset: [number, number] = [0.02, 0]

// 官网核心 API：geometry.animate({ translate: [dx, dy] }, { duration, focus })
function moveRight() { toValue(geometry)?.animate?.({ translate: translateOffset }, { duration: 2000, focus: true }) }
function moveBack() { toValue(geometry)?.animate?.({ translate: [-translateOffset[0], 0] }, { duration: 2000, focus: true }) }
</script>
