<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 逃生舱：useMaptalksGeometry 工厂 + animate() 驱动 linePatternDx 动画
const { geometry } = useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.LineString(
      [
        [121.49, 31.235],
        [121.5057, 31.2453],
        [121.52, 31.252],
      ],
      {
        symbol: {
          linePatternFile: '/images/arrow.png',
          linePatternDx: 0,
          lineWidth: 6,
          lineColor: '#dc2626',
        },
      },
    ),
);
watch(
  geometry,
  (g) => {
    if (g)
      (g as unknown as { animate: (p: unknown, o: unknown) => void }).animate(
        { symbol: { linePatternDx: 73 } },
        { repeat: true },
      );
  },
  { immediate: true },
);
</script>
