<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[-0.113049, 51.498568]"
    :zoom="14"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { source: 'osm' });
</script>
