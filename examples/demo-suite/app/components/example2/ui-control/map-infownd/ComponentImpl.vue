<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show" :options="{ title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' }" />
  </MaptalksMap>
  <UButton size="sm" class="mt-3" @click="show = !show">{{ show ? '隐藏' : '显示' }}信息框</UButton>
</template>

<script setup lang="ts">
const show = ref(true)
</script>
