<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 百度墨卡托变种投影：SR 传 projection 'baidu'，maptalks 自动匹配百度瓦片编号系统
const srBaidu = { projection: 'baidu' }
const baiduOptions = {
  urlTemplate:
    'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1',
  subdomains: ['0', '1', '2', '3'],
  attribution: '© Baidu',
}

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 12,
  spatialReference: srBaidu,
})
useMaptalksTileLayer(map, { options: baiduOptions })

const status = computed(() => (isReady.value ? '地图已创建（百度投影底图）' : '加载中…'))
</script>
