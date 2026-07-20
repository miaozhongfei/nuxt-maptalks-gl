<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" variant="outline" @click="startCircular">开始圆形运动</UButton>
      <UButton size="sm" variant="outline" @click="stopCircular">停止</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

let marker: unknown = null;
let timer: ReturnType<typeof setInterval> | null = null;
let frame = 0;

useMaptalksGeometry(layer, (mt) => {
  marker = new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
  });
  return marker as any;
});

function startCircular() {
  if (timer) return;
  timer = setInterval(() => {
    frame++;
    const angle = frame * 0.02;
    const cx = 121.5057;
    const cy = 31.2453;
    (marker as { setCoordinates: (c: [number, number]) => void }).setCoordinates([
      cx + Math.cos(angle) * 0.01,
      cy + Math.sin(angle) * 0.01,
    ]);
  }, 16);
}

function stopCircular() {
  if (timer) { clearInterval(timer); timer = null; }
}

onBeforeUnmount(() => { stopCircular(); });
</script>
