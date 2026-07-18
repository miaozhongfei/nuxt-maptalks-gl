<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="exportNative">原生 map.toDataURL 并下载</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：原生 toDataURL + 手工 <a download>
function exportNative() {
  const m = map.value as unknown as { toDataURL: (o?: Record<string, unknown>) => string } | null;
  const url = m?.toDataURL({ mimeType: 'image/png' });
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'map-native.png';
  a.click();
}
</script>
