<template>
  <div>
    <input type="range" v-model="swipeVal" min="0" max="100" class="w-full h-2 cursor-col-resize mb-2" />
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
  </div>
</template>

<script setup lang="ts">
const swipeVal = ref(50)
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => mc.value?.map ?? null)

const { layer: lightLayer } = useMaptalksTileLayer(map, {
  options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'], forceRenderOnMoving: true, forceRenderOnZooming: true },
})

let swipeSetup = false
watch([() => toValue(lightLayer), swipeVal], ([l, val]) => {
  if (!l || swipeSetup) return
  swipeSetup = true
  const r = (l as any).getRenderer()
  const orig = r.getCanvasImage.bind(r)
  const swipeCanvas = document.createElement('canvas')
  r.getCanvasImage = function () {
    const img = orig()
    if (!img?.image) return img
    const w = (r.canvas as HTMLCanvasElement).width * (val / 100)
    const h = (r.canvas as HTMLCanvasElement).height
    swipeCanvas.width = (r.canvas as HTMLCanvasElement).width
    swipeCanvas.height = h
    const ctx = swipeCanvas.getContext('2d')!
    ctx.clearRect(0, 0, swipeCanvas.width, h)
    ctx.drawImage(img.image, 0, 0, w, h, 0, 0, w, h)
    img.image = swipeCanvas
    return img
  }
})

watch(swipeVal, () => {
  ;(toValue(lightLayer) as any)?.getRenderer?.()?.setToRedraw?.()
})
</script>
