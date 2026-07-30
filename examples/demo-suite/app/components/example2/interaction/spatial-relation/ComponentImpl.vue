<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksPolygon
          ref="pRef"
          :coordinates="rect"
          :options="{ symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.2 } }"
        />
        <MaptalksMarker :coordinates="insidePt" :options="{ symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 14, markerHeight: 14 } }" />
        <MaptalksMarker :coordinates="outsidePt" :options="{ symbol: { markerType: 'ellipse', markerFill: '#ef4444', markerWidth: 14, markerHeight: 14 } }" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <UBadge variant="subtle" class="mt-2">点击坐标: {{ status }}</UBadge>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const pRef = ref<MaptalksPolygonExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const rect = [[[121.49, 31.26], [121.52, 31.26], [121.52, 31.23], [121.49, 31.23], [121.49, 31.26]]] as [number, number][][]
const insidePt = [121.50, 31.245] as [number, number]
const outsidePt = [121.53, 31.26] as [number, number]
const status = ref('点击地图')

useMaptalksEvents(map, {
  click: (e: unknown) => {
    const ev = e as { containerPoint: { x: number; y: number } }
    const inside = pRef.value?.geometry?.containsPoint(ev.containerPoint)
    status.value = inside ? '内' : '外'
  },
})
</script>
