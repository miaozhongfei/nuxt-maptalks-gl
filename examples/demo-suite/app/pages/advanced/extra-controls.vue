<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 更多控件</h1>
    <p class="text-muted mb-6">演示 ZoomControl / ScaleControl / CompassControl / AttributionControl 四种地图控件。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">ZoomControl · 缩放控件</h2></template>
        <MaptalksMap ref="map1" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksZoomControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左上角缩放按钮。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">ScaleControl · 比例尺</h2></template>
        <MaptalksMap ref="map2" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksScaleControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左下角比例尺。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">CompassControl · 指南针</h2></template>
        <MaptalksMap ref="map3" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksCompassControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">点击复位正北。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">AttributionControl · 版权信息</h2></template>
        <MaptalksMap ref="map4" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksAttributionControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">右下角版权标注。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
</script>
