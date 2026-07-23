<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null);
const tiandituKey = ref('');
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 12 });
// 逃生舱：原生 setUrlTemplate 强制在密钥变化时重新拉取瓦片
let tileRef: { setUrlTemplate: (u: string) => void } | null = null;
useMaptalksLayer(map, (mt) => {
  const l = new mt.TileLayer('base', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    attribution: '© 天地图',
  });
  tileRef = l as unknown as { setUrlTemplate: (u: string) => void };
  return l;
});
watch(tiandituKey, (key) => {
  if (key) {
    tileRef?.setUrlTemplate(`https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`);
  }
});
</script>
