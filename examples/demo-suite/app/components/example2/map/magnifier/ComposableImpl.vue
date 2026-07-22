<template>
  <div class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <!-- 主地图铺满 -->
    <div ref="elMain" class="absolute inset-0" />
    <!-- 放大镜：跟随鼠标的小地图；pointer-events-none 避免抢占主图交互 -->
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

// 主地图
const { map: mainMap } = useMaptalks(elMain, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(mainMap, { source: 'osm' });
// 放大镜地图：禁用一切交互，仅做展示
const { map: magMap } = useMaptalks(elMag, {
  center: [121.5057, 31.2453],
  zoom: 15,
  draggable: false,
  zoomable: false,
  controls: false,
});
useMaptalksTileLayer(magMap, {
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '',
  },
});

const camMain = useMaptalksCamera(mainMap);
const camMag = useMaptalksCamera(magMap);
// 鼠标移动：放大镜中心 = 鼠标处坐标，缩放 = 主图 + 2（相对 ref 双向写入）
useMaptalksEvents(mainMap, {
  mousemove: (e) => {
    const ev = e as { coordinate?: { x: number; y: number }; containerPoint?: { x: number; y: number } };
    if (!ev.coordinate || !ev.containerPoint) return;
    visible.value = true;
    pos.value = { x: ev.containerPoint.x - 90, y: ev.containerPoint.y - 90 };
    camMag.center.value = ev.coordinate;
    camMag.zoom.value = (camMain.zoom.value ?? 13) + 2;
  },
  mouseout: () => {
    visible.value = false;
  },
});
</script>
