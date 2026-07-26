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
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="error" @click="setColor('#dc2626')">切换红色</UButton>
      <UButton size="sm" color="primary" @click="setColor('#2563eb')">切换蓝色</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
const sym = reactive({
  markerType: 'ellipse',
  markerFill: '#2563eb',
  markerWidth: 20,
  markerHeight: 20,
});
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: () => ({ symbol: { ...sym } }),
});
function setColor(c: string) {
  sym.markerFill = c;
}
</script>
