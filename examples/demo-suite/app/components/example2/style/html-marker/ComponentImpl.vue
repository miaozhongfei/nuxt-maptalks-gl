<template>
  <div>
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
      <MaptalksUIMarker
        :coordinates="[121.5257, 31.2453]"
        :visible="show"
        :options="{ draggable: true, content: content }"
        :events="{ click: onClick }"
      >
      </MaptalksUIMarker>
    </MaptalksMap>
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="show = !show">{{ show ? '隐藏' : '显示' }}marker</UButton>
      <UButton size="sm" @click="swapContent">替换内容</UButton>
      <span class="text-sm text-muted">当前内容: {{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const show = ref(false);
const text = ref('HTML Marker');
const content = ref(`
  <div style="font: 30px bold sans-serif; color: #34495e; text-shadow: 2px 0 #fff">
    HTML Marker
  </div>
`);
let swapped = false;
function swapContent() {
  swapped = !swapped;
  text.value = swapped ? '内容已替换！' : 'HTML Marker';
  content.value = swapped
    ? `<div style="font: 30px bold sans-serif; color: #34495e; text-shadow: 2px 0 #fff">内容已替换！</div>`
    : `<div style="font: 30px bold sans-serif; color: #34495e; text-shadow: 2px 0 #fff">HTML Marker</div>`;
}
function onClick() {
  alert('UIMarker 被点击了！');
}
</script>
