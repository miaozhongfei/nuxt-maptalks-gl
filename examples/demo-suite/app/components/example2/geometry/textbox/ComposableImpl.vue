<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// 文本框 TextBox
useMaptalksTextBox(layer, {
  content: '文本框 TextBox',
  coordinates: [121.5057, 31.2453],
  width: 160,
  height: 44,
  options: {
    draggable: true,
    textStyle: {
      // auto wrap text
      wrap: true,
      // padding of textbox
      padding: [12, 8],
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
})

const status = computed(() => (isReady.value ? '地图已创建（TextBox 文本框）' : '加载中…'))
</script>
