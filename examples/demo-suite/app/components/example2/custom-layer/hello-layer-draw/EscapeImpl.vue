<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">CanvasLayer 响应鼠标点击绘制圆——交互式图层（对应官网 14.2）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const circles = ref<Array<{ x: number; y: number }>>([])
useMaptalksLayer(map, (mt: any) => {
  const hl = new mt.CanvasLayer('draw')
  hl.draw = (ctx: any) => {
    for (const c of circles.value) {
      ctx.beginPath()
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#dc2626'
      ctx.fill()
    }
    hl.completeRender()
  }
  return hl
})
watch(() => toValue(map), (m) => {
  if (!m) return
  m.on('click', (e: any) => {
    const pt = (m as any).coordToContainerPoint(e.coordinate)
    circles.value = [...circles.value, pt]
    // Trigger redraw
    const canvasLayer = (m as any).getLayer('draw')
    if (canvasLayer && canvasLayer.redraw) canvasLayer.redraw()
  })
})
</script>
