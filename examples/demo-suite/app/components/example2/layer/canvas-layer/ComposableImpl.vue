<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

useMaptalksLayer(map, (mt) => {
  const cl = new mt.CanvasLayer('c', { forceRenderOnMoving: true, forceRenderOnZooming: true })
  cl.prepareToDraw = () => ['Hello', 'maptalks']
  // 原生 draw 类型声明仅 (context: unknown)，运行时 maptalks 实际传 4+ 参数（官网 6.14 同款）——整体逃生舱断言
  cl.draw = function (
    this: any,
    ctx: CanvasRenderingContext2D,
    _view: unknown,
    p1: string,
    p2: string,
  ) {
    const size = toValue(map)?.getSize()
    if (!size) return
    const str = `${p1}, ${p2}`
    ctx.fillStyle = '#f00'
    ctx.font = 'bolder 50px sans-serif'
    const metrics = ctx.measureText(str)
    ctx.fillText(str, size.width / 2 - metrics.width / 2, size.height / 2)
    this.completeRender()
  } as unknown as typeof cl.draw
  // drawOnInteracting 未建模——逃生舱断言（官网 6.14 同款：交互时也重绘）
  ;(cl as unknown as { drawOnInteracting: (...args: unknown[]) => void }).drawOnInteracting =
    cl.draw
  return cl
})

const status = computed(() => (isReady.value ? '地图已创建（CanvasLayer 自定义画板）' : '加载中…'))
</script>
