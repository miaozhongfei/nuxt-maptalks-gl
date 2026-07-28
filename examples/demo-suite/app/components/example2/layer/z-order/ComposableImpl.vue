<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="() => sort321()">排序 3,2,1（3 在顶层）</UButton>
      <UButton size="xs" @click="() => sort123()">排序 1,2,3（1 在顶层）</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer: layer1 } = useMaptalksVectorLayer(map, { id: '1' })
useMaptalksPolygon(layer1, {
  coordinates: layer1Coords,
  options: { symbol: layer1Symbol },
})

const { layer: layer2 } = useMaptalksVectorLayer(map, { id: '2' })
useMaptalksPolygon(layer2, {
  coordinates: layer2Coords,
  options: { symbol: layer2Symbol },
})

const { layer: layer3 } = useMaptalksVectorLayer(map, { id: '3' })
useMaptalksPolygon(layer3, {
  coordinates: layer3Coords,
  options: { symbol: layer3Symbol },
})

function sort321() { toValue(map)?.sortLayers?.(['1', '2', '3']) }
function sort123() { toValue(map)?.sortLayers?.(['3', '2', '1']) }

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
