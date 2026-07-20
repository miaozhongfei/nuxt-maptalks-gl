<template>
  <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" :pitch="60" :bearing="30" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
useMaptalksCompass(map, { position: 'top-right' })
</script>
