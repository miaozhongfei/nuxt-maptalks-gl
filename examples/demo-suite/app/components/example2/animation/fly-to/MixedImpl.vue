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
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="flyNear">飞行到陆家嘴</UButton>
      <UButton size="sm" variant="outline" @click="flyFar">飞回远处</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);

function flyNear() {
  cam.flyTo({ center: [121.5057, 31.2453], zoom: 15 });
}

function flyFar() {
  cam.flyTo({ center: [121.5057, 31.2453], zoom: 5 });
}
</script>
