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
              markerType: 'ellipse',
              markerFill: {
                type: 'radial',
                colorStops: [
                  [0, '#60a5fa'],
                  [0.5, '#2563eb'],
                  [1, '#1e3a8a'],
                ],
              },
              markerWidth: 300,
              markerHeight: 300,
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

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（渐变填充标注）' : '加载中…'))
</script>
