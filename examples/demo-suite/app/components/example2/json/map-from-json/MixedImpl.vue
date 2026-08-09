<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksSerialize.fromJSON——静态 JSON 直接建图（含底图与 Marker，对应官网 11.4）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
    <pre class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ jsonSrc }}</pre>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后经 useMaptalksSerialize.fromJSON 建图
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
const map = computed(() => toValue(mc.value?.map) ?? null)
const { fromJSON } = useMaptalksSerialize(map)

// 函数 getter watch（对齐组件版）：MaptalksMap expose 的 shallowRef 经代理解包，
// 直接追踪 computed ref 可能失效，getter 每次求值确保捕获 map 就绪时机
watch(
  () => toValue(mc.value?.map) ?? null,
  (m) => {
    if (m) fromJSON(JSON.parse(jsonSrc))
  },
)

const status = computed(() => (map.value ? '地图已创建（JSON 已载入）' : '加载中…'))
</script>
