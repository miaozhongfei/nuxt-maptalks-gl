<template>
  <div>
    <h1>几何动画</h1>
    <p style="color:#666">使用 useMaptalksGeomAnimate 对 Marker 做变形动画</p>
    <div ref="el" style="height:440px;width:100%;border:1px solid #e0e0e0;border-radius:8px" data-testid="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 12 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry: marker } = useMaptalksMarker(layer, { coordinates: [121.4737, 31.2304], options: { symbol: { markerType: 'ellipse', markerWidth: 30, markerHeight: 30, markerFill: '#de3333' } } })
</script>
