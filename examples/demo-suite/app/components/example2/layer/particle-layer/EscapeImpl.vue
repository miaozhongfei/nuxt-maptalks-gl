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

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    const mt = await import('maptalks-gl')
    const m = mv
    const center = m.getCenter()

    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    const vl = new mt.VectorLayer('v').addTo(m as never)
    new mt.Marker(center, { symbol: { markerType: 'cross', markerWidth: 10, markerHeight: 10, markerLineWidth: 2 } }).addTo(vl)
    new mt.Circle(center, 1000, { symbol: { lineColor: '#fff', lineWidth: 6, lineOpacity: 0.2, polygonOpacity: 0 } }).addTo(vl)

    const pl = new mt.ParticleLayer('p', { forceRenderOnMoving: true })
    // getParticles 未建模——逃生舱断言（粒子回调：t 为帧序号，返回粒子数组）
    ;(pl as unknown as { getParticles: (t: number) => Array<{ point: unknown; r: number; color: string }> }).getParticles = (t: number) => {
      // coordinateToContainerPoint 建模返回 unknown——Point.add 按需窄断言
      const point = m.coordinateToContainerPoint(center) as { add: (x: number, y: number) => unknown }
      const angle = (t / 16 % 360) * Math.PI / 180
      const pxLen = m.distanceToPixel(1000, 1000)
      const r = pxLen.width
      const x = r * Math.cos(angle)
      const y = r * Math.sin(angle)
      return [{ point: point.add(x, y), r: 4, color: 'rgb(135,196,240)' }]
    }
    pl.addTo(m as never)
  },
)

const status = computed(() => (isReady.value ? '地图已创建（粒子沿圆周运动）' : '加载中…'))
</script>
