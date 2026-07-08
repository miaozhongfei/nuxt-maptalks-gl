<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">MIW BUG 隔离测试</h1>
    <p class="text-muted mb-6">对比 composable 直调 vs 组件调用的 open() 动画差异。</p>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- 左侧：composable 直调 -->
      <UCard>
        <template #header><h2 class="font-semibold">A: composable 直调（uiwA）</h2></template>
        <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height:300px" />
        <template #footer>
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="miwA.open()">手动 open() A</UButton>
            <UButton size="sm" color="neutral" @click="miwA.close()">close() A</UButton>
            <span class="text-sm text-muted">手动点击 Marker 也有动画</span>
          </div>
        </template>
      </UCard>

      <!-- 右侧：组件 MaptalksMarkerInfoWindow -->
      <UCard>
        <template #header><h2 class="font-semibold">B: 组件 MaptalksMarkerInfoWindow（uiwB）</h2></template>
        <MaptalksMap :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksVectorLayer>
            <MaptalksMarker :coordinates="[121.47, 31.23]" :symbol="{ markerType:'ellipse', markerFill:'#dc2626', markerWidth:24, markerHeight:24 }">
              <MaptalksMarkerInfoWindow ref="miwB" title="" :custom="true" animation="scale">
                <div>TEST COMPONENT</div>
              </MaptalksMarkerInfoWindow>
            </MaptalksMarker>
          </MaptalksVectorLayer>
        </MaptalksMap>
        <template #footer>
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="miwB?.open()">手动 open() B</UButton>
            <UButton size="sm" color="neutral" @click="miwB?.close()">close() B</UButton>
            <span class="text-sm text-muted">手动点击 Marker 也有动画</span>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// ===== A: composable 直调 =====
const elA = ref<HTMLElement | null>(null);
const { map: mapA } = useMaptalks(elA, { center, zoom: 13 });
useMaptalksTileLayer(mapA, { source: 'osm' });
const { layer: vecA } = useMaptalksVectorLayer(mapA);
const gA = useMaptalksMarker(vecA, { coordinates: [121.47, 31.23], symbol: { markerType:'ellipse', markerFill:'#2563eb', markerWidth:24, markerHeight:24 } }).geometry;
const miwA = useMaptalksMarkerInfoWindow(gA, { title: '', custom: true, animation: 'scale', content: '<div>TEST COMPOSABLE</div>' });

// ===== B: 组件 MaptalksMarkerInfoWindow =====
const miwB = ref<{ open: () => void; close: () => void } | null>(null);
</script>
