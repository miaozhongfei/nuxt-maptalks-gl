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
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
// 工厂回调注入 maptalks-gl 命名空间（mt），创建底图瓦片图层
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
)
// 第二层：标注层，叠加在底图之上 —— 多图层叠加通过多次 call useMaptalksLayer 实现
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('labels', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  }),
)

const status = computed(() => (isReady.value ? '地图已创建（底图 + 标注层）' : '加载中…'))
</script>
