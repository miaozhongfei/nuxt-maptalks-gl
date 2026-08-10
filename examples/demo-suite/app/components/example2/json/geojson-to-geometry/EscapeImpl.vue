<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.GeoJSON.toGeometry(feature) → Marker addTo（对应官网 11.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.GeoJSON?.toGeometry) return
    // 官网 11.1：Feature → GeoJSON.toGeometry → Marker → addTo(VectorLayer)
    const json = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
      properties: { name: 'point marker' },
    }
    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    const layer = new mt.VectorLayer('v').addTo(m as never)
    mt.GeoJSON.toGeometry(json).addTo(layer)
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（Marker 已转换）' : '加载中…'))
</script>
