<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">点击坐标: {{ status }}</UBadge>
    <p class="text-xs text-muted mt-1">{{ mapStatus }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const rect = [[[121.49, 31.26], [121.52, 31.26], [121.52, 31.23], [121.49, 31.23], [121.49, 31.26]]] as [number, number][][]

// 逃生舱：工厂模式创建 VectorLayer + Polygon + 两个 Marker
const { geometry: polygon } = useMaptalksGeometry(layer, (mt) =>
  new mt.Polygon(rect, { symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.2 } }),
)
useMaptalksGeometry(layer, (mt) =>
  new mt.Marker([121.50, 31.245], { symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 14, markerHeight: 14 } }),
)
useMaptalksGeometry(layer, (mt) =>
  new mt.Marker([121.53, 31.26], { symbol: { markerType: 'ellipse', markerFill: '#ef4444', markerWidth: 14, markerHeight: 14 } }),
)

const status = ref('点击地图')

useMaptalksEvents(map, {
  click: (e: unknown) => {
    const ev = e as { containerPoint: { x: number; y: number } }
    status.value = toValue(polygon)?.containsPoint(ev.containerPoint) ? '内' : '外'
  },
})

const mapStatus = computed(() => (isReady.value ? '地图已创建（点击检测空间关系）' : '加载中…'))
</script>
