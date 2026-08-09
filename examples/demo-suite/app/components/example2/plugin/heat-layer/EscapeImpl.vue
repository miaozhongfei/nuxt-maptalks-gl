<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——插件 README ES6 用法：import { HeatLayer } → new HeatLayer(...).addTo(map)（对应官网 12.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    // 插件 README ES6 用法：import 插件模块后用其导出的 HeatLayer 类（extends maptalks.Layer）
    const { HeatLayer }: any = await import('maptalks.heatmap' as string)
    const cx = 121.5057
    const cy = 31.2453
    // 200 个随机点，README 格式 [[lng, lat, value]]
    const data: number[][] = Array.from({ length: 200 }, () => [
      cx + (Math.random() - 0.5) * 0.05,
      cy + (Math.random() - 0.5) * 0.05,
      Math.random() * 100,
    ])
    // renderer: 'gl' 对齐官方 gl demo（maptalks-gl 下 canvas renderer 不兼容）
    try {
      const layer: any = new HeatLayer('heat', data, {
        renderer: 'gl',
        heatValueScale: 0.7,
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        radius: 30,
      })
      layer.addTo(m as never)
      status.value = `已添加（renderer=${layer.options?.renderer}，data=${layer.getData()?.length}）`
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)
</script>
