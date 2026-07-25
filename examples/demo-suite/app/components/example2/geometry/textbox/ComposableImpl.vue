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
// 文本框 TextBox
useMaptalksTextBox(layer, {
  content: '文本框 TextBox',
  coordinates: [121.5057, 31.2453],
  width: 160,
  height: 44,
  options: {
    draggable: true,
    textStyle: {
      wrap: true, // auto wrap text
      padding: [12, 8], // padding of textbox
      verticalAlignment: 'top',
      horizontalAlignment: 'right',
      symbol: {
        textFaceName: 'monospace',
        textFill: '#34495e',
        textHaloFill: '#fff',
        textHaloRadius: 4,
        textSize: 18,
        textWeight: 'bold',
      },
    },
    boxSymbol: {
      // box's symbol
      markerType: 'square',
      markerFill: 'rgb(135,196,240)',
      markerFillOpacity: 0.9,
      markerLineColor: '#34495e',
      markerLineWidth: 1,
    },
  },
});
</script>
