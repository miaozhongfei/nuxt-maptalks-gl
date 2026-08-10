<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UButton size="sm" variant="outline" class="mt-3" @click="animateShow">animateShow 展示</UButton>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const ring = [[[121.49, 31.255], [121.52, 31.255], [121.52, 31.238], [121.49, 31.238], [121.49, 31.255]]] as [number, number][][]
const { geometry } = useMaptalksPolygon(layer, {
  coordinates: ring,
  options: { visible: false, symbol: { lineColor: '#2563eb', lineWidth: 3, polygonFill: '#22c55e', polygonOpacity: 0.4 } },
})

function animateShow() {
  const geo = toValue(geometry)
  geo?.hide()
  geo?.animateShow({ duration: 1500, easing: 'out' })
}

const status = computed(() => (isReady.value ? '地图已创建（可逐面揭示区域）' : '加载中…'))
</script>
