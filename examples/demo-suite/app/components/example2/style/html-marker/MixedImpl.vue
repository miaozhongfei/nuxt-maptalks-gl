<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="14"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksUIMarker(map, {
  options: {
    coordinates: [121.5057, 31.2453],
    content: '<div style="font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff">HTML Marker</div>',
    draggable: true,
  },
});
</script>
