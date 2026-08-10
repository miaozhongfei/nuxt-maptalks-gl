<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2 px-1">
      <span class="text-sm shrink-0">高度: {{ altitude }}m</span>
      <USlider v-model="altitude" :min="0" :max="800" :step="50" class="w-72" />
    </div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const altitude = ref(500)
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 55 })
useMaptalksTileLayer(map, { source: 'osm' })
// 三维矢量图层：开启海拔读取与高度线绘制
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } })
// 带 altitude 属性的 Marker
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { properties: { altitude: 500 }, symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
})
// 滑块变化时 setAltitude 动态更新 Marker 高度（基类已建模）
watch(altitude, (v) => {
  geometry.value?.setAltitude(v)
})

const status = computed(() => (isReady.value ? '地图已创建（滑块调高度）' : '加载中…'))
</script>
