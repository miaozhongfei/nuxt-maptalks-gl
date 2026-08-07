<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
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
      textRotation: 60,
    },
  },
})
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
        markerRotation: 60,
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
      textRotation: 60,
    },
  },
})
// 文字标注 Marker（useMaptalksMarker，无 markerType 则为纯文字）
useMaptalksMarker(layer, {
  coordinates: [121.5557, 31.2513],
  options: {
    properties: { name: 'Hello\nMapTalks' },
    symbol: {
      textFaceName: 'sans-serif',
      textName: '{name}',
      textSize: 40,
      textFill: '#34495e',
      textHaloFill: '#fff',
      textHaloRadius: 5,
      textWrapCharacter: '\n',
      textHorizontalAlignment: 'middle',
      textVerticalAlignment: 'middle',
      textAlign: 'center',
      textRotation: 60,
    },
  },
})

const status = computed(() => (map.value ? '地图已创建（旋转文字标注）' : '加载中…'))
</script>
