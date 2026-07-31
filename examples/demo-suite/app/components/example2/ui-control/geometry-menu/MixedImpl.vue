<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap ref="mc1" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">旧 API：geo.setMenu({ items })——标准模式。</p>
    </div>
    <div>
      <MaptalksMap ref="mc2" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksGeometryMenu——标准模式。</p>
    </div>
    <div>
      <MaptalksMap ref="mc3" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">旧 API：geo.setMenu({ custom: true })——自定义 HTML。</p>
    </div>
    <div>
      <MaptalksMap ref="mc4" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksGeometryMenu——自定义 HTML。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const MARKERS: [number, number][] = [[121.5057, 31.2453], [121.5080, 31.2453], [121.5020, 31.2453]]
const MKR_SYM = { markerType: 'ellipse' as const, markerFill: '#f59e0b', markerWidth: 14, markerHeight: 14 }

function customEl(zoomIn: () => void, zoomOut: () => void): HTMLElement {
  const d = document.createElement('div'); d.style.cssText = 'padding:2px;min-width:120px'
  const b1 = document.createElement('button'); b1.textContent = '放大'
  b1.style.cssText = 'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b1.addEventListener('click', zoomIn)
  const b2 = document.createElement('button'); b2.textContent = '缩小'
  b2.style.cssText = 'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b2.addEventListener('click', zoomOut)
  d.append(b1, b2)
  return d
}

// —— 旧 API 标准 ——
const mc1 = ref<MaptalksMapExposed | null>(null)
const map1 = computed(() => toValue(mc1.value?.map) ?? null)
const { layer: layer1 } = useMaptalksVectorLayer(map1)
const m1a = useMaptalksMarker(layer1, { coordinates: MARKERS[0], options: { symbol: MKR_SYM } })
const m1b = useMaptalksMarker(layer1, { coordinates: MARKERS[1], options: { symbol: MKR_SYM } })
const m1c = useMaptalksMarker(layer1, { coordinates: MARKERS[2], options: { symbol: MKR_SYM } })
watch([() => toValue(map1), () => toValue(m1a.geometry)], () => { const g = toValue(m1a.geometry); const m = toValue(map1); if (g && m) g.setMenu?.({ width: 160, items: [{ item: '放大', click: () => m.zoomIn() }, { item: '缩小', click: () => m.zoomOut() }] }) })
watch([() => toValue(map1), () => toValue(m1b.geometry)], () => { const g = toValue(m1b.geometry); const m = toValue(map1); if (g && m) g.setMenu?.({ width: 160, items: [{ item: '放大', click: () => m.zoomIn() }, { item: '缩小', click: () => m.zoomOut() }] }) })
watch([() => toValue(map1), () => toValue(m1c.geometry)], () => { const g = toValue(m1c.geometry); const m = toValue(map1); if (g && m) g.setMenu?.({ width: 160, items: [{ item: '放大', click: () => m.zoomIn() }, { item: '缩小', click: () => m.zoomOut() }] }) })

// —— 新封装 标准 ——
const mc2 = ref<MaptalksMapExposed | null>(null)
const map2 = computed(() => toValue(mc2.value?.map) ?? null)
const { layer: layer2 } = useMaptalksVectorLayer(map2)
const m2a = useMaptalksMarker(layer2, { coordinates: MARKERS[0], options: { symbol: MKR_SYM } })
const m2b = useMaptalksMarker(layer2, { coordinates: MARKERS[1], options: { symbol: MKR_SYM } })
const m2c = useMaptalksMarker(layer2, { coordinates: MARKERS[2], options: { symbol: MKR_SYM } })
useMaptalksGeometryMenu(m2a.geometry, { options: { width: 160, items: [{ item: '放大', click: () => toValue(map2)?.zoomIn() }, { item: '缩小', click: () => toValue(map2)?.zoomOut() }] } })
useMaptalksGeometryMenu(m2b.geometry, { options: { width: 160, items: [{ item: '放大', click: () => toValue(map2)?.zoomIn() }, { item: '缩小', click: () => toValue(map2)?.zoomOut() }] } })
useMaptalksGeometryMenu(m2c.geometry, { options: { width: 160, items: [{ item: '放大', click: () => toValue(map2)?.zoomIn() }, { item: '缩小', click: () => toValue(map2)?.zoomOut() }] } })

// —— 旧 API 自定义 HTML ——
const mc3 = ref<MaptalksMapExposed | null>(null)
const map3 = computed(() => toValue(mc3.value?.map) ?? null)
const { layer: layer3 } = useMaptalksVectorLayer(map3)
const m3a = useMaptalksMarker(layer3, { coordinates: MARKERS[0], options: { symbol: MKR_SYM } })
const m3b = useMaptalksMarker(layer3, { coordinates: MARKERS[1], options: { symbol: MKR_SYM } })
const m3c = useMaptalksMarker(layer3, { coordinates: MARKERS[2], options: { symbol: MKR_SYM } })
function setOldC(g: any, m: any) { if (g && m) g.setMenu?.({ custom: true, items: customEl(() => m.zoomIn(), () => m.zoomOut()) }) }
watch([() => toValue(map3), () => toValue(m3a.geometry)], () => setOldC(toValue(m3a.geometry), toValue(map3)))
watch([() => toValue(map3), () => toValue(m3b.geometry)], () => setOldC(toValue(m3b.geometry), toValue(map3)))
watch([() => toValue(map3), () => toValue(m3c.geometry)], () => setOldC(toValue(m3c.geometry), toValue(map3)))

// —— 新封装 自定义 HTML ——
const mc4 = ref<MaptalksMapExposed | null>(null)
const map4 = computed(() => toValue(mc4.value?.map) ?? null)
const { layer: layer4 } = useMaptalksVectorLayer(map4)
const m4a = useMaptalksMarker(layer4, { coordinates: MARKERS[0], options: { symbol: MKR_SYM } })
const m4b = useMaptalksMarker(layer4, { coordinates: MARKERS[1], options: { symbol: MKR_SYM } })
const m4c = useMaptalksMarker(layer4, { coordinates: MARKERS[2], options: { symbol: MKR_SYM } })
useMaptalksGeometryMenu(m4a.geometry, { options: { custom: true, items: customEl(() => toValue(map4)?.zoomIn(), () => toValue(map4)?.zoomOut()) } })
useMaptalksGeometryMenu(m4b.geometry, { options: { custom: true, items: customEl(() => toValue(map4)?.zoomIn(), () => toValue(map4)?.zoomOut()) } })
useMaptalksGeometryMenu(m4c.geometry, { options: { custom: true, items: customEl(() => toValue(map4)?.zoomIn(), () => toValue(map4)?.zoomOut()) } })
</script>
