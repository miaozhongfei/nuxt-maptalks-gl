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
// GroupTileLayer 已建模（可选成员），非空断言取构造器
useMaptalksLayer(map, (mt) => {
  const base = new mt.TileLayer('a', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  const labels = new mt.TileLayer('b', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  return new mt.GroupTileLayer!('group', [base, labels], {})
})

const status = computed(() => (isReady.value ? '地图已创建（GroupTileLayer 合并渲染）' : '加载中…'))
</script>
