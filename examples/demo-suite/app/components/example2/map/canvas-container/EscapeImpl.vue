<template>
  <div>
    <!-- 外包一个带边框的 div——maptalks 初始化会重置 canvas 自身样式 -->
    <div class="rounded overflow-hidden" style="border: 1px solid #d1d5db; height: 480px">
      <canvas
        ref="el"
        width="1200"
        height="480"
        class="w-full block"
        style="height: 480px"
      />
    </div>
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
