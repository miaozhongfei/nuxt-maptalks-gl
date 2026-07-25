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
// 逃生舱：底图也用模块托管（osm 命名源），保持与其他 tab 视觉统一
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 文字标签 Label（工厂模式——逃生舱口径：直接 new 原生几何）
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Label('文字标签 Label', [121.5057, 31.2453], {
      draggable: true,
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#34495e',
        textHaloFill: '#fff',
        textHaloRadius: 4,
        textSize: 18,
        textWeight: 'bold',
        textVerticalAlignment: 'top',
      },
    }),
);
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Label('文字标签 Label', [121.5057, 31.2553], {
      draggable: true,
      boxStyle: {
        padding: [12, 8],
        verticalAlignment: 'top',
        horizontalAlignment: 'left',
        minWidth: 200,
        minHeight: 30,
        symbol: {
          markerType: 'square',
          markerFill: 'rgb(135,196,240)',
          markerFillOpacity: 0.9,
          markerLineColor: '#34495e',
          markerLineWidth: 1,
        },
      },
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#34495e',
        textHaloFill: '#fff',
        textHaloRadius: 4,
        textSize: 18,
        textWeight: 'bold',
        textVerticalAlignment: 'top',
      },
    }),
);
</script>
