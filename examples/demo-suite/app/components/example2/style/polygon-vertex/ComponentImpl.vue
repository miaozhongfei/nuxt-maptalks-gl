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
        <MaptalksPolygon
          :coordinates="[[[121.49, 31.253], [121.515, 31.253], [121.515, 31.238], [121.49, 31.238], [121.49, 31.253]]]"
          :options="{
            symbol: {
              lineColor: '#34495e',
              lineWidth: 2,
              polygonFill: 'rgb(135,196,240)',
              polygonOpacity: 0.6,
              markerType: 'ellipse',
              markerFill: '#1bbc9b',
              markerLineColor: '#000',
              markerWidth: 30,
              markerHeight: 30,
              markerPlacement: 'vertex',
              textName: 'A',
              textPlacement: 'vertex',
              textFill: '#fff',
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

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（顶点标注）' : '加载中…'))
</script>
