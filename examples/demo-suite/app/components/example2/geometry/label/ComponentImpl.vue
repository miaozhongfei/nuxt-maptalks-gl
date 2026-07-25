<template>
  <MaptalksMap
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
        :options="{ symbol: { textFill: '#dc2626', textSize: 16 }, draggable: true }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
