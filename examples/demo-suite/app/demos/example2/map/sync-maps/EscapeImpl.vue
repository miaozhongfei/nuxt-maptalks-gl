<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div
        ref="elA"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <div
        ref="elB"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
    </div>
    <p class="text-sm text-muted mt-2">原生事件互相镜像（moving/zooming/rotate/pitch），拖动任意一侧另一侧跟随。</p>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMap as MtMap } from '@lacqjs/nuxt-maptalks-gl';

const elA = ref<HTMLElement | null>(null);
const elB = ref<HTMLElement | null>(null);
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13 });
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(mapA, { source: 'osm' });
useMaptalksTileLayer(mapB, { source: 'osm' });

// 逃生舱：官网同款事件镜像；lock 防止 A→B→A 循环触发
let lock = false;
function bind(src: MtMap, dst: MtMap) {
  const s = src as unknown as {
    on: (t: string, fn: () => void) => void;
    getCenter: () => unknown;
    getZoom: () => number;
    getPitch: () => number;
    getBearing: () => number;
  };
  const d = dst as unknown as {
    setCenter: (c: unknown) => void;
    setZoom: (z: number, o?: Record<string, unknown>) => void;
    setPitch: (v: number) => void;
    setBearing: (v: number) => void;
  };
  s.on('moving moveend zooming zoomend rotate pitch', () => {
    if (lock) return;
    lock = true;
    d.setCenter(s.getCenter());
    d.setZoom(s.getZoom(), { animation: false });
    d.setPitch(s.getPitch());
    d.setBearing(s.getBearing());
    lock = false;
  });
}
// 两张地图都就绪后互绑
watch(
  [() => toValue(mapA), () => toValue(mapB)],
  ([a, b]) => {
    if (!a || !b) return;
    bind(a, b);
    bind(b, a);
  },
);
</script>
