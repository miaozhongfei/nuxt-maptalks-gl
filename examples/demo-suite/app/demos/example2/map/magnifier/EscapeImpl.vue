<template>
  <div class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <div ref="elMain" class="absolute inset-0" />
    <div
      v-show="visible"
      class="absolute z-10 pointer-events-none rounded-full overflow-hidden border-2 border-primary shadow-lg"
      :style="{ width: '180px', height: '180px', left: `${pos.x}px`, top: `${pos.y}px` }"
    >
      <div ref="elMag" class="absolute inset-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
const elMain = ref<HTMLElement | null>(null);
const elMag = ref<HTMLElement | null>(null);
const visible = ref(false);
const pos = ref({ x: 0, y: 0 });

const { map: mainMap } = useMaptalks(elMain, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(mainMap, { source: 'osm' });
const { map: magMap } = useMaptalks(elMag, {
  center: [121.5057, 31.2453],
  zoom: 15,
  draggable: false,
  zoomable: false,
});
useMaptalksTileLayer(magMap, { source: 'osm' });

// 逃生舱：原生 mousemove + setCenterAndZoom（官网 1.16 同款套路）
watch(
  [() => toValue(mainMap), () => toValue(magMap)],
  ([main, mag]) => {
    if (!main || !mag) return;
    const rawMain = main as unknown as {
      on: (t: string, fn: (e: unknown) => void) => void;
      getZoom: () => number;
    };
    const rawMag = mag as unknown as { setCenterAndZoom: (c: unknown, z: number) => void };
    rawMain.on('mousemove', (e) => {
      const ev = e as { coordinate?: unknown; containerPoint?: { x: number; y: number } };
      if (!ev.coordinate || !ev.containerPoint) return;
      visible.value = true;
      pos.value = { x: ev.containerPoint.x - 90, y: ev.containerPoint.y - 90 };
      rawMag.setCenterAndZoom(ev.coordinate, rawMain.getZoom() + 2);
    });
    rawMain.on('mouseout', () => {
      visible.value = false;
    });
  },
);
</script>
