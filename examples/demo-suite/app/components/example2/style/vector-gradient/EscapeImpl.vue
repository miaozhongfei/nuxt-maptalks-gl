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
// 渐变填充：radial 渐变对象（gl 版可能降级为纯色 fill）
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5057, 31.2453], {
      symbol: {
        markerType: 'ellipse',
        markerFill: {
          type: 'radial',
          colorStops: [
            [0, '#60a5fa'],
            [0.5, '#2563eb'],
            [1, '#1e3a8a'],
          ],
        },
        markerWidth: 300,
        markerHeight: 300,
      },
    }),
)

const status = computed(() => (isReady.value ? '地图已创建（渐变填充标注）' : '加载中…'))
</script>
