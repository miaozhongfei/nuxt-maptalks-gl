<template>
  <div>
    <input type="range" v-model="swipeVal" min="0" max="100" class="w-full h-2 cursor-col-resize mb-2" />
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const swipeVal = ref(50)
const el = ref<HTMLElement | null>(null)

const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm', options: { forceRenderOnMoving: true, forceRenderOnZooming: true } })

const { layer: darkLayer } = useMaptalksTileLayer(map, {
  options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'], forceRenderOnMoving: true, forceRenderOnZooming: true },
})

// renderer 结构未建模——逃生舱断言类型（getCanvasImage 劫持实现卷帘裁剪，官网 6.17 同款）
type SwipeRenderer = {
  canvas: HTMLCanvasElement
  getCanvasImage: () => { image?: CanvasImageSource | null } | undefined
  setToRedraw: () => void
}
let r: SwipeRenderer | null = null

let swipeSetup = false
watch(
  () => toValue(darkLayer),
  (l) => {
    if (!l || swipeSetup) return
    swipeSetup = true
    // 局部 const 供劫持闭包使用（顶层 r 在闭包内收窄失效会报可能为 null）
    const rendererApi = l.getRenderer() as SwipeRenderer
    r = rendererApi
    const orig = rendererApi.getCanvasImage.bind(rendererApi)
    const swipeCanvas = document.createElement('canvas')
    rendererApi.getCanvasImage = function () {
      const img = orig()
      if (!img?.image) return img
      const w = rendererApi.canvas.width * (swipeVal.value / 100)
      const h = rendererApi.canvas.height
      swipeCanvas.width = rendererApi.canvas.width
      swipeCanvas.height = h
      const ctx = swipeCanvas.getContext('2d')!
      ctx.clearRect(0, 0, swipeCanvas.width, h)
      ctx.drawImage(img.image, 0, 0, w, h, 0, 0, w, h)
      img.image = swipeCanvas
      return img
    }
  },
)

watch(swipeVal, () => {
  r?.setToRedraw?.()
})

const status = computed(() => (isReady.value ? '地图已创建（拖动滑块查看卷帘）' : '加载中…'))
</script>
