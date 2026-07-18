<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="12"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
    :options="{ spatialReference: srBaidu }"
  />
</template>

<script setup lang="ts">
// 百度墨卡托变种投影：SR 传 projection 'baidu'，maptalks 自动匹配百度瓦片编号系统
const srBaidu = { projection: 'baidu' };
const baiduOptions = {
  urlTemplate:
    'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1',
  subdomains: ['0', '1', '2', '3'],
  attribution: '© Baidu',
};

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { options: baiduOptions });
</script>
