<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksSerialize.fromJSON——静态 JSON 直接建图（含底图与 Marker，对应官网 11.4）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
    <pre class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ jsonSrc }}</pre>
  </div>
</template>

<script setup lang="ts">
// 官网 11.4：静态 mapJSON（options/baseLayer/layers）→ fromJSON 直接建图
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
// 初始 center/zoom 需显式提供（fromJSON 载入相同值，随后覆盖无感）
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
const { fromJSON } = useMaptalksSerialize(map)

watch(
  () => toValue(map),
  (m) => {
    if (m) fromJSON(JSON.parse(jsonSrc))
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（JSON 已载入）' : '加载中…'))
</script>
