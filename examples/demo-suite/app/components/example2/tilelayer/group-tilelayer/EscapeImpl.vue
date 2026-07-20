<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import type { MaptalksLayer } from '@lacqjs/nuxt-maptalks-gl';

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
// GroupTileLayer 逃生舱：窄化 cast mt 命名空间以获取 GroupTileLayer 构造器
// GroupTileLayer 将多个 TileLayer 合并为一组，统一调度渲染与销毁
useMaptalksLayer(map, (mt) => {
  const GroupCtor = (
    mt as unknown as {
      GroupTileLayer: new (id: string, layers: unknown[], o?: Record<string, unknown>) => MaptalksLayer;
    }
  ).GroupTileLayer;
  // 子层 a：carto 亮色底图
  const base = new mt.TileLayer('a', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  // 子层 b：carto 纯标注层，叠加在底图之上
  const labels = new mt.TileLayer('b', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  return new GroupCtor('group', [base, labels], {});
});
</script>
