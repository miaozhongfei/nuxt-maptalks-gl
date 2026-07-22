<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :min-zoom="12"
      :max-zoom="16"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">minZoom {{ minZoom }}</span>
        <USlider v-model="minZoom" :min="1" :max="15" :step="1" />
      </div>
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-24 shrink-0">maxZoom {{ maxZoom }}</span>
        <USlider v-model="maxZoom" :min="15" :max="19" :step="1" />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">当前缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}</p>
  </div>
</template>

<script setup lang="ts">
const minZoom = ref(12);
const maxZoom = ref(16);
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
watch([minZoom, maxZoom], ([min, max]) => {
  if (map.value) cam.setZoomRange(min, max);
}, { immediate: true });
</script>
