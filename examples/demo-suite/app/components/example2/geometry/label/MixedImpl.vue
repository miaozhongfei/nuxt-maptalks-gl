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
