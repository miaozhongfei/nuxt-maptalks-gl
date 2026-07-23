<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="12"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <span class="text-sm shrink-0">天地图密钥：</span>
      <UInput v-model="tiandituKey" size="sm" class="w-72" placeholder="请输入天地图密钥" />
    </div>
  </div>
</template>

<script setup lang="ts">
const tiandituKey = ref('');
const tileOptions = ref({
  urlTemplate: '',
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] as string[],
  attribution: '© 天地图',
});
watch(tiandituKey, (key) => {
  tileOptions.value = {
    urlTemplate: key
      ? `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`
      : '',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '© 天地图',
  };
}, { immediate: true });
</script>
