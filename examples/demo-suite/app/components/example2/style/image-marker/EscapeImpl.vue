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
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerFile: '/images/meng.png', markerWidth: 29, markerHeight: 41 },
}))

const status = computed(() => (isReady.value ? '地图已创建（图片标注）' : '加载中…'))
</script>
