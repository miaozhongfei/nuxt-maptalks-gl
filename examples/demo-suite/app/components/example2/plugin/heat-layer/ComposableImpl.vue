<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalksLayer 通用原语 + maptalks.heatmap 插件——HeatLayer 热力图层（对应官网 12.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

// 热力数据：200 个随机点，README 格式 [[lng, lat, value]]
const cx = 121.5057
const cy = 31.2453
const heatData: number[][] = Array.from({ length: 200 }, () => [
  cx + (Math.random() - 0.5) * 0.05,
  cy + (Math.random() - 0.5) * 0.05,
  Math.random() * 100,
])

// 插件构造器按需加载（maptalks.heatmap 的 HeatLayer，extends maptalks.Layer 与 maptalks-gl 同源）
const HeatLayerCtor = ref<any>(null)
watch(
  () => toValue(map),
  async (m) => {
    if (!m || HeatLayerCtor.value) return
    const mod: any = await import('maptalks.heatmap' as string)
    if (!mod?.HeatLayer) return
    HeatLayerCtor.value = mod.HeatLayer
  },
  { immediate: true },
)

// 通用图层原语消费插件构造器：enabled 门控等插件模块就绪后再创建
// renderer: 'gl' 对齐官方 gl demo（maptalks-gl 下 canvas renderer 不兼容）
const { layer } = useMaptalksLayer(
  map,
  () => new HeatLayerCtor.value('heat', heatData, {
    renderer: 'gl',
    heatValueScale: 0.7,
    forceRenderOnMoving: true,
    forceRenderOnRotating: true,
    radius: 30,
  }),
  { enabled: HeatLayerCtor },
)
const status = computed(() => (layer.value ? `HeatLayer 已添加（renderer=gl，data=${heatData.length}）` : '加载中…'))
</script>
