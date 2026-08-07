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
// LineString 模式填充 + animate() 驱动 linePatternDx 动画
const { geometry } = useMaptalksLineString(layer, {
  coordinates: [
    [121.49, 31.235],
    [121.5057, 31.2453],
    [121.52, 31.252],
  ],
  options: {
    symbol: {
      linePatternFile: '/images/arrow.png',
      linePatternDx: 0,
      lineWidth: 6,
      lineColor: '#dc2626',
    },
  },
})
watch(
  geometry,
  (g) => {
    // animate 已建模（可选方法），循环驱动 linePatternDx 偏移动画
    g?.animate?.({ symbol: { linePatternDx: 73 } }, { repeat: true })
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（模式填充动画中）' : '加载中…'))
</script>
