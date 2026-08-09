<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer id="v">
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="mkOpts" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportJson">导出为 JSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-64">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksVectorLayer + MaptalksMarker——map.toJSON() 序列化整图（含图层与图形，对应官网 11.3）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.3：地图含 VectorLayer('v') + Marker，map.toJSON() 导出整图状态
const mkOpts: MaptalksMarkerOptions = {
  symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
}

const mc = ref<MaptalksMapExposed | null>(null)
const result = ref('')

function exportJson() {
  const json = mc.value?.map?.toJSON?.()
  if (!json) return
  result.value = JSON.stringify(json, null, 2)
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（可导出 JSON）' : '加载中…'))
</script>
