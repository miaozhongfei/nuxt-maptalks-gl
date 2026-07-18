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
const baseOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
};

const labelOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
};

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
// 第一层：底图
useMaptalksTileLayer(map, { options: baseOptions });
// 第二层：标注层，叠加在底图之上
useMaptalksTileLayer(map, { id: 'labels', options: labelOptions });
</script>
