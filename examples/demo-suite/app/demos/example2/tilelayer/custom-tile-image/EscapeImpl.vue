<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
// urlTemplate 函数：按 (x+y) 奇偶为每张瓦片选择不同源——自定义瓦片处理的最小演示
const tileOptions = {
  urlTemplate: (x: number, y: number, z: number) => {
    const light = `https://b.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`;
    const dark = `https://b.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`;
    return (x + y) % 2 === 0 ? light : dark;
  },
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
};

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
// 逃生舱：useMaptalksLayer 工厂回调注入 maptalks-gl 命名空间（mt），直接构造 TileLayer
useMaptalksLayer(map, (mt) => new mt.TileLayer('base', tileOptions));
</script>
