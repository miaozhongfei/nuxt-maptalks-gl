<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

watch(
  // exposed map 是 Ref——toValue 解包取实例（mv.getSize 依赖）
  () => toValue(mc.value?.map),
  async (mv) => {
    if (!mv) return
    const mt = await import('maptalks-gl')
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
      const size = mv.getSize()
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
    // 原生 CanvasLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    cl.addTo(mv as never)
  },
  { immediate: true },
)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（CanvasLayer 自定义画板）' : '加载中…'))
</script>
