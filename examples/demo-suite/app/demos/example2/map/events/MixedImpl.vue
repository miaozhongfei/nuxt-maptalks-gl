<template>
  <div>
    <!-- 组合：组件建图 + useMaptalksEvents 桥接 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <ul class="text-xs font-mono mt-3 space-y-1">
      <li v-for="(line, i) in logs" :key="i" class="text-muted">{{ line }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const logs = ref<string[]>([]);
function push(line: string) {
  logs.value = [`${new Date().toLocaleTimeString()} ${line}`, ...logs.value].slice(0, 8);
}
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } };
    push(`click @ ${ev.coordinate?.x.toFixed(4)}, ${ev.coordinate?.y.toFixed(4)}`);
  },
  dblclick: () => push('dblclick'),
  'zoomend moveend': () => push('视野变化（zoomend/moveend）'),
});
</script>
