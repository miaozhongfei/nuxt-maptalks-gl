<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="limit">原生 setMinZoom(12) / setMaxZoom(16)</UButton>
      <UButton size="sm" color="neutral" @click="unlimit">解除限制</UButton>
      <span class="text-sm text-muted">当前缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// 相机实时回流缩放（逃生舱按钮仍用原生 setMinZoom/setMaxZoom）
const cam = useMaptalksCamera(map);

// 逃生舱：原生 setMinZoom / setMaxZoom
function limit() {
  const m = map.value as unknown as { setMinZoom: (v: number) => void; setMaxZoom: (v: number) => void } | null;
  m?.setMinZoom(12);
  m?.setMaxZoom(16);
}
function unlimit() {
  const m = map.value as unknown as { setMinZoom: (v: number) => void; setMaxZoom: (v: number) => void } | null;
  m?.setMinZoom(1);
  m?.setMaxZoom(19);
}
</script>
