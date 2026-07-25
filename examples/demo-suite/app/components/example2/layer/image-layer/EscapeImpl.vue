<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">ImageLayer 在地图上叠加 maptalks Logo 图片（逃生舱）</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：useMaptalksLayer 工厂创建 ImageLayer 叠加图片
useMaptalksLayer(map, (mt) => {
  const il = new mt.ImageLayer('img', [
    {
      url: '/images/logo-h.png',
      extent: [121.495, 31.235, 121.515, 31.255],
    },
  ], {
    opacity: 0.7,
  });
  return il;
});
</script>
