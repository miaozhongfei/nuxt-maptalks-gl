<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">CanvasLayer 画板图层——绘制 Hello 文字（对应官网 14.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
useMaptalksLayer(map, (mt: any) => {
  const hl = new mt.CanvasLayer('hello')
  hl.draw = (ctx: any) => {
    ctx.font = '32px sans-serif'
    ctx.fillStyle = '#dc2626'
    ctx.textAlign = 'center'
    ctx.fillText('Hello Layer', ctx.canvas.width / 2, ctx.canvas.height / 2 + 10)
    hl.completeRender()
  }
  return hl
})
</script>
