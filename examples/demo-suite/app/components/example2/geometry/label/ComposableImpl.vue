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
// 文字标签 Label
useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.5057, 31.2453],
  options: {
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
  },
});
useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.5057, 31.2553],
  options: {
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
  },
});
</script>
