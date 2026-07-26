<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksInfoWindow
        :coordinates="[121.5057, 31.2453]"
        :visible="show"
        :options="{ title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' }"
        :events="{ showstart: onShowStart, showend: onShowEnd }"
      />
    </MaptalksMap>
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="show = !show">{{ show ? '隐藏' : '显示' }}信息框</UButton>
      <span class="text-sm text-muted">{{ lastEvent }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const show = ref(true);
const lastEvent = ref('就绪');
function onShowStart() { lastEvent.value = `showstart ${new Date().toLocaleTimeString()}`; }
function onShowEnd() { lastEvent.value = `showend ${new Date().toLocaleTimeString()}`; }
</script>
