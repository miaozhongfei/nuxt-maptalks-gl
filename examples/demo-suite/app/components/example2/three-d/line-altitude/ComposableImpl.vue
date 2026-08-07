<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 55 })
useMaptalksTileLayer(map, { source: 'osm' })
// 三维矢量图层：开启海拔读取
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } })
// 带 altitude 属性的 LineString：在 pitch > 0 时悬浮在空中
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]],
  options: { properties: { altitude: 400 }, symbol: { lineColor: '#dc2626', lineWidth: 3 } },
})

const status = computed(() => (isReady.value ? '地图已创建（线高度 400m）' : '加载中…'))
</script>
