<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——插件 README 用法：new E3Layer(id, ecOptions).addTo(map)——echarts options 直接传入构造（对应官网 12.5）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 10, baseLayer: 'osm' })

const status = ref('加载中…')

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    // 插件 README 用法：new E3Layer(id, ecOptions)——echarts options 直接传入构造
    const { E3Layer }: any = await import('maptalks.e3' as string)
    if (!E3Layer) return
    const cx = 121.5057
    const cy = 31.2453
    // scatter 数据 [lng, lat, value]（插件自动改写 series.coordinateSystem 与 animation）
    const ecOptions = {
      series: [{
        type: 'scatter',
        data: Array.from({ length: 60 }, () => [
          cx + (Math.random() - 0.5) * 0.3,
          cy + (Math.random() - 0.5) * 0.3,
          Math.random() * 100,
        ]),
        symbolSize: (val: number[]) => 5 + (val[2] ?? 0) / 10,
        itemStyle: { color: '#f59e0b' },
      }],
    }
    try {
      new E3Layer('e3', ecOptions).addTo(m as never)
      status.value = 'E3Layer 已添加'
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)
</script>
