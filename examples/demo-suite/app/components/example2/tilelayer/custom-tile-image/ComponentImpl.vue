<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">
      urlTemplate 函数逐瓦片编程：按坐标奇偶混搭两套底图（对应官网 2.20）。组件 tab 无法拦截 renderercreate 添加水印，切换至其他 tab 查看水印效果。
    </p>
  </div>
</template>

<script setup lang="ts">
const tileOptions = {
  urlTemplate: (x: number, y: number, z: number) => {
    const light = `https://b.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`;
    const dark = `https://b.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`;
    return (x + y) % 2 === 0 ? light : dark;
  },
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
};
</script>
