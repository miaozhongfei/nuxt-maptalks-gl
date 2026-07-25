<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
});

const op = ref(1);
const ctl = useMaptalksLayerControl(layer, { opacity: op });
</script>
