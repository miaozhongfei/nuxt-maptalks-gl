<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——插件 README 用法：import { ClusterLayer } → new ClusterLayer(...).addTo(map)（对应官网 12.3）。</p>
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
    // 插件 README 用法：ClusterLayer(id, data, options)——data 为 Marker 数组
    const { ClusterLayer }: any = await import('maptalks.markercluster' as string)
    if (!ClusterLayer) return
    const mt: any = await import('maptalks-gl')
    const cx = 121.5057
    const cy = 31.2453
    const markers = Array.from({ length: 100 }, () => new mt.Marker([cx + (Math.random() - 0.5) * 0.05, cy + (Math.random() - 0.5) * 0.05]))
    try {
      // renderer: 'gl' 对齐插件 gl renderer（maptalks-gl 下 canvas renderer 不兼容）
      const layer: any = new ClusterLayer('cluster', markers, { renderer: 'gl', maxClusterRadius: 160 })
      layer.addTo(m as never)
      status.value = `ClusterLayer 已添加（renderer=gl，markers=${markers.length}）`
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)
</script>
