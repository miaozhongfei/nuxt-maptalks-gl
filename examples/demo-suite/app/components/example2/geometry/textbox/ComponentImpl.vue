<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 文本框 TextBox -->
      <MaptalksTextBox
        content="文本框 TextBox"
        :coordinates="[121.5057, 31.2453]"
        :width="150"
        :height="44"
        :options="{ symbol: { textFill: '#dc2626', textSize: 16 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
