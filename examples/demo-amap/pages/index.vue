<template>
  <div>
    <h1 class="text-xl font-bold p-4">高德瓦片 · Composable 方式</h1>
    <div ref="el" class="mx-4 rounded border overflow-hidden" style="height:500px" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el);
useMaptalksTileLayer(map, { source: 'amap' });
</script>
