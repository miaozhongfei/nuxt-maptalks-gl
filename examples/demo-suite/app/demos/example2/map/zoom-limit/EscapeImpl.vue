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
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

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
