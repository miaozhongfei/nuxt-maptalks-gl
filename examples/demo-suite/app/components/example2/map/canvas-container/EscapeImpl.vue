<template>
  <div>
    <canvas
      ref="el"
      width="1500"
      height="480"
      class="w-full"
      style="border: 1px solid; height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      useMaptalks 的容器参数是 HTMLElement——canvas 元素同样可以直接传入（官网 1.11 同款能力）。
    </p>
  </div>
</template>

<script setup lang="ts">
// canvas 亦是 HTMLElement，直接作为容器传入 useMaptalks
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
</script>
