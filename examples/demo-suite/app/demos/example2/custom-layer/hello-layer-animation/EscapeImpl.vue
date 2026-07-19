<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">CanvasLayer requestAnimationFrame 动画——弹跳小球（对应官网 14.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
useMaptalksLayer(map, (mt: any) => {
  const hl = new mt.CanvasLayer('anim')
  let y = 100
  let vy = 3
  let rafId: number
  function animate() {
    y += vy
    if (y > 400 || y < 50) vy = -vy
    rafId = requestAnimationFrame(animate)
    if (hl.redraw) hl.redraw()
  }
  hl.draw = (ctx: any) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.arc(ctx.canvas.width / 2, y, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#f59e0b'
    ctx.fill()
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 2
    ctx.stroke()
    hl.completeRender()
  }
  animate()
  // eslint-disable-next-line no-underscore-dangle
  ;(hl as any)._rafId = rafId
  hl.onRemove = () => { if (rafId) cancelAnimationFrame(rafId) }
  return hl
})
</script>
