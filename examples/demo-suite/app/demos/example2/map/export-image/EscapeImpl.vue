<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="preview">预览截图</UButton>
      <UButton size="sm" color="neutral" @click="exportNative">下载 PNG（原生）</UButton>
    </div>
    <img
      v-if="dataUrl"
      :src="dataUrl"
      alt="地图截图预览"
      class="mt-3 rounded border border-default max-h-60"
    >
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

const dataUrl = ref<string | null>(null);
// 预览：原生 toDataURL 展示截图
function preview() {
  const m = map.value as unknown as { toDataURL: (o?: Record<string, unknown>) => string } | null;
  dataUrl.value = m?.toDataURL?.({ mimeType: 'image/png' }) ?? null;
}
// 逃生舱：原生 toDataURL + 手工 <a download>
function exportNative() {
  const m = map.value as unknown as { toDataURL: (o?: Record<string, unknown>) => string } | null;
  const url = m?.toDataURL?.({ mimeType: 'image/png' });
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'map-native.png';
  a.click();
}
</script>
