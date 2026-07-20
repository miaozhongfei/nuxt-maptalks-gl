<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">ParticleLayer — 粒子图层构造（逃生舱；完全初始化需额外粒子配置）</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：useMaptalksLayer 工厂创建 ParticleLayer
// ParticleLayer 完全初始化需额外粒子配置，此处仅演示构造层
useMaptalksLayer(map, (mt) => {
  return new mt.ParticleLayer('particles');
});
</script>
