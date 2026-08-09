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
      <MaptalksVectorLayer>
        <!-- 陆家嘴点标注 -->
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="markerOptions" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const markerOptions: MaptalksMarkerOptions = {
  symbol: {
    markerType: 'ellipse',
    markerFill: '#2563eb',
    markerWidth: 18,
    markerHeight: 18,
  },
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Marker 标注）' : '加载中…'))
</script>
