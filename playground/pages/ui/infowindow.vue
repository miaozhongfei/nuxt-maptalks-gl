<template>
  <div>
    <h1>InfoWindow 弹出框</h1>
    <p style="color: #666">点击地图任意位置显示 InfoWindow。</p>
    <div
      data-testid="map"
      style="height: 480px; width: 100%; border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <MaptalksMap
        ref="mapRef"
        :center="[121.47, 31.23]"
        :zoom="12"
        @click="onMapClick"
      >
        <MaptalksTileLayer source="osm" />
        <MaptalksInfoWindow
          :coordinates="iwCoord"
          :visible="iwVisible"
        >
          <div style="padding: 8px; font-size: 14px;">
            <strong>点位信息</strong>
            <p style="margin: 4px 0">经度：{{ iwCoord?.[0] }}</p>
            <p style="margin: 4px 0">纬度：{{ iwCoord?.[1] }}</p>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const iwCoord = ref<[number, number] | null>(null);
const iwVisible = ref(false);

function onMapClick(e: unknown) {
  const evt = e as { coordinate?: { x: number; y: number } };
  if (evt.coordinate) {
    iwCoord.value = [evt.coordinate.x, evt.coordinate.y];
    iwVisible.value = true;
  }
}
</script>
