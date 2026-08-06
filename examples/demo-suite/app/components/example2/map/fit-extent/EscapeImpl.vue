<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3">
      <UButton size="sm" @click="fit">原生 map.fitExtent</UButton>
      <UButton size="sm" color="neutral" @click="shrink">缩小视野</UButton>
    </div>
    <p class="text-sm text-muted mt-2">
      中心 {{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}
      · 缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 11 })
useMaptalksTileLayer(map, { source: 'osm' })

// 逃生舱：工厂 new 原生 VectorLayer + Polygon，保存 poly 引用（逃生舱宽松类型）
let poly: any = null
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('fit-v')
  const p = new mt.Polygon(
    [[[121.49, 31.24], [121.52, 31.24], [121.52, 31.255], [121.49, 31.255], [121.49, 31.24]]],
    { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.3, lineColor: '#b91c1c', lineWidth: 2 } },
  )
  layer.addGeometry(p)
  poly = p
  return layer
})

const cam = useMaptalksCamera(map)

// 原生 fitExtent 直调（已建模）
function fit() {
  const m = toValue(map)
  if (m && poly) m.fitExtent(poly.getExtent(), 0)
}
function shrink() {
  cam.animateTo({ zoom: 11 })
}

const status = computed(() => (isReady.value ? '地图已创建（原生 fitExtent 适配）' : '加载中…'))
</script>
