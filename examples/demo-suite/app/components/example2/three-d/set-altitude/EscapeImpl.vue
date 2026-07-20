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
  </div>
</template>

<script setup lang="ts">
const altitude = ref(500);
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 55 });
useMaptalksTileLayer(map, { source: 'osm' });
// 三维矢量图层：开启海拔读取与高度线绘制
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } });
// 逃生舱：useMaptalksGeometry 工厂模式直接 new 原生 Marker
const { geometry } = useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  properties: { altitude: 500 },
}));
// 滑块变化时窄转型调用 setAltitude 动态更新 Marker 高度
type HasSetAltitude = { setAltitude(altitude: number): void };
watch(altitude, (v) => {
  (geometry.value as HasSetAltitude | null)?.setAltitude(v);
});
</script>
