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

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    const mt = await import('maptalks-gl')
    const cl = new mt.CanvasLayer('c', { forceRenderOnMoving: true, forceRenderOnZooming: true })
    cl.prepareToDraw = () => ['Hello', 'maptalks']
    // draw 官网签名 draw(context, params..)——rest 形式对齐（运行时传 context + view + prepareToDraw 结果）
    cl.draw = function (this: any, ctx: CanvasRenderingContext2D, ...params: unknown[]) {
      const size = mv.getSize()
      // 跳过第 2 参 view，取 prepareToDraw 返回的 p1/p2
      const [, p1, p2] = params as [unknown, string, string]
      const str = `${p1}, ${p2}`
      ctx.fillStyle = '#f00'
      ctx.font = 'bolder 50px sans-serif'
      const metrics = ctx.measureText(str)
      ctx.fillText(str, size.width / 2 - metrics.width / 2, size.height / 2)
      this.completeRender()
    }
    // 交互中（拖动/缩放）复用同一绘制逻辑（drawOnInteracting 已建模）
    cl.drawOnInteracting = cl.draw
    // 原生 CanvasLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    cl.addTo(mv as never)
  },
)

const status = computed(() => (isReady.value ? '地图已创建（CanvasLayer 自定义画板）' : '加载中…'))
</script>
