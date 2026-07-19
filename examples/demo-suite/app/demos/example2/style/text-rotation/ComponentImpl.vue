<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <MaptalksLabel
        content="旋转文字"
        :coordinates="[121.5057, 31.2453]"
        :symbol="{ textFill: '#2563eb', textSize: 18, textRotation: 45 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
