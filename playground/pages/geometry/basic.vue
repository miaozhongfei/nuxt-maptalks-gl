<template>
  <div>
    <h1>矢量图形 · Marker / 线 / 面</h1>
    <div style="margin-bottom: 12px">
      <button data-testid="move" @click="moveMarker">移动 Marker</button>
      <span data-testid="hit" style="margin-left: 12px; color: #1bbc9b">{{ hitText }}</span>
    </div>
    <MaptalksMap :center="[121.4737, 31.2304]" :zoom="12" data-testid="map" class="map">
      <MaptalksTileLayer source="osm" />
      <MaptalksVectorLayer>
        <MaptalksMarker
          :coordinates="markerPos"
          :symbol="{
            markerType: 'ellipse',
            markerWidth: 20,
            markerHeight: 20,
            markerFill: '#de3333',
          }"
          data-testid="marker"
          @click="onHit('marker')"
        />
        <MaptalksLineString
          :coordinates="[
            [121.46, 31.22],
            [121.49, 31.24],
          ]"
          :symbol="{ lineColor: '#1bbc9b', lineWidth: 3 }"
        />
        <MaptalksPolygon
          :coordinates="[
            [
              [121.47, 31.23],
              [121.5, 31.23],
              [121.5, 31.25],
              [121.47, 31.25],
              [121.47, 31.23],
            ],
          ]"
          :symbol="{ polygonFill: '#1bbc9b', polygonOpacity: 0.3, lineColor: '#1bbc9b' }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const markerPos = ref<[number, number]>([121.4737, 31.2304]);
const hitText = ref('');

/** 替换坐标 ref（shallow watch 触发更新） */
function moveMarker(): void {
  markerPos.value = [markerPos.value[0] + 0.005, markerPos.value[1]];
}
/** 记录被点击的图形 */
function onHit(name: string): void {
  hitText.value = `clicked: ${name}`;
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
