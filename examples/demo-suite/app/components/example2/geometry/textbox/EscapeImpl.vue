<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
// 逃生舱：底图也用模块托管（osm 命名源），保持与其他 tab 视觉统一
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 文本框 TextBox（工厂模式——逃生舱口径：直接 new 原生几何）
useMaptalksGeometry(layer, (mt) => new mt.TextBox('文本框 TextBox', [121.5057, 31.2453], 150, 44, {
  symbol: { textFill: '#dc2626', textSize: 16 },
}));
</script>
