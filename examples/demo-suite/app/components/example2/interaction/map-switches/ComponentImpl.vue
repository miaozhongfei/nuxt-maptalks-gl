<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    :draggable="draggable"
    :zoomable="zoomable"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
  <div class="flex items-center gap-4 mt-3 flex-wrap">
    <div class="flex items-center gap-2">
      <USwitch id="c-drag" v-model="draggable" />
      <label for="c-drag" class="text-sm">拖拽</label>
    </div>
    <div class="flex items-center gap-2">
      <USwitch id="c-zoom" v-model="zoomable" />
      <label for="c-zoom" class="text-sm">缩放</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const draggable = ref(true);
const zoomable = ref(true);
</script>
