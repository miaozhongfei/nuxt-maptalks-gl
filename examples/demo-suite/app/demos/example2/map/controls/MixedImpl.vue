<template>
  <!-- 组合：组件建图，控件全部用 composable 挂载 -->
  <MaptalksMap
    ref="mapCmp"
    :center="[-0.113049, 51.498568]"
    :zoom="14"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksZoom(map, { position: 'top-left' });
useMaptalksScale(map, { position: 'bottom-left' });
useMaptalksCompass(map, { position: 'top-right' });
useMaptalksAttribution(map, { position: 'bottom-right' });
</script>
