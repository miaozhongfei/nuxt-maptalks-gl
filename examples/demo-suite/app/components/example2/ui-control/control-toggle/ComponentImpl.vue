<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksZoomControl v-if="zoomVisible" :options="{ position: 'top-left' }" />
  </MaptalksMap>
  <UButton size="sm" class="mt-3" @click="() => { zoomVisible = !zoomVisible }">{{ zoomVisible ? '隐藏' : '显示' }} Zoom 控件</UButton>
  <p class="text-sm text-muted mt-2">通过 v-if 控制组件显示隐藏（对应官网 10.18）。</p>
</template>

<script setup lang="ts">
const zoomVisible = ref(true)
</script>
