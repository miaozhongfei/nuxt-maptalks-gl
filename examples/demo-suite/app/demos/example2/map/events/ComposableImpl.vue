<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 最近 8 条事件日志（新的在上） -->
    <ul class="text-xs font-mono mt-3 space-y-1">
      <li v-for="(line, i) in logs" :key="i" class="text-muted">{{ line }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

const logs = ref<string[]>([]);
// 环形日志：只保留最近 8 条
function push(line: string) {
  logs.value = [`${new Date().toLocaleTimeString()} ${line}`, ...logs.value].slice(0, 8);
}
// useMaptalksEvents：key 即事件名（支持空格分隔多事件），生命周期自动解绑
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } };
    push(`click @ ${ev.coordinate?.x.toFixed(4)}, ${ev.coordinate?.y.toFixed(4)}`);
  },
  dblclick: () => push('dblclick'),
  zoomend: () => push('zoomend'),
  moveend: () => push('moveend'),
});
</script>
