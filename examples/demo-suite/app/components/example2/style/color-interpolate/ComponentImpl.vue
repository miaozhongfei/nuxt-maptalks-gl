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
          v-for="(p, i) in points"
          :key="i"
          :coordinates="p.coord"
          :options="{ symbol, properties: { value: p.value } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// markerFill: { type: 'color-interpolate' } 按 properties.value 插值颜色 green→yellow→red
const symbol = {
  markerWidth: 10,
  markerHeight: 10,
  markerType: 'ellipse' as const,
  markerFill: { type: 'color-interpolate' as const, property: 'value', stops: [[0, 'green'], [50, 'yellow'], [360, 'red']] as const },
  markerLineWidth: 0,
}
const points: { coord: [number, number]; value: number }[] = []
for (let i = 0; i < 28; i++) {
  const lng = 121.49 + Math.random() * 0.04
  const lat = 31.235 + Math.random() * 0.025
  points.push({ coord: [lng, lat], value: Math.floor(Math.random() * 360) })
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（颜色插值）' : '加载中…'))
</script>
