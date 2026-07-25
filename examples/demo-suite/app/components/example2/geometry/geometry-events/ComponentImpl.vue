<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <!-- 组件 emits 四个事件：click / dblclick / mouseenter / mouseout -->
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
          @click="push('click')"
          @dblclick="push('dblclick')"
          @mouseenter="push('mouseenter')"
          @mouseout="push('mouseout')"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <!-- 最近 8 条事件日志（新的在上） -->
    <ul class="text-xs font-mono mt-3 space-y-1">
      <li v-for="(line, i) in logs" :key="i" class="text-muted">{{ line }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const logs = ref<string[]>([]);
// 环形日志：只保留最近 8 条
function push(name: string) {
  logs.value = [`${new Date().toLocaleTimeString()} ${name}`, ...logs.value].slice(0, 8);
}
</script>
