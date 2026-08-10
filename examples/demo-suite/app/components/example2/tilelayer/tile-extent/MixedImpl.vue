<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="12"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">gl 版 TileLayer 无 extent 选项，等效方案为 mask 多边形裁剪：瓦片只在陆家嘴一圈范围内渲染。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 桥接 + useMaptalksLayer 工厂：创建 TileLayer 并用 setMask 裁剪显示范围（setMask 已建模）
useMaptalksLayer(map, (mt) => {
  const tileLayer = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  const ring = [
    [121.47, 31.22],
    [121.55, 31.22],
    [121.55, 31.27],
    [121.47, 31.27],
    [121.47, 31.22],
  ]
  tileLayer.setMask(new mt.Polygon([ring]))
  return tileLayer
})

const status = computed(() => (map.value ? '地图已创建（mask 裁剪瓦片范围）' : '加载中…'))
</script>
