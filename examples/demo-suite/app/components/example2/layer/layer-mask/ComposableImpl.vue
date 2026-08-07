<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const randomPts = Array.from({ length: 100 }, () => [
  121.4757 + Math.random() * 0.06,
  31.2153 + Math.random() * 0.06,
] as [number, number])

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

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
      // coordinate 可能缺省——先提取 const 再守卫（属性收窄进异步闭包会失效，const 变量收窄保留）
      const coord = ev.coordinate
      if (!coord) return
      if (maskMarker) {
        maskMarker.setCoordinates?.(coord)
      } else {
        // e.coordinate 运行时即原生 Coordinate——断言还原（{x,y} 缺类方法无法直接匹配 MarkerCoordinatesType）
        maskMarker = new mt.Marker(coord as unknown as mt.Coordinate, {
          symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
        })
        // 原生 Marker 与建模 MaptalksGeometry 逆变不兼容——断言
        toValue(vectorLayer)?.setMask?.(maskMarker as unknown as MaptalksGeometry)
      }
    })
  },
)

onBeforeUnmount(() => { maskMarker = null })

const status = computed(() => (isReady.value ? '地图已创建（移动鼠标查看遮罩效果）' : '加载中…'))
</script>
