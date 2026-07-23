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
        :properties="{ draggable: true }"
        :symbol="{ textFill: '#dc2626', textSize: 16 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
