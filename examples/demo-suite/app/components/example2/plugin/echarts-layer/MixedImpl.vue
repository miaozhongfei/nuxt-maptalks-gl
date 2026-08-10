<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="10"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksLayer 通用原语 + maptalks.e3 插件——E3Layer ECharts 图层（对应官网 12.5）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后经通用图层原语消费插件构造器
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

// echarts options：scatter 数据 [lng, lat, value]（插件自动改写 series.coordinateSystem 与 animation）
const cx = 121.5057
const cy = 31.2453
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

// 插件构造器按需加载（maptalks.e3 的 E3Layer，extends maptalks.Layer，dom renderer 与 maptalks-gl 兼容）
const E3LayerCtor = ref<any>(null)
watch(
  map,
  async (m) => {
    if (!m || E3LayerCtor.value) return
    const mod: any = await import('maptalks.e3' as string)
    if (!mod?.E3Layer) return
    E3LayerCtor.value = mod.E3Layer
  },
  { immediate: true },
)

// enabled 门控等插件模块就绪后再创建
const { layer } = useMaptalksLayer(
  map,
  () => new E3LayerCtor.value('e3', ecOptions),
  { enabled: E3LayerCtor },
)
const status = computed(() => (layer.value ? 'E3Layer 已添加' : '加载中…'))
</script>
