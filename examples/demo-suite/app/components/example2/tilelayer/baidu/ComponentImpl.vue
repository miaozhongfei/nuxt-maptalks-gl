<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="12"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      :options="{ spatialReference: srBaidu }"
    >
      <MaptalksTileLayer :options="baiduOptions" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// 百度墨卡托变种投影：SR 传 projection 'baidu'，maptalks 自动匹配百度瓦片编号系统
const srBaidu = { projection: 'baidu' }
const baiduOptions = {
  urlTemplate:
    'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1',
  subdomains: ['0', '1', '2', '3'],
  attribution: '© Baidu',
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（百度投影底图）' : '加载中…'))
</script>
