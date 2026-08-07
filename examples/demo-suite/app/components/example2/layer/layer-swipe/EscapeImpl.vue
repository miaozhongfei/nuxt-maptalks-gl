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
const { isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })

// renderer 结构未建模——逃生舱断言类型（getCanvasImage 劫持实现卷帘裁剪，官网 6.17 同款）
type SwipeRenderer = {
  canvas: HTMLCanvasElement
  getCanvasImage: () => { image?: CanvasImageSource | null } | undefined
  setToRedraw: () => void
}
let r: SwipeRenderer | null = null

watch(
  () => el.value,
  async (container) => {
    if (!container) return
    const mt = await import('maptalks-gl')
    const baseLayer = new mt.TileLayer('base', { urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'] })
    const darkLayer = new mt.TileLayer('dark', { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'], forceRenderOnMoving: true, forceRenderOnZooming: true })
    const m = new mt.Map(container as HTMLElement, { center: [121.5057, 31.2453], zoom: 13, baseLayer })
    // 暗色图层走 addLayer 添加（构造时 layers 数组传入的图层渲染器懒创建，getRenderer 会一直为 null）
    m.addLayer(darkLayer)

    // 渲染器在图层 addTo 后即创建（无需等瓦片加载）——轮询等待就绪，避免 layerload 在瓦片失败时不触发
    const trySetup = () => {
      const renderer = (darkLayer as unknown as { getRenderer(): unknown }).getRenderer()
      if (!renderer) {
        setTimeout(trySetup, 100)
        return
      }
      // 原生类型未声明 getRenderer（模块建模已含）——逃生舱断言
      r = renderer as SwipeRenderer
      const orig = r.getCanvasImage.bind(r)
      const swipeCanvas = document.createElement('canvas')
      r.getCanvasImage = function () {
        const img = orig()
        if (!img?.image) return img
        const w = r.canvas.width * (swipeVal.value / 100)
        const h = r.canvas.height
        swipeCanvas.width = r.canvas.width
        swipeCanvas.height = h
        const ctx = swipeCanvas.getContext('2d')!
        ctx.clearRect(0, 0, swipeCanvas.width, h)
        ctx.drawImage(img.image, 0, 0, w, h, 0, 0, w, h)
        img.image = swipeCanvas
        return img
      }

      watch(swipeVal, () => r?.setToRedraw?.())
    }
    trySetup()
  },
  { once: true },
)

const status = computed(() => (isReady.value ? '地图已创建（拖动滑块查看卷帘）' : '加载中…'))
</script>
