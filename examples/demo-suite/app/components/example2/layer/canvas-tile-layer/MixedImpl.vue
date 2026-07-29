<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs mt-2 text-muted">不推荐使用 CanvasTileLayer，优先使用标准 TileLayer</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
let bound = false

watch(
  () => mc.value?.map,
  async (mv) => {
    if (!mv || bound) return
    bound = true
    const mt = await import('maptalks-gl')
    const ctl = new mt.CanvasTileLayer('ct', { urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' })
    ;(ctl as unknown as { drawTile: (canvas: HTMLCanvasElement, ctx: { x: number; y: number; z: number }, onComplete: (err: null) => void) => void }).drawTile = (
      canvas: HTMLCanvasElement,
      tileContext: { x: number; y: number; z: number },
      onComplete: (err: null) => void,
    ) => {
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#2563eb33'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#2563eb'
      ctx.font = '12px sans-serif'
      ctx.fillText(`${tileContext.x}/${tileContext.y}/${tileContext.z}`, 4, canvas.height - 4)
      onComplete(null)
    }
    ctl.addTo(mv as any)
  },
)
</script>
