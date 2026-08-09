<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalksLayer 通用原语 + maptalks.markercluster 插件——ClusterLayer 点聚合（对应官网 12.3）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

// 插件构造器与 Marker 数据按需加载（maptalks.markercluster 的 ClusterLayer，extends VectorLayer）
const ClusterLayerCtor = ref<any>(null)
const markers = ref<any[]>([])
watch(
  () => toValue(map),
  async (m) => {
    if (!m || ClusterLayerCtor.value) return
    // 先加载 maptalks-gl 生成 Marker 数据（enabled 门控触发工厂时会同步读取 markers.value）
    const mt: any = await import('maptalks-gl')
    const cx = 121.5057
    const cy = 31.2453
    // README 用法：ClusterLayer(id, data, options)——data 为 Marker 数组
    markers.value = Array.from({ length: 100 }, () => new mt.Marker([cx + (Math.random() - 0.5) * 0.05, cy + (Math.random() - 0.5) * 0.05]))
    // 最后再设构造器：enabled 置真时工厂读到的 markers 已填充，避免空数据建图层
    const mod: any = await import('maptalks.markercluster' as string)
    if (!mod?.ClusterLayer) return
    ClusterLayerCtor.value = mod.ClusterLayer
  },
  { immediate: true },
)

// 通用图层原语消费插件构造器：enabled 门控等插件模块就绪后再创建
// renderer: 'gl' 对齐插件 gl renderer（maptalks-gl 下 canvas renderer 不兼容）
const { layer } = useMaptalksLayer(
  map,
  () => new ClusterLayerCtor.value('cluster', markers.value, { renderer: 'gl', maxClusterRadius: 160 }),
  { enabled: ClusterLayerCtor },
)
const status = computed(() => (layer.value ? `ClusterLayer 已添加（renderer=gl，markers=${markers.value.length}）` : '加载中…'))
</script>
