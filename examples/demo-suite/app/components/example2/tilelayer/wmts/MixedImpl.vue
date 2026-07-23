<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="12"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <span class="text-sm shrink-0">天地图密钥：</span>
      <UInput v-model="tiandituKey" size="sm" class="w-72" placeholder="请输入天地图密钥" />
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const tiandituKey = ref('46680d606754c1da1972f835f4cb83d6');
useMaptalksTileLayer(map, {
  options: computed(() => ({
    urlTemplate: `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tiandituKey.value}`,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '© 天地图',
  })),
});
</script>
