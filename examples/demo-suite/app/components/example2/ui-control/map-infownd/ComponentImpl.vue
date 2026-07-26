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
    </div>
    <div class="mt-2 text-sm text-muted space-y-0.5">
      <div v-for="(e, i) in events" :key="i">{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const show = ref(true);
const events = ref<string[]>([]);
function onShowStart() { events.value.unshift(`showstart ${new Date().toLocaleTimeString()}`); }
function onShowEnd() { events.value.unshift(`showend ${new Date().toLocaleTimeString()}`); }
</script>
