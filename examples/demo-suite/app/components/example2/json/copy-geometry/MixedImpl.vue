<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <MaptalksMap
        ref="mcA"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 380px"
      >
        <MaptalksVectorLayer id="v">
          <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="mkOpts" />
          <MaptalksRectangle ref="rectRef" :coordinates="[121.5057, 31.2453]" :width="1000" :height="800" :options="rectOpts" />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <MaptalksMap
        ref="mcB"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 380px"
      >
        <MaptalksVectorLayer ref="vBRef" id="v" />
      </MaptalksMap>
    </div>
    <UButton size="sm" class="mt-3" @click="copyGeometry">复制几何 - B</UButton>
    <p class="text-sm text-muted mt-2">A 图 Rectangle 经 Geometry.fromJSON 复制到 B 图的空 v 图层——Marker 留在 A（对应官网 11.7）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.7：A 图 v 图层（Marker + Rectangle），rect 经 Geometry.fromJSON 复制到 B 图的空 v 图层
const mkOpts: MaptalksMarkerOptions = {
  symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
}
const rectOpts: MaptalksRectangleOptions = {
  symbol: { polygonFill: '#1bbc9b' },
}

// 声明式 ref 桥接：rectRef 取源几何，vBRef 取 B 图空图层
const mcA = ref<MaptalksMapExposed | null>(null)
const mcB = ref<MaptalksMapExposed | null>(null)
const rectRef = ref<MaptalksRectangleExposed | null>(null)
const vBRef = ref<MaptalksVectorLayerExposed | null>(null)
const rectGeo = computed(() => toValue(rectRef.value?.geometry) ?? null)
const vB = computed(() => toValue(vBRef.value?.layer) ?? null)
const { toJSON, fromJSON } = useMaptalksGeometrySerialize(rectGeo)
async function copyGeometry() {
  const lb = toValue(vB)
  if (!lb) return
  const copy = await fromJSON(toJSON())
  copy?.addTo(lb)
}
</script>
