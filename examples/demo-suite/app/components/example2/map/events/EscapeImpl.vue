<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <ul class="text-xs font-mono mt-3 space-y-1">
      <li v-for="(line, i) in logs" :key="i" class="text-muted">{{ line }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

const logs = ref<string[]>([]);
function push(line: string) {
  logs.value = [`${new Date().toLocaleTimeString()} ${line}`, ...logs.value].slice(0, 8);
}
// 逃生舱：原生 map.on 直接监听（地图销毁时监听随实例一并释放）
watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    const raw = m as unknown as { on: (t: string, fn: (e: unknown) => void) => void };
    raw.on('click', (e) => {
      const ev = e as { coordinate?: { x: number; y: number } };
      push(`原生 click @ ${ev.coordinate?.x.toFixed(4)}, ${ev.coordinate?.y.toFixed(4)}`);
    });
    raw.on('dblclick', () => push('原生 dblclick'));
    raw.on('zoomend', () => push('原生 zoomend'));
    raw.on('moveend', () => push('原生 moveend'));
  },
);
</script>
