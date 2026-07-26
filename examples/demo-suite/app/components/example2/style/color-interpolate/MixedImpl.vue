<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// markerFill: { type: 'color-interpolate' } 按 properties.value 插值颜色 green→yellow→red
const sym = { markerWidth: 10, markerHeight: 10, markerType: 'ellipse', markerFill: { type: 'color-interpolate', property: 'value', stops: [[0, 'green'], [50, 'yellow'], [360, 'red']] }, markerLineWidth: 0 } as const;
for (let i = 0; i < 28; i++) {
  useMaptalksMarker(layer, {
    coordinates: [121.49 + Math.random() * 0.04, 31.235 + Math.random() * 0.025],
    options: { symbol: sym, properties: { value: Math.floor(Math.random() * 360) } },
  });
}
</script>
