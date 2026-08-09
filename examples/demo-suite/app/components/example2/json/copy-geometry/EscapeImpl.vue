<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyGeometry">复制几何 - B</UButton>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：Geometry.fromJSON(rect.toJSON()) 复制到 B 图的空 v 图层——Marker 留在 A（对应官网 11.7）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
const { map: mapA, isReady: readyA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { map: mapB, isReady: readyB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

let rectGeo: any = null
let vBLayer: any = null

watch(
  () => toValue(mapA),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.VectorLayer || !mt.Marker || !mt.Rectangle) return
    // A 图：v 图层（Marker + Rectangle，官网 11.7 结构）
    const vA = new mt.VectorLayer('v')
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
    }).addTo(vA)
    rectGeo = new mt.Rectangle([121.5057, 31.2453], 1000, 800, { symbol: { polygonFill: '#1bbc9b' } })
    rectGeo.addTo(vA)
    vA.addTo(m as never)
    // B 图：空 v 图层（复制目标）
    const mb = toValue(mapB)
    if (mb) {
      vBLayer = new mt.VectorLayer('v').addTo(mb as never)
    }
  },
  { immediate: true },
)

async function copyGeometry(): Promise<void> {
  if (!vBLayer || !rectGeo) return
  const mt = await import('maptalks-gl')
  if (!mt.Geometry?.fromJSON) return
  // 静态 fromJSON 返回可空（Geometry | null），先取副本再挂载
  const copy = mt.Geometry.fromJSON(rectGeo.toJSON())
  if (Array.isArray(copy)) {
    copy[0]?.addTo(vBLayer as never)
  } else {
    copy?.addTo(vBLayer as never)
  }
}

const status = computed(() => (readyA.value && readyB.value ? 'A/B 地图已创建（可复制几何）' : '加载中…'))
</script>
