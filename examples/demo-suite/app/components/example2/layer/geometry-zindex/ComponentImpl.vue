<template>
  <div>
    <MaptalksMap
      :center="[121.4854, 31.2285]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksPolygon ref="r3" :coordinates="rect3Coords" :options="rect3Options" />
        <MaptalksPolygon ref="r2" :coordinates="rect2Coords" :options="rect2Options" />
        <MaptalksPolygon ref="r1" :coordinates="rect1Coords" :options="rect1Options" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => sort321()">排序 3→2→1（bringToFront）</UButton>
      <UButton size="xs" color="primary" @click="() => sort123()">排序 1→2→3（setZIndex）</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const r3 = ref<MaptalksPolygonExposed | null>(null)
const r2 = ref<MaptalksPolygonExposed | null>(null)
const r1 = ref<MaptalksPolygonExposed | null>(null)

function sort321() {
  ;(r3.value?.geometry as any)?.bringToFront?.()
  ;(r1.value?.geometry as any)?.bringToBack?.()
}

function sort123() {
  ;(r1.value?.geometry as any)?.setZIndex?.(3)
  ;(r2.value?.geometry as any)?.setZIndex?.(2)
  ;(r3.value?.geometry as any)?.setZIndex?.(1)
}

const rect3Coords = [[121.4604, 31.225], [121.473, 31.225], [121.473, 31.234], [121.4604, 31.234]] as [number, number][]
const rect2Coords = [[121.4664, 31.231], [121.479, 31.231], [121.479, 31.240], [121.4664, 31.240]] as [number, number][]
const rect1Coords = [[121.4724, 31.237], [121.485, 31.237], [121.485, 31.246], [121.4724, 31.246]] as [number, number][]

const rect3Options = { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 }, { textName: '3', textWeight: 'bold', textSize: 30, textFill: '#fff' }] }
const rect2Options = { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(216,115,149)', polygonOpacity: 1 }, { textName: '2', textWeight: 'bold', textSize: 30, textFill: '#fff' }] }
const rect1Options = { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(135,196,240)', polygonOpacity: 1 }, { textName: '1', textWeight: 'bold', textSize: 30, textFill: '#fff' }] }
</script>
