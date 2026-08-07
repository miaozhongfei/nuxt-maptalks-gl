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
let maskMarker: { setCoordinates?: (c: unknown) => unknown } | null = null
let maskBound = false

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv || maskBound) return
    m = mv
    maskBound = true
    const mt = await import('maptalks-gl')
    // getExtent 建模返回 unknown——按使用处窄断言
    const extent = m.getExtent() as { getMin: () => { x: number; y: number }; getWidth: () => number; getHeight: () => number }
    const min = extent.getMin()
    const w = extent.getWidth()
    const h = extent.getHeight()
    const markers: mt.Marker[] = []
    for (let i = 0; i < 100; i++) {
      markers.push(new mt.Marker([min.x + Math.random() * w, min.y + Math.random() * h]))
    }
    const layer = new mt.VectorLayer('vector', markers)
    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    layer.addTo(m as never)
    m.on('mousemove', (e) => {
      const ev = e as { coordinate?: { x: number; y: number } }
      // coordinate 可能缺省——先提取 const 再守卫（属性收窄进异步闭包会失效，const 变量收窄保留）
      const coord = ev.coordinate
      if (!coord) return
      if (maskMarker) {
        maskMarker.setCoordinates?.(coord)
      } else {
        maskMarker = new mt.Marker(coord, {
          symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
        })
        // 窄类型非原生 Mask——逃生舱断言
        layer.setMask(maskMarker as never)
      }
    })
  },
)

onBeforeUnmount(() => { m = null; maskMarker = null })

const status = computed(() => (isReady.value ? '地图已创建（移动鼠标查看遮罩效果）' : '加载中…'))
</script>
