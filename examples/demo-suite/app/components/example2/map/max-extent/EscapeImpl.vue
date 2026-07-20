<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="setLimit">原生 new Extent + setMaxExtent</UButton>
      <UButton size="sm" color="neutral" @click="clearLimit">解除限制</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：动态 import 拿命名空间，new 原生 Extent
function setLimit() {
  const m = map.value as unknown as { setMaxExtent: (e: unknown) => void } | null;
  if (!m) return;
  void import('maptalks-gl').then((mt) => {
    m.setMaxExtent(new mt.Extent(121.47, 31.22, 121.55, 31.27));
  });
}
function clearLimit() {
  const m = map.value as unknown as { setMaxExtent: (e: unknown) => void } | null;
  m?.setMaxExtent(null);
}
</script>
