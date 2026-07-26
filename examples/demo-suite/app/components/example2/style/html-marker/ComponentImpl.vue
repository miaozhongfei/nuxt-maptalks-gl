<template>
  <div>
    <div class="mb-3 flex items-center gap-2">
      <UButton size="sm" @click="swapContent">替换内容</UButton>
      <span class="text-sm text-muted">当前内容: {{ text }}</span>
    </div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksUIMarker
        :coordinates="[121.5057, 31.2453]"
        :options="{ draggable: true }"
        :events="{ click: onClick }"
      >
        <div style="font: 30px bold sans-serif; color: #34495e; text-shadow: 2px 0 #fff">
          {{ text }}
        </div>
      </MaptalksUIMarker>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const text = ref('HTML Marker');
let swapped = false;
function swapContent() {
  swapped = !swapped;
  text.value = swapped ? '内容已替换！' : 'HTML Marker';
}
function onClick() {
  alert('UIMarker 被点击了！');
}
</script>
