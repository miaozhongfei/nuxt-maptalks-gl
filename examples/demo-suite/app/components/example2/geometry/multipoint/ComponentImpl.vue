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
        <!-- 陆家嘴周边多点标注 -->
        <MaptalksMultiPoint
          :coordinates="[[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（MultiPoint 多点）' : '加载中…'))
</script>
