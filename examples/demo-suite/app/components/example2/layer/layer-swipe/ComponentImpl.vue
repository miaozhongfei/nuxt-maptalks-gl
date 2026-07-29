<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <MaptalksMap
        name="swipe-a"
        base-layer="osm"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <MaptalksMap
        name="swipe-b"
        base-layer="osm"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      >
        <MaptalksTileLayer :options="darkOptions" />
      </MaptalksMap>
    </div>
  </div>
</template>

<script setup lang="ts">
const darkOptions = { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['b', 'c', 'd'] }
useMaptalksSync(['swipe-a', 'swipe-b'])
</script>
