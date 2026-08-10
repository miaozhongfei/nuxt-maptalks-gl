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
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{
            symbol: {
              markerType: 'path',
              markerPath: tigerPath,
              markerPathWidth: 540,
              markerPathHeight: 580,
              markerWidth: 400,
              markerHeight: 400,
              markerDy: 200,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { tigerPath } from './tiger-path'

const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（SVG 路径标注）' : '加载中…'))
</script>
