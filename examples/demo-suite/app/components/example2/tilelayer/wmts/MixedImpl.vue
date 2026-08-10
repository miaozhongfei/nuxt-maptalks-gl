<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="12"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null);
const map = computed(() => toValue(mc.value?.map) ?? null);
useMaptalksTileLayer(map, {
  options: {
    urlTemplate:
      'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=您的密钥',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '© 天地图',
  },
});

const status = computed(() => (map.value ? '地图已创建（天地图 WMTS）' : '加载中…'));
</script>
