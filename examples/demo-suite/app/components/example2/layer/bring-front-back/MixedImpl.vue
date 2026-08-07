<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <!-- 底图不用 base-layer：maptalks-gl 0.124.4 的 Layer._getLayerList 按 getLayers().slice(+!!getBaseLayer())
           取图层列表，但 getLayers() 实际不含 baseLayer——有 baseLayer 时错位跳掉第一个普通图层，
           bringToFront/bringToBack 判定列表唯一而直接 no-op。改用普通 TileLayer（无 baseLayer 时列表完整）置顶才生效。 -->
      <MaptalksTileLayer source="osm" />
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" variant="soft" @click="bringBlueFront">蓝层置顶</UButton>
      <UButton size="xs" color="error" variant="soft" @click="bringRedFront">红层置顶</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer: blueLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(blueLayer, {
  coordinates: [[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.8, lineColor: '#1d4ed8', lineWidth: 2 } },
})

const { layer: redLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(redLayer, {
  coordinates: [[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]],
  options: { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.8, lineColor: '#b91c1c', lineWidth: 2 } },
})

function bringBlueFront() { blueLayer.value?.bringToFront?.() }
function bringRedFront() { redLayer.value?.bringToFront?.() }

const status = computed(() => (map.value ? '地图已创建（可置顶图层）' : '加载中…'))
</script>
