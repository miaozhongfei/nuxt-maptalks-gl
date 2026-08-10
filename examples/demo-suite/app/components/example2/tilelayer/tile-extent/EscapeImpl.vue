<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">gl 版 TileLayer 无 extent 选项，等效方案为 mask 多边形裁剪：瓦片只在陆家嘴一圈范围内渲染。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 12 })

// 逃生舱：setMask 多边形裁剪等效 extent 效果——gl 版 TileLayer 无 extent 选项（setMask 已建模）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  // 陆家嘴一圈多边形，作为 mask 裁剪范围
  const ring = [
    [121.47, 31.22],
    [121.55, 31.22],
    [121.55, 31.27],
    [121.47, 31.27],
    [121.47, 31.22],
  ]
  layer.setMask(new mt.Polygon([ring]))
  return layer
})

const status = computed(() => (isReady.value ? '地图已创建（mask 裁剪瓦片范围）' : '加载中…'))
</script>
