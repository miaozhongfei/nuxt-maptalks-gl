<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap + map.fromJSON(mapJSON)——静态 JSON 直接建图（含底图与 Marker，对应官网 11.4）。</p>
    <pre class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ jsonSrc }}</pre>
  </div>
</template>

<script setup lang="ts">
// 官网 11.4：静态 mapJSON（options/baseLayer/layers）→ Map.fromJSON 直接建图
const jsonSrc = JSON.stringify(
  {
    version: '1.0',
    options: { center: { x: 121.5057, y: 31.2453 }, zoom: 13 },
    baseLayer: {
      type: 'TileLayer',
      id: 'base',
      options: {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['b', 'c', 'd'],
        attribution: '© OpenStreetMap contributors, © CARTO',
      },
    },
    layers: [
      {
        type: 'VectorLayer',
        id: 'v',
        geometries: [
          { feature: { type: 'Feature', geometry: { type: 'Point', coordinates: [121.5057, 31.2453] } } },
        ],
      },
    ],
  },
  null,
  2,
)

const mc = ref<MaptalksMapExposed | null>(null)
const applied = ref(false)

watch(
  () => toValue(mc.value?.map) ?? null,
  async (m) => {
    if (m && !applied.value) {
      applied.value = true
      // maptalks 的 fromJSON 仅静态：取容器 → 移除当前实例 → 静态重建
      const mt = await import('maptalks-gl')
      const container = m.getContainer()
      if (!container) return
      m.remove()
      ;(mt as unknown as MaptalksGLNamespace).Map.fromJSON(container, JSON.parse(jsonSrc))
    }
  },
  { immediate: true },
)
</script>
