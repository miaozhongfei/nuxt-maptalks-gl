<template>
  <div>
    <h1>地图能力 · 导出图片</h1>
    <div style="margin-bottom: 12px">
      <button data-testid="download" @click="save">下载当前地图为 PNG</button>
    </div>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

const { download } = useMaptalksExport(map);

/** 导出当前地图为 PNG 并触发下载 */
function save(): void {
  download('map.png', { mimeType: 'image/png' });
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
