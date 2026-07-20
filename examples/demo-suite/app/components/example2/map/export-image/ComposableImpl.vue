<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="preview">预览截图</UButton>
      <UButton size="sm" color="neutral" @click="download('map.png')">下载 PNG</UButton>
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

// 导出 composable：toDataURL 预览 / download 直接下载
const { toDataURL, download } = useMaptalksExport(map);
const dataUrl = ref<string | null>(null);
function preview() {
  dataUrl.value = toDataURL({ mimeType: 'image/png' });
}
</script>
