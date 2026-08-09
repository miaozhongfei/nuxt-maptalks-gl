<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :pitch="55"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 三维矢量图层：开启海拔读取与海拔线绘制
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } })
// 带 altitude 属性的 Marker：在 pitch > 0 时可看出高度
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { properties: { altitude: 500 }, symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
})

const status = computed(() => (map.value ? '地图已创建（Marker 高度 500m）' : '加载中…'))
</script>
