<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
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
