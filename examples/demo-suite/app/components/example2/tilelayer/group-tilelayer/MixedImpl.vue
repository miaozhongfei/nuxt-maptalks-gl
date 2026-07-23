<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="14"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import type { MaptalksLayer } from '@lacqjs/nuxt-maptalks-gl';

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
// 桥接 + GroupTileLayer 工厂：组合模式下的逃生舱口
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
