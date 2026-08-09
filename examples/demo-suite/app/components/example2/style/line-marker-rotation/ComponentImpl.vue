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
        <MaptalksLineString
          :coordinates="[[121.48, 31.23], [121.50, 31.25], [121.51, 31.24], [121.52, 31.26], [121.53, 31.245]]"
          :options="{
            symbol: {
              lineColor: '#1bbc9b',
              lineWidth: 3,
              lineDasharray: [10, 10],
              markerFile: '/images/plane.png',
              markerPlacement: 'vertex',
              markerVerticalAlignment: 'middle',
              markerWidth: 30,
              markerHeight: 30,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（端点旋转 Marker）' : '加载中…'))
</script>
