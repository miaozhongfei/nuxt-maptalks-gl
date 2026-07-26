<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="swapContent">替换内容</UButton>
      <span class="text-sm text-muted">当前内容: {{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
const text = ref('HTML Marker');
const { uiMarker } = useMaptalksUIMarker(map, {
  options: () => ({
    coordinates: [121.5057, 31.2453],
    content: `<div style="font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff">${text.value}</div>`,
    draggable: true,
  }),
  events: { click: () => alert('UIMarker 被点击了！') },
});
function swapContent() {
  text.value = text.value === 'HTML Marker' ? '内容已替换！' : 'HTML Marker';
}
</script>
