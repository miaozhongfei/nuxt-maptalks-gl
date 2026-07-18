<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="set(60, -45)">俯仰 60° · 旋转 -45°</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="set(30, 90)">俯仰 30° · 旋转 90°</UButton>
      <UButton size="sm" color="neutral" @click="set(0, 0)">复位</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：原生 setPitch / setBearing 直调
function set(p: number, b: number) {
  const m = map.value as unknown as { setPitch: (v: number) => void; setBearing: (v: number) => void } | null;
  m?.setPitch(p);
  m?.setBearing(b);
}
</script>
