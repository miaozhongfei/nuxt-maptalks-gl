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
// textRotation 旋转文字标注
useMaptalksLabel(layer, {
  content: '旋转文字',
  coordinates: [121.5057, 31.2453],
  options: { symbol: { textFill: '#2563eb', textSize: 18, textRotation: 45 } },
});
</script>
