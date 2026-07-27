<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="add">添加 Marker 图层</UButton>
      <UButton size="xs" color="primary" @click="removeAll" :disabled="handles.length === 0"
        >移除全部</UButton
      >
      <UBadge color="primary" variant="subtle">图层数 {{ handles.length }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
// osm 瓦片底图，让地图有内容可视
useMaptalksTileLayer(map, { source: 'osm' });

const handles = ref<{ remove: () => void }[]>([]);
const coords = [
  [121.4957, 31.2453],
  [121.5057, 31.2553],
  [121.5157, 31.2453],
  [121.5057, 31.2353],
];
let idx = 0;

function add() {
  // 每次添加创建一个带 Marker 的新矢量图层
  const { layer, remove } = useMaptalksVectorLayer(map);
  useMaptalksMarker(layer, {
    coordinates: coords[idx % coords.length] as [number, number],
    options: {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 },
    },
  });
  handles.value.push({ remove });
  idx++;
}

function removeAll() {
  // 依次移除全部临时图层
  handles.value.forEach((h) => h.remove());
  handles.value = [];
}
</script>
