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
// GroupTileLayer 通过 useMaptalksLayer 工厂创建：用窄化 cast 取构造器
useMaptalksLayer(map, (mt) => {
  const GroupCtor = (
    mt as unknown as {
      GroupTileLayer: new (id: string, layers: unknown[], o?: Record<string, unknown>) => MaptalksLayer;
    }
  ).GroupTileLayer;
  const base = new mt.TileLayer('a', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  const labels = new mt.TileLayer('b', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  });
  return new GroupCtor('group', [base, labels], {});
});
</script>
