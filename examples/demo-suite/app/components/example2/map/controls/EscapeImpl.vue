<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">模块未封装的 Toolbar 控件用原生 API 补齐（右上角）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：动态 import maptalks-gl，new 原生控件（Toolbar 模块没有对应封装）
watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    void import('maptalks-gl').then((mt) => {
      const ctl = (mt as unknown as { control: Record<string, new (o: Record<string, unknown>) => { addTo: (m: unknown) => void }> }).control;
      new ctl.Zoom({ position: 'top-left' }).addTo(m);
      new ctl.Toolbar({
        position: 'top-right',
        items: [
          { item: '放大', click: () => m.zoomIn() },
          { item: '缩小', click: () => m.zoomOut() },
        ],
      }).addTo(m);
    });
  },
);
</script>
