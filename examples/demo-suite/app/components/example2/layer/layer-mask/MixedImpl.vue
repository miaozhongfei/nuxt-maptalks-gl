<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const randomPts = Array.from({ length: 100 }, () => [
  121.4757 + Math.random() * 0.06,
  31.2153 + Math.random() * 0.06,
] as [number, number])

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer: vectorLayer } = useMaptalksVectorLayer(map, { id: 'vector' })
randomPts.forEach((c, i) => {
  useMaptalksMarker(vectorLayer, {
    coordinates: c,
    options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } },
    id: `mk${i}`,
  })
})

let maskMarker: { setCoordinates?: (c: unknown) => unknown } | null = null
let maskBound = false

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv || maskBound) return
    maskBound = true
    const mt = await import('maptalks-gl')
    mv.on('mousemove', (e) => {
      const ev = e as { coordinate?: { x: number; y: number } }
      // coordinate 可能缺省——先守卫再使用（同时收窄给 new Marker 的坐标参数）
      if (!ev.coordinate) return
      if (maskMarker) {
        maskMarker.setCoordinates?.(ev.coordinate)
      } else {
        maskMarker = new mt.Marker(ev.coordinate, {
          symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
        })
        // 原生 Marker 与建模 MaptalksGeometry 逆变不兼容——断言
        toValue(vectorLayer)?.setMask?.(maskMarker as unknown as MaptalksGeometry)
      }
    })
  },
)

onBeforeUnmount(() => { maskMarker = null })

const status = computed(() => (map.value ? '地图已创建（移动鼠标查看遮罩效果）' : '加载中…'))
</script>
