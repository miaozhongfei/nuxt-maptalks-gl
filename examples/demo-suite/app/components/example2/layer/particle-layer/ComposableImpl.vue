<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

let m: MaptalksMap | null = null
watch(() => toValue(map), (mv) => { if (!m && mv) m = mv })

const { layer: vl } = useMaptalksVectorLayer(map)
useMaptalksMarker(vl, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'cross', markerWidth: 10, markerHeight: 10, markerLineWidth: 2 } },
})
useMaptalksCircle(vl, {
  coordinates: [121.5057, 31.2453],
  radius: 1000,
  options: { symbol: { lineColor: '#fff', lineWidth: 6, lineOpacity: 0.2, polygonOpacity: 0 } },
})

useMaptalksLayer(map, (mt) => {
  const pl = new mt.ParticleLayer('p', { forceRenderOnMoving: true })
  // getParticles 已建模（官网接口方法）——直接赋值；t 为毫秒时间，返回粒子数组
  pl.getParticles = (t: number) => {
    if (!m) return []
    const center = m.getCenter()
    // coordinateToContainerPoint 建模返回 unknown——Point.add 按需窄断言
    const point = m.coordinateToContainerPoint(center) as { add: (x: number, y: number) => unknown }
    const angle = (t / 16 % 360) * Math.PI / 180
    const pxLen = m.distanceToPixel(1000, 1000)
    const r = pxLen.width
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    return [{ point: point.add(x, y), r: 4, color: 'rgb(135,196,240)' }]
  }
  return pl
})

const status = computed(() => (isReady.value ? '地图已创建（粒子沿圆周运动）' : '加载中…'))
</script>
