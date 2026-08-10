<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.4854, 31.2285]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer ref="vlRef" id="vector">
        <MaptalksPolygon
          v-for="item in polyData"
          :key="item.id"
          :coordinates="item.coords"
          :id="item.id"
          :options="item.options"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => applyDiffStyle()">按 count 应用差异样式</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)
let initialStyleSet = false

watch(
  () => toValue(vlRef.value?.layer),
  (l) => {
    if (!l || initialStyleSet) return
    initialStyleSet = true
    l.setStyle?.({ filter: ['count', '>=', 0], symbol: getSymbol('#747474') })
  },
  { immediate: true },
)

function applyDiffStyle() {
  toValue(vlRef.value?.layer)?.setStyle?.([
    { filter: ['==', 'count', 100], symbol: getSymbol('#1bbc9b') },
    { filter: ['==', 'count', 200], symbol: getSymbol('rgb(216,115,149)') },
    { filter: ['==', 'count', 300], symbol: getSymbol('rgb(135,196,240)') },
  ])
}

function getSymbol(color: string) {
  return [
    { polygonFill: color, polygonOpacity: 0.5, lineColor: '#000', lineWidth: 2 },
    { textName: '{count}', textSize: 40, textFill: '#fff' },
  ]
}

const polyData = [
  {
    id: 100,
    coords: [[121.4555, 31.2338], [121.4685, 31.2338], [121.4685, 31.2228], [121.4555, 31.2228]] as [number, number][],
    options: { properties: { count: 100 } },
  },
  {
    id: 200,
    coords: [[121.4755, 31.2338], [121.4885, 31.2338], [121.4885, 31.2228], [121.4755, 31.2228]] as [number, number][],
    options: { properties: { count: 200 } },
  },
  {
    id: 300,
    coords: [[121.4955, 31.2338], [121.5085, 31.2338], [121.5085, 31.2228], [121.4955, 31.2228]] as [number, number][],
    options: { properties: { count: 300 } },
  },
]

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可按 count 批量换样式）' : '加载中…'))
</script>
