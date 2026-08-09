<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 3D 高度</h1>
    <p class="text-muted mb-6">演示相机俯仰角（pitch）、方位角（bearing）和 <code>useMaptalksCamera</code> 双向同步。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">useMaptalksCamera · 双向同步</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="flyTo3D()">飞到 3D 视角</UButton><UButton size="sm" @click="resetView()">复位</UButton><span class="text-sm text-muted">pitch: {{ pitch ?? '-' }}°, bearing: {{ bearing ?? '-' }}°</span><span class="text-xs text-muted">{{ status1 }}</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · animateTo 3D</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="animateToView()">飞向新视角</UButton><span class="text-xs text-muted">{{ status2 }}</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · setAltitude 高度线</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><span class="text-sm text-muted">native Marker.setAltitude() 高度垂线（maptalks 基础库，非 GL 专属）。</span><span class="text-xs text-muted ml-2">{{ status3 }}</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
const { pitch, bearing } = useMaptalksCamera(map1)

function flyTo3D() {
  toValue(map1)?.animateTo({ pitch: 60, bearing: 45, zoom: 15 }, { duration: 2000 })
}
function resetView() {
  toValue(map1)?.animateTo({ pitch: 0, bearing: 0, zoom: 13 }, { duration: 1000 })
}

const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
function animateToView() {
  toValue(map2)?.animateTo({ center: [121.5, 31.24], zoom: 15, pitch: 70, bearing: 30 }, { duration: 3000 })
}

// 卡片 3：setAltitude 高度线（maptalks 基础库支持，画从 Marker 到地面的垂线）
const el3 = ref<HTMLElement | null>(null)
const { map: map3, isReady: ready3 } = useMaptalks(el3, { center, zoom: 14, pitch: 50 })
useMaptalksTileLayer(map3, { source: 'osm' })
const { layer: vec3 } = useMaptalksVectorLayer(map3)
watch(
  () => toValue(vec3),
  async (layer) => {
    if (!layer) return
    try {
      const mt = await import('maptalks-gl')
      const mk = new mt.Marker([121.4737, 31.2304], { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 14, markerHeight: 14 } })
      mk.setAltitude(500)
      mk.addTo(layer as Parameters<typeof mk.addTo>[0])
      const mk2 = new mt.Marker([121.475, 31.231], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } })
      mk2.setAltitude(300)
      mk2.addTo(layer as Parameters<typeof mk2.addTo>[0])
    } catch {
      // 原生模块加载失败时静默（逃生舱失败不拖垮页面）
    }
  },
)

const status1 = computed(() => (ready1.value ? '地图已创建' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建' : '加载中…'))
const status3 = computed(() => (ready3.value ? '地图已创建（高度线已加）' : '加载中…'))
</script>
