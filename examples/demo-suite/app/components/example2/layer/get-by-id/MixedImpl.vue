<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.4854, 31.2285]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => highlightById(100)">高亮 100</UButton>
      <UButton size="xs" color="primary" @click="() => highlightById(200)">高亮 200</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer } = useMaptalksVectorLayer(map)

const polyData = [
  { id: 100, coords: [[121.4555, 31.2338], [121.4685, 31.2338], [121.4685, 31.2228], [121.4555, 31.2228]] as [number, number][] },
  { id: 200, coords: [[121.4755, 31.2338], [121.4885, 31.2338], [121.4885, 31.2228], [121.4755, 31.2228]] as [number, number][] },
  { id: 300, coords: [[121.4955, 31.2338], [121.5085, 31.2338], [121.5085, 31.2228], [121.4955, 31.2228]] as [number, number][] },
]

polyData.forEach((item) => {
  useMaptalksPolygon(layer, {
    coordinates: item.coords,
    id: item.id,
    options: { symbol: [{ polygonFill: '#747474', polygonOpacity: 0.5, lineColor: '#000', lineWidth: 2 }, { textName: '{count}', textSize: 40, textFill: '#fff' }], properties: { count: item.id } },
  })
})

function highlightById(id: number) {
  toValue(layer)?.getGeometryById?.(id)?.updateSymbol?.([{ polygonFill: '#f00' }])
}

const status = computed(() => (map.value ? '地图已创建（可按 ID 高亮图形）' : '加载中…'))
</script>
