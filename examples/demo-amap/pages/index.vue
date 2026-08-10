<template>
  <div>
    <h1 class="text-xl font-bold p-4 pb-1">高德瓦片 · Composable 方式</h1>
    <p class="px-4 pb-2 text-sm text-gray-500">使用 <code>useMaptalks</code> + <code>useMaptalksTileLayer</code> —— <NuxtLink to="/component" class="text-blue-600 underline">查看组件方式示例</NuxtLink></p>
    <div ref="el" class="mx-4 rounded border overflow-hidden" style="height:500px" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 13 });
useMaptalksTileLayer(map, { source: 'amap' });
</script>
