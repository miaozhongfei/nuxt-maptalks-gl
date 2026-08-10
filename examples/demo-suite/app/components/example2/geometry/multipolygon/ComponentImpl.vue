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
        <!-- 陆家嘴周边多面（两个小方块） -->
        <MaptalksMultiPolygon
          :coordinates="[
            [[[121.49, 31.236], [121.50, 31.236], [121.50, 31.244], [121.49, 31.244], [121.49, 31.236]]],
            [[[121.512, 31.248], [121.522, 31.248], [121.522, 31.256], [121.512, 31.256], [121.512, 31.248]]],
          ]"
          :options="{ symbol: { polygonFill: '#14b8a6', polygonOpacity: 0.35, lineColor: '#0d9488', lineWidth: 2 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（MultiPolygon 多面）' : '加载中…'))
</script>
