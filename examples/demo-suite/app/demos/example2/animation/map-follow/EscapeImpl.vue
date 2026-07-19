<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" variant="outline" @click="start">开始跟随</UButton>
      <UButton size="sm" variant="outline" @click="stop">停止</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
const cam = useMaptalksCamera(map);

let marker: unknown = null;
let timer: ReturnType<typeof setInterval> | null = null;
let angle = 0;

useMaptalksGeometry(layer, (mt) => {
  marker = new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 18, markerHeight: 18 },
  });
  return marker as any;
});

function start() {
  if (timer) return;
  timer = setInterval(() => {
    angle += 0.015;
    const cx = 121.5057 + Math.cos(angle) * 0.005;
    const cy = 31.2453 + Math.sin(angle) * 0.005;
    (marker as { setCoordinates: (c: [number, number]) => void }).setCoordinates([cx, cy]);
    // camera follows
    cam.center.value = { x: cx, y: cy };
    cam.zoom.value = 15;
  }, 30);
}

function stop() {
  if (timer) { clearInterval(timer); timer = null; }
}

onBeforeUnmount(() => { stop(); });
</script>
