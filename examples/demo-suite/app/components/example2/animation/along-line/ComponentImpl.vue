<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksLineString
          :coordinates="[center, endPt]"
          :options="{
            arrowStyle: 'classic',
            arrowPlacement: 'vertex-last',
            symbol: { lineColor: '#dc2626', lineWidth: 4 },
          }"
        />
        <MaptalksMarker
          ref="mRef"
          :coordinates="center"
          :options="{
            symbol: {
              markerType: 'ellipse',
              markerFill: '#2563eb',
              markerWidth: 18,
              markerHeight: 18,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startMove">开始</UButton>
      <UButton size="sm" variant="outline" @click="resetMarker">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mRef = ref<MaptalksMarkerExposed | null>(null);
const center: [number, number] = [121.5057, 31.2453];
const translateOffset: [number, number] = [0.025, 0.018];
const endPt: [number, number] = [center[0] + translateOffset[0], center[1] + translateOffset[1]];

function startMove() {
  // 官网核心 API：animate({ translate: [dx, dy] }, { duration, focus })
  mRef.value?.geometry
    ?.bringToFront()
    .animate?.({ translate: translateOffset }, { duration: 2000, focus: true });
}
function resetMarker() {
  mRef.value?.geometry?.setCoordinates(center);
}
</script>
