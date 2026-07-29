<template>
  <div>
    <MaptalksMap
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
          :id="String(item.id)"
          :options="item.options"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => highlightById(100)">高亮 100</UButton>
      <UButton size="xs" color="primary" @click="() => highlightById(200)">高亮 200</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const vlRef = ref<any>(null)

function highlightById(id: number) {
  (vlRef.value?.layer as any)?.getGeometryById?.(id)?.updateSymbol?.([{ polygonFill: '#f00' }])
}

const polyData = [
  {
    id: 100,
    coords: [[121.4555, 31.2338], [121.4685, 31.2338], [121.4685, 31.2228], [121.4555, 31.2228]] as [number, number][],
    options: { symbol: [{ polygonFill: '#747474', polygonOpacity: 0.5, lineColor: '#000', lineWidth: 2 }, { textName: '{count}', textSize: 40, textFill: '#fff' }], properties: { count: 100 } },
  },
  {
    id: 200,
    coords: [[121.4755, 31.2338], [121.4885, 31.2338], [121.4885, 31.2228], [121.4755, 31.2228]] as [number, number][],
    options: { symbol: [{ polygonFill: '#747474', polygonOpacity: 0.5, lineColor: '#000', lineWidth: 2 }, { textName: '{count}', textSize: 40, textFill: '#fff' }], properties: { count: 200 } },
  },
  {
    id: 300,
    coords: [[121.4955, 31.2338], [121.5085, 31.2338], [121.5085, 31.2228], [121.4955, 31.2228]] as [number, number][],
    options: { symbol: [{ polygonFill: '#747474', polygonOpacity: 0.5, lineColor: '#000', lineWidth: 2 }, { textName: '{count}', textSize: 40, textFill: '#fff' }], properties: { count: 300 } },
  },
]
</script>
