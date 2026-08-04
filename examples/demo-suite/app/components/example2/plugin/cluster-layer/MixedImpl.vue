<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksLayer 通用原语 + maptalks.markercluster 插件——ClusterLayer 点聚合（对应官网 12.3）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后经通用图层原语消费插件构造器
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

// 插件构造器与 Marker 数据按需加载（maptalks.markercluster 的 ClusterLayer，extends VectorLayer）
const ClusterLayerCtor = ref<any>(null)
const markers = ref<any[]>([])
watch(
  map,
  async (m) => {
    if (!m || ClusterLayerCtor.value) return
    const mod: any = await import('maptalks.markercluster')
    ClusterLayerCtor.value = mod.ClusterLayer
    const mt: any = await import('maptalks-gl')
    const cx = 121.5057
    const cy = 31.2453
    // README 用法：ClusterLayer(id, data, options)——data 为 Marker 数组
    markers.value = Array.from({ length: 100 }, () => new mt.Marker([cx + (Math.random() - 0.5) * 0.05, cy + (Math.random() - 0.5) * 0.05]))
  },
  { immediate: true },
)

// enabled 门控等插件模块就绪后再创建；renderer: 'gl' 对齐插件 gl renderer（maptalks-gl 下 canvas renderer 不兼容）
const { layer } = useMaptalksLayer(
  map,
  () => new ClusterLayerCtor.value('cluster', markers.value, { renderer: 'gl', maxClusterRadius: 160 }),
  { enabled: ClusterLayerCtor },
)
const status = computed(() => (layer.value ? `ClusterLayer 已添加（renderer=gl，markers=${markers.value.length}）` : '加载中…'))
</script>
