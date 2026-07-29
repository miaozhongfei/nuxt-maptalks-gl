<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksImageLayer :images="images" />
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const images = [
  { url: '/images/logo-h.png', extent: [121.49, 31.235, 121.51, 31.255], opacity: 1 },
  { url: '/images/logo-h.png', extent: [121.50, 31.240, 121.52, 31.260], opacity: 0.4 },
]
</script>
