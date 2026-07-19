<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="flyNear">飞行到陆家嘴</UButton>
      <UButton size="sm" variant="outline" @click="flyFar">飞回远处</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：原生 flyTo 直调
function flyNear() {
  const m = map.value as unknown as { flyTo: (c: [number, number], z?: number, o?: Record<string, unknown>) => void } | null;
  m?.flyTo?.([121.5057, 31.2453], 16);
}
function flyFar() {
  const m = map.value as unknown as { flyTo: (c: [number, number], z?: number, o?: Record<string, unknown>) => void } | null;
  m?.flyTo?.([121.5057, 31.2453], 5);
}
</script>
