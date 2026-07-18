<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3">
      <UButton size="sm" @click="read">原生 API 读取完整状态</UButton>
      <pre v-if="stateText" class="text-xs mt-2 p-3 rounded border border-default overflow-auto">{{ stateText }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

const stateText = ref('');
// 逃生舱：getCenter/getZoom/getPitch/getBearing/getSize 原生读取
function read() {
  const m = map.value as unknown as {
    getCenter: () => { x: number; y: number };
    getZoom: () => number;
    getPitch: () => number;
    getBearing: () => number;
    getSize: () => { width: number; height: number };
  } | null;
  if (!m) return;
  const c = m.getCenter();
  stateText.value = JSON.stringify(
    {
      center: [Number(c.x.toFixed(5)), Number(c.y.toFixed(5))],
      zoom: m.getZoom(),
      pitch: m.getPitch(),
      bearing: m.getBearing(),
      size: m.getSize(),
    },
    null,
    2,
  );
}
</script>
