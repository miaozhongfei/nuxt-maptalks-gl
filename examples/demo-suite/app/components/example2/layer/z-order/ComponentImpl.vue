<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer id="1">
        <MaptalksPolygon :coordinates="layer1Coords" :options="{ symbol: layer1Symbol }" />
      </MaptalksVectorLayer>
      <MaptalksVectorLayer id="2">
        <MaptalksPolygon :coordinates="layer2Coords" :options="{ symbol: layer2Symbol }" />
      </MaptalksVectorLayer>
      <MaptalksVectorLayer id="3">
        <MaptalksPolygon :coordinates="layer3Coords" :options="{ symbol: layer3Symbol }" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="() => sort321()">排序 3,2,1（3 在顶层）</UButton>
      <UButton size="xs" @click="() => sort123()">排序 1,2,3（1 在顶层）</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

function sort321() { mc.value?.map?.sortLayers?.(['1', '2', '3']) }
function sort123() { mc.value?.map?.sortLayers?.(['3', '2', '1']) }

const layer3Coords = [[[121.4807, 31.2418], [121.4975, 31.2418], [121.4975, 31.2508], [121.4807, 31.2508]]]
const layer2Coords = [[[121.4867, 31.2478], [121.5035, 31.2478], [121.5035, 31.2568], [121.4867, 31.2568]]]
const layer1Coords = [[[121.4927, 31.2538], [121.5095, 31.2538], [121.5095, 31.2628], [121.4927, 31.2628]]]

const layer3Symbol = [
  { lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 },
  { textName: 'Layer 3', textWeight: 'bold', textSize: 30, textFill: '#fff' },
]
const layer2Symbol = [
  { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(216,115,149)', polygonOpacity: 1 },
  { textName: 'Layer 2', textWeight: 'bold', textSize: 30, textFill: '#fff' },
]
const layer1Symbol = [
  { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(135,196,240)', polygonOpacity: 1 },
  { textName: 'Layer 1', textWeight: 'bold', textSize: 30, textFill: '#fff' },
]
</script>
