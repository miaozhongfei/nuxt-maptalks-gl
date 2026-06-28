<template>
  <div>
    <h1>形状与文本几何</h1>
    <div style="margin-bottom: 12px">
      <button data-testid="grow" @click="grow">放大圆半径</button>
      <span style="margin-left: 12px; color: #444">radius: {{ radius }}</span>
    </div>
    <MaptalksMap :center="[121.4737, 31.2304]" :zoom="12" data-testid="map" class="map">
      <MaptalksTileLayer source="osm" />
      <MaptalksVectorLayer>
        <MaptalksCircle :coordinates="[121.47, 31.23]" :radius="radius" :symbol="{ polygonFill: '#de3333', polygonOpacity: 0.3 }" />
        <MaptalksRectangle :coordinates="[121.48, 31.24]" :width="500" :height="300" :symbol="{ polygonFill: '#1bbc9b', polygonOpacity: 0.3 }" />
        <MaptalksLabel :content="'标注'" :coordinates="[121.49, 31.23]" />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const radius = ref(300);

/** 放大圆半径（extraProp setRadius） */
function grow(): void {
  radius.value += 100;
}
</script>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
