<template>
  <div>
    <h1>地图能力 · 平移与读状态</h1>
    <div style="margin-bottom: 12px; color: #444">
      <button data-testid="pan" @click="panTo([121.4997, 31.2397])">panTo 陆家嘴</button>
      <button data-testid="panby" @click="panBy([120, 0])">panBy 右移</button>
      &nbsp;|&nbsp; resolution: <span data-testid="res">{{ res ?? '—' }}</span>
      &nbsp;|&nbsp; scale: <span data-testid="scale">{{ scale ?? '—' }}</span>
    </div>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

const { panTo, panBy, getResolution, getScale } = useMaptalksCamera(map);
const res = ref<number | null>(null);
const scale = ref<number | null>(null);

/** 读取当前分辨率与比例尺写入显示 */
function refresh(): void {
  res.value = getResolution();
  scale.value = getScale();
}
watchEffect(() => {
  if (map.value) refresh();
});
</script>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
