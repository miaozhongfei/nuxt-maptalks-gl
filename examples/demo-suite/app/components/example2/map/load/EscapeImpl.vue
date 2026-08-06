<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">逃生舱——useMaptalksLayer 工厂注入原生 TileLayer（内联 carto 模板，对应官网 1.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14, baseLayer: 'osm' })
// 工厂回调注入 maptalks-gl 命名空间（mt），任意原生构造均可使用
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
)

const status = computed(() => (isReady.value ? `地图已创建（zoom ${toValue(map)?.getZoom()}，carto 底图）` : '加载中…'))
</script>
