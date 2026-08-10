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
      <UButton size="xs" color="primary" @click="() => highlightById(100)">高亮 100</UButton>
      <UButton size="xs" color="primary" @click="() => highlightById(200)">高亮 200</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)

// exposed layer 是 Ref——toValue 解包后调 getGeometryById（已建模）链式 updateSymbol
function highlightById(id: number) {
  toValue(vlRef.value?.layer)?.getGeometryById?.(id)?.updateSymbol?.([{ polygonFill: '#f00' }])
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

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可按 ID 高亮图形）' : '加载中…'))
</script>
