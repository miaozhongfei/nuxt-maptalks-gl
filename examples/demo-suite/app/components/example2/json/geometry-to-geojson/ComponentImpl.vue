<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksVectorLayer id="v">
        <MaptalksMarker ref="mkRef" :coordinates="[121.5057, 31.2453]" :options="mkOpts" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportGeoJSON">导出为 GeoJSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksMarker——properties 随几何，toGeoJSON() 导出（对应官网 11.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// 官网 11.2：Marker 带 properties，toGeoJSON() 导出（properties 随几何）
const mkOpts: MaptalksMarkerOptions = {
  properties: { name: 'point marker' },
  symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
}

const mkRef = ref<MaptalksMarkerExposed | null>(null)
const result = ref('')

function exportGeoJSON() {
  const geo = mkRef.value?.geometry
  if (!geo) return
  result.value = JSON.stringify(geo.toGeoJSON(), null, 2)
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可导出 GeoJSON）' : '加载中…'))
</script>
