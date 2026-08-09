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
useMaptalksMarker(layer, {
  coordinates: [121.49, 31.24],
  options: {
    symbol: [
      {
        markerFile: '/images/avatar.jpg',
        markerWidth: 29,
        markerHeight: 29,
        markerDy: -20,
      },
      {
        markerFile: '/images/marker.png',
      },
    ],
  },
})

const status = computed(() => (isReady.value ? '地图已创建（双图叠加标注）' : '加载中…'))
</script>
