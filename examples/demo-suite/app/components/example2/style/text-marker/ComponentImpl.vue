<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <!-- 文字标签 Label -->
        <MaptalksLabel
          content="文字标签 Label"
          :coordinates="[121.5057, 31.2453]"
          :options="{
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
          }"
        />
        <MaptalksLabel
          content="文字标签 Label"
          :coordinates="[121.5057, 31.2553]"
          :options="{
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
          }"
        />
        <!-- 文字标注 Marker（无 markerType 则为纯文字） -->
        <MaptalksMarker
          :coordinates="[121.5557, 31.2513]"
          :options="{
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
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（文字标注）' : '加载中…'))
</script>
