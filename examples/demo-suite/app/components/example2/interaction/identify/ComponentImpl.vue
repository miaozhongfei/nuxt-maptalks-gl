<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          v-for="(p, i) in points"
          :key="i"
          :coordinates="p.coords"
          :options="{ symbol: p.highlighted ? hlSymbol : normSymbol, properties: p.props }"
          @click="onSelect(i)"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <UBadge variant="subtle" class="mt-2">已选中: {{ selected }}</UBadge>
  </div>
</template>

<script setup lang="ts">
const normSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hlSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 }

const points = reactive([
  { coords: [121.49, 31.25] as [number, number], highlighted: false, props: { name: 'A' } },
  { coords: [121.50, 31.24] as [number, number], highlighted: false, props: { name: 'B' } },
  { coords: [121.5057, 31.2453] as [number, number], highlighted: false, props: { name: 'C' } },
  { coords: [121.51, 31.25] as [number, number], highlighted: false, props: { name: 'D' } },
  { coords: [121.52, 31.24] as [number, number], highlighted: false, props: { name: 'E' } },
])

const selected = ref('无')

function onSelect(i: number) {
  points.forEach((p, idx) => { p.highlighted = idx === i })
  selected.value = points[i].props.name
}
</script>
