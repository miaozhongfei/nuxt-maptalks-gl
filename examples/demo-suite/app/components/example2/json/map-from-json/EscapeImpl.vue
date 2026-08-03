<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：Map.fromJSON(container, mapJSON) 静态建图（对应官网 11.4）。</p>
    <pre class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ jsonSrc }}</pre>
  </div>
</template>

<script setup lang="ts">
// 官网 11.4：静态 mapJSON + maptalks.Map.fromJSON 静态方法直接建图
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

const el = ref<HTMLElement | null>(null)
let mapIns: any = null

watch(
  el,
  async (dom) => {
    if (dom && !mapIns) {
      const mt = await import('maptalks-gl');
      mapIns = (mt as any).Map.fromJSON(dom, JSON.parse(jsonSrc));
    }
  },
  { immediate: true },
)
</script>
