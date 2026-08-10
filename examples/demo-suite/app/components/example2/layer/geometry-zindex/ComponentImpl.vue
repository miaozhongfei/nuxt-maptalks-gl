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
      <MaptalksVectorLayer>
        <MaptalksPolygon ref="r3" :coordinates="rect3Coords" :options="rect3Options" />
        <MaptalksPolygon ref="r2" :coordinates="rect2Coords" :options="rect2Options" />
        <MaptalksPolygon ref="r1" :coordinates="rect1Coords" :options="rect1Options" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => sort321()"
        >排序 3→2→1（bringToFront）</UButton
      >
      <UButton size="xs" color="primary" @click="() => sort123()">排序 1→2→3（setZIndex）</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const r3 = ref<MaptalksPolygonExposed | null>(null)
const r2 = ref<MaptalksPolygonExposed | null>(null)
const r1 = ref<MaptalksPolygonExposed | null>(null)

// exposed geometry 是 Ref——toValue 解包后调原生排序方法（已建模）
function sort321() {
  toValue(r3.value?.geometry)?.bringToFront?.()
  toValue(r1.value?.geometry)?.bringToBack?.()
}

function sort123() {
  toValue(r1.value?.geometry)?.setZIndex?.(3)
  toValue(r2.value?.geometry)?.setZIndex?.(2)
  toValue(r3.value?.geometry)?.setZIndex?.(1)
}

const rect3Coords = [
  [121.4604, 31.225],
  [121.473, 31.225],
  [121.473, 31.234],
  [121.4604, 31.234],
] as [number, number][]
const rect2Coords = [
  [121.4664, 31.231],
  [121.479, 31.231],
  [121.479, 31.24],
  [121.4664, 31.24],
] as [number, number][]
const rect1Coords = [
  [121.4724, 31.237],
  [121.485, 31.237],
  [121.485, 31.246],
  [121.4724, 31.246],
] as [number, number][]

const rect3Options = {
  symbol: [
    { lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 },
    { textName: '3', textWeight: 'bold', textSize: 30, textFill: '#fff' },
  ],
}
const rect2Options = {
  symbol: [
    { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(216,115,149)', polygonOpacity: 1 },
    { textName: '2', textWeight: 'bold', textSize: 30, textFill: '#fff' },
  ],
}
const rect1Options = {
  symbol: [
    { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(135,196,240)', polygonOpacity: 1 },
    { textName: '1', textWeight: 'bold', textSize: 30, textFill: '#fff' },
  ],
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可调图形 z-index）' : '加载中…'))
</script>
