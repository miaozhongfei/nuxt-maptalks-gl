<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">点击地图尝试点选标记</UBadge>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const highlightSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 };

useMaptalksMarker(layer, { coordinates: [121.495, 31.248], symbol: normalSymbol });
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], symbol: normalSymbol });
useMaptalksMarker(layer, { coordinates: [121.515, 31.242], symbol: normalSymbol });

// placeholder: real identify via escape on map; Mixed tab provides component + composable pattern
useMaptalksEvents(map, { click: () => {} });
</script>
